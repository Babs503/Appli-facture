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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Données initiales : localStorage si disponible, sinon données de démonstration
  const persisted = loadPersisted();

  const [clients, setClients] = useState<Client[]>(persisted?.clients ?? mockClients);
  const [products, setProducts] = useState<Product[]>(persisted?.products ?? mockProducts);
  const [invoices, setInvoices] = useState<Invoice[]>(persisted?.invoices ?? mockInvoices);
  const [quotes, setQuotes] = useState<Quote[]>(persisted?.quotes ?? mockQuotes);
  const [payments, setPayments] = useState<Payment[]>(persisted?.payments ?? mockPayments);
  const [users] = useState<User[]>(mockUsers);
  const [settings, setSettings] = useState<AppSettings>(persisted?.settings ?? mockSettings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Auto-login de démonstration (à remplacer par une vraie authentification)
  useEffect(() => {
    setCurrentUser(users[0]);
  }, [users]);

  // Sauvegarde automatique dans localStorage à chaque modification des données
  useEffect(() => {
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
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...client } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
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
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
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
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, ...invoice } : i));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
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
  };

  const updateQuote = (id: string, quote: Partial<Quote>) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, ...quote } : q));
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
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
    setInvoices(prev =>
      prev.map(inv => {
        if (!ids.includes(inv.id)) return inv;
        const totalPaid = nextPayments
          .filter(p => p.invoiceId === inv.id)
          .reduce((sum, p) => sum + p.amount, 0);
        if (totalPaid >= inv.total) {
          return inv.status === 'paid' ? inv : { ...inv, status: 'paid' };
        }
        if (inv.status === 'paid') {
          return { ...inv, status: 'sent' };
        }
        return inv;
      })
    );
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date()
    };
    const next = [...payments, newPayment];
    setPayments(next);
    recalcInvoiceStatuses([newPayment.invoiceId], next);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    const existing = getPaymentById(id);
    const next = payments.map(p => p.id === id ? { ...p, ...payment } : p);
    setPayments(next);
    // Recalculer l'ancienne et la nouvelle facture (le montant ou la facture liée a pu changer)
    const affected = [existing?.invoiceId, payment.invoiceId].filter(Boolean) as string[];
    recalcInvoiceStatuses(affected, next);
  };

  const deletePayment = (id: string) => {
    const payment = getPaymentById(id);
    if (!payment) return;
    const next = payments.filter(p => p.id !== id);
    setPayments(next);
    recalcInvoiceStatuses([payment.invoiceId], next);
  };

  const getPaymentById = (id: string) => {
    return payments.find(p => p.id === id);
  };

  const getPaymentsByInvoiceId = (invoiceId: string) => {
    return payments.filter(p => p.invoiceId === invoiceId);
  };

  // Authentication
  const login = async (email: string, _password: string): Promise<boolean> => {
    // In a real app, we would call an API here
    // For demo, just check if the user exists (password ignored in this MVP)
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({ ...settings, ...newSettings });
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