import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Client, 
  Product, 
  Invoice, 
  Quote, 
  Payment, 
  User, 
  AppSettings 
} from '../types';
import { 
  clients as mockClients, 
  products as mockProducts, 
  invoices as mockInvoices,
  quotes as mockQuotes,
  payments as mockPayments,
  users as mockUsers,
  appSettings as mockSettings
} from '../data/mockData';
import { generateInvoiceNumber, generateQuoteNumber, quoteToInvoice } from '../utils/format';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import * as db from '../lib/db';

interface AppContextType {
  // Data
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  quotes: Quote[];
  payments: Payment[];
  users: User[];
  settings: AppSettings;
  currentUser: User | null;

  // Client operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'number'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;

  // Quote operations
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'number'>) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuoteById: (id: string) => Quote | undefined;
  convertQuoteToInvoice: (quoteId: string) => string | undefined; // Returns the new invoice ID

  // Payment operations
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByInvoiceId: (invoiceId: string) => Payment[];

  // Authentication
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Persistance locale : version le schéma pour pouvoir invalider en cas de changement de structure
const STORAGE_KEY = 'appli-facture:data:v1';

interface PersistedData {
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  quotes: Quote[];
  payments: Payment[];
  settings: AppSettings;
}

// Charge les données depuis localStorage ; retourne null si absent ou illisible
const loadPersisted = (): PersistedData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedData) : null;
  } catch {
    return null;
  }
};

// Paramètres par défaut d'un nouveau compte cloud (avant personnalisation)
const defaultSettings = (): AppSettings => ({
  companyName: 'Mon entreprise',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyTaxId: '',
  companyLogo: undefined,
  defaultTaxRate: 18,
  defaultPaymentTerms: 'Paiement à 30 jours',
  currencySymbol: 'FCFA',
  dateFormat: 'jj/MM/AAAA',
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // État initial :
  //  - mode cloud (Supabase configuré) : vide, peuplé après connexion depuis Supabase ;
  //  - mode démo local : localStorage si présent, sinon données de démonstration.
  const persisted = isSupabaseConfigured ? null : loadPersisted();

  const [clients, setClients] = useState<Client[]>(isSupabaseConfigured ? [] : (persisted?.clients ?? mockClients));
  const [products, setProducts] = useState<Product[]>(isSupabaseConfigured ? [] : (persisted?.products ?? mockProducts));
  const [invoices, setInvoices] = useState<Invoice[]>(isSupabaseConfigured ? [] : (persisted?.invoices ?? mockInvoices));
  const [quotes, setQuotes] = useState<Quote[]>(isSupabaseConfigured ? [] : (persisted?.quotes ?? mockQuotes));
  const [payments, setPayments] = useState<Payment[]>(isSupabaseConfigured ? [] : (persisted?.payments ?? mockPayments));
  const [users] = useState<User[]>(mockUsers);
  const [settings, setSettings] = useState<AppSettings>(isSupabaseConfigured ? defaultSettings() : (persisted?.settings ?? mockSettings));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Écrit une modification vers Supabase (mode cloud uniquement), en arrière-plan.
  // Une erreur réseau est journalisée sans bloquer l'UI (l'état local reste à jour).
  const sync = (run: (userId: string) => Promise<unknown>) => {
    if (!isSupabaseConfigured || !currentUser) return;
    run(currentUser.id).catch((err) => console.error('Synchronisation Supabase échouée', err));
  };

  // Gestion de session
  useEffect(() => {
    // Mode démo local : auto-login sur le premier utilisateur fictif
    if (!isSupabaseConfigured || !supabase) {
      setCurrentUser(users[0]);
      return;
    }

    // Mode cloud : dériver currentUser de la session Supabase
    const mapUser = (session: import('@supabase/supabase-js').Session | null): User | null => {
      const u = session?.user;
      if (!u) return null;
      return {
        id: u.id,
        name: (u.user_metadata?.name as string) || u.email || '',
        email: u.email || '',
        role: 'admin',
        createdAt: u.created_at ? new Date(u.created_at) : new Date(),
      };
    };

    supabase.auth.getSession().then(({ data }) => setCurrentUser(mapUser(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(mapUser(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [users]);

  // Mode cloud : charger les données de l'utilisateur une fois par session
  const loadedUserRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!currentUser) {
      // déconnexion : repartir d'un état vide
      loadedUserRef.current = null;
      setClients([]); setProducts([]); setInvoices([]); setQuotes([]); setPayments([]);
      setSettings(defaultSettings());
      return;
    }
    if (loadedUserRef.current === currentUser.id) return; // déjà chargé
    loadedUserRef.current = currentUser.id;

    let cancelled = false;
    (async () => {
      try {
        const data = await db.fetchAllData();
        if (cancelled) return;
        setClients(data.clients);
        setProducts(data.products);
        setInvoices(data.invoices);
        setQuotes(data.quotes);
        setPayments(data.payments);
        if (data.settings) {
          setSettings(data.settings);
        } else {
          // Nouveau compte : créer une ligne de paramètres par défaut
          const defaults = defaultSettings();
          setSettings(defaults);
          db.saveSettings(currentUser.id, defaults).catch((err) =>
            console.error('Création des paramètres échouée', err)
          );
        }
      } catch (err) {
        console.error('Chargement des données Supabase échoué', err);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  // Mode démo local : sauvegarde automatique dans localStorage à chaque modification
  useEffect(() => {
    if (isSupabaseConfigured) return;
    const data: PersistedData = { clients, products, invoices, quotes, payments, settings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota dépassé ou stockage indisponible : on ignore silencieusement
    }
  }, [clients, products, invoices, quotes, payments, settings]);

  // Client operations
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date()
    };
    setClients([...clients, newClient]);
    sync(uid => db.saveClient(uid, newClient));
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    const existing = clients.find(c => c.id === id);
    setClients(clients.map(c => c.id === id ? { ...c, ...client } : c));
    if (existing) sync(uid => db.saveClient(uid, { ...existing, ...client }));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    sync(() => db.deleteClient(id));
  };

  const getClientById = (id: string) => {
    return clients.find(c => c.id === id);
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date()
    };
    setProducts([...products, newProduct]);
    sync(uid => db.saveProduct(uid, newProduct));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    const existing = products.find(p => p.id === id);
    setProducts(products.map(p => p.id === id ? { ...p, ...product } : p));
    if (existing) sync(uid => db.saveProduct(uid, { ...existing, ...product }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    sync(() => db.deleteProduct(id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Invoice operations
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'number'>) => {
    const invoiceNumber = generateInvoiceNumber('FAC', invoices.map(i => i.number));
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substring(2, 10),
      number: invoiceNumber,
      createdAt: new Date()
    };
    setInvoices([...invoices, newInvoice]);
    sync(uid => db.saveInvoice(uid, newInvoice));
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    const existing = invoices.find(i => i.id === id);
    setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoice } : i));
    if (existing) sync(uid => db.saveInvoice(uid, { ...existing, ...invoice }));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    sync(() => db.deleteInvoice(id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(i => i.id === id);
  };

  // Quote operations
  const addQuote = (quote: Omit<Quote, 'id' | 'createdAt' | 'number'>) => {
    const quoteNumber = generateQuoteNumber('DEV', quotes.map(q => q.number));
    const newQuote: Quote = {
      ...quote,
      id: Math.random().toString(36).substring(2, 10),
      number: quoteNumber,
      createdAt: new Date()
    };
    setQuotes([...quotes, newQuote]);
    sync(uid => db.saveQuote(uid, newQuote));
  };

  const updateQuote = (id: string, quote: Partial<Quote>) => {
    const existing = quotes.find(q => q.id === id);
    setQuotes(quotes.map(q => q.id === id ? { ...q, ...quote } : q));
    if (existing) sync(uid => db.saveQuote(uid, { ...existing, ...quote }));
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    sync(() => db.deleteQuote(id));
  };

  const getQuoteById = (id: string) => {
    return quotes.find(q => q.id === id);
  };

  const convertQuoteToInvoice = (quoteId: string) => {
    const quote = getQuoteById(quoteId);
    if (!quote) return undefined;

    const invoiceNumber = generateInvoiceNumber('FAC', invoices.map(i => i.number));
    const newInvoice = quoteToInvoice(quote, invoiceNumber);
    
    setInvoices([...invoices, newInvoice]);
    sync(uid => db.saveInvoice(uid, newInvoice));
    updateQuote(quoteId, { status: 'converted' });

    return newInvoice.id;
  };

  // Payment operations

  /**
   * Recalcule le statut des factures concernées d'après la liste de paiements à jour.
   * Soldée (payé ≥ total) → 'paid' ; une facture marquée 'paid' qui ne l'est plus repasse
   * en 'sent'. Les autres statuts (draft/overdue/cancelled) sont préservés.
   * Mise à jour fonctionnelle pour traiter sans risque plusieurs factures à la fois
   * (ex. un paiement déplacé d'une facture vers une autre).
   */
  const recalcInvoiceStatuses = (invoiceIds: string[], nextPayments: Payment[]) => {
    const ids = [...new Set(invoiceIds)];
    if (ids.length === 0) return;

    // Décider du nouveau statut depuis l'instantané courant des factures
    const changes = new Map<string, Invoice['status']>();
    ids.forEach(id => {
      const inv = invoices.find(i => i.id === id);
      if (!inv) return;
      const totalPaid = nextPayments
        .filter(p => p.invoiceId === id)
        .reduce((sum, p) => sum + p.amount, 0);
      let status = inv.status;
      if (totalPaid >= inv.total) status = 'paid';
      else if (inv.status === 'paid') status = 'sent';
      if (status !== inv.status) changes.set(id, status);
    });
    if (changes.size === 0) return;

    // Une seule mise à jour fonctionnelle applique tous les changements de statut
    setInvoices(prev =>
      prev.map(inv => (changes.has(inv.id) ? { ...inv, status: changes.get(inv.id)! } : inv))
    );
    // Persister chaque facture dont le statut a changé (mode cloud)
    changes.forEach((status, id) => {
      const inv = invoices.find(i => i.id === id);
      if (inv) sync(uid => db.saveInvoice(uid, { ...inv, status }));
    });
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date()
    };
    const next = [...payments, newPayment];
    setPayments(next);
    sync(uid => db.savePayment(uid, newPayment));
    recalcInvoiceStatuses([newPayment.invoiceId], next);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    const existing = getPaymentById(id);
    const next = payments.map(p => p.id === id ? { ...p, ...payment } : p);
    setPayments(next);
    if (existing) sync(uid => db.savePayment(uid, { ...existing, ...payment }));
    // Recalculer l'ancienne et la nouvelle facture (le montant ou la facture liée a pu changer)
    const affected = [existing?.invoiceId, payment.invoiceId].filter(Boolean) as string[];
    recalcInvoiceStatuses(affected, next);
  };

  const deletePayment = (id: string) => {
    const payment = getPaymentById(id);
    if (!payment) return;
    const next = payments.filter(p => p.id !== id);
    setPayments(next);
    sync(() => db.deletePayment(id));
    recalcInvoiceStatuses([payment.invoiceId], next);
  };

  const getPaymentById = (id: string) => {
    return payments.find(p => p.id === id);
  };

  const getPaymentsByInvoiceId = (invoiceId: string) => {
    return payments.filter(p => p.invoiceId === invoiceId);
  };

  // Authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return !error;
    }
    // Mode démo local : on vérifie seulement que l'email existe (mot de passe ignoré)
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: "L'inscription nécessite la configuration de Supabase." };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch((err) => console.error('Déconnexion échouée', err));
    }
    setCurrentUser(null);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    sync(uid => db.saveSettings(uid, merged));
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        products,
        invoices,
        quotes,
        payments,
        users,
        settings,
        currentUser,
        
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        
        addQuote,
        updateQuote,
        deleteQuote,
        getQuoteById,
        convertQuoteToInvoice,
        
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentById,
        getPaymentsByInvoiceId,
        
        login,
        signup,
        logout,

        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};