import { Client, Product, Invoice, Quote, Payment, User, AppSettings } from '../types';

// Generate a random ID
const generateId = (): string => Math.random().toString(36).substring(2, 10);

// Mock Clients (entreprises sénégalaises – région de Dakar)
export const clients: Client[] = [
  {
    id: generateId(),
    name: 'Entreprise BTP Ndiaye',
    address: 'Cité Keur Gorgui, Dakar',
    phone: '+221 77 123 45 67',
    email: 'contact@btp-ndiaye.sn',
    taxId: '0012345678', // NINEA
    createdAt: new Date('2026-01-15')
  },
  {
    id: generateId(),
    name: 'Sénégindus SARL',
    address: 'Zone industrielle, Rufisque',
    phone: '+221 78 234 56 78',
    email: 'info@senegindus.sn',
    taxId: '0023456789',
    createdAt: new Date('2026-02-20')
  },
  {
    id: generateId(),
    name: 'Construction Diop & Frères',
    address: 'Sicap Liberté 6, Dakar',
    phone: '+221 76 345 67 89',
    email: 'contact@diop-freres.sn',
    taxId: '0034567890',
    createdAt: new Date('2026-03-10')
  },
];

// Mock Products (prix en FCFA, entiers)
export const products: Product[] = [
  {
    id: generateId(),
    name: 'Ciment CEM II 50 kg',
    description: 'Sac de ciment portland 50 kg',
    unit: 'sac',
    price: 4500,
    stock: 200,
    createdAt: new Date('2026-01-10')
  },
  {
    id: generateId(),
    name: 'Sable de mer',
    description: 'Sable lavé pour maçonnerie',
    unit: 'm³',
    price: 25000,
    stock: 80,
    createdAt: new Date('2026-01-12')
  },
  {
    id: generateId(),
    name: 'Parpaing 15',
    description: 'Bloc béton creux 15x20x40 cm',
    unit: 'pièce',
    price: 250,
    stock: 5000,
    createdAt: new Date('2026-01-15')
  },
  {
    id: generateId(),
    name: 'Fer à béton 12 mm',
    description: 'Barre d\'acier haute adhérence, 12 m',
    unit: 'barre',
    price: 6500,
    stock: 300,
    createdAt: new Date('2026-02-05')
  },
  {
    id: generateId(),
    name: 'Tôle ondulée galvanisée',
    description: 'Feuille de tôle 2 m, ep. 0,3 mm',
    unit: 'feuille',
    price: 7500,
    stock: 450,
    createdAt: new Date('2026-02-15')
  },
];

// Mock Invoices with items (TVA 18 %, montants entiers en FCFA)
export const invoices: Invoice[] = [
  {
    id: generateId(),
    number: 'FAC-2026-0001',
    date: new Date('2026-03-10'),
    dueDate: new Date('2026-04-09'),
    clientId: clients[0].id,
    items: [
      {
        id: generateId(),
        productId: products[0].id,
        description: products[0].name,
        quantity: 20,
        unitPrice: products[0].price,
        unit: products[0].unit,
        discount: 0,
        total: 20 * products[0].price // 90 000
      },
      {
        id: generateId(),
        productId: products[1].id,
        description: products[1].name,
        quantity: 5,
        unitPrice: products[1].price,
        unit: products[1].unit,
        discount: 5,
        total: Math.round(5 * products[1].price * 0.95) // 118 750
      }
    ],
    subtotal: 208750,
    taxRate: 18,
    taxAmount: 37575,
    shippingFee: 10000,
    total: 256325,
    notes: 'Livraison sous 3 jours ouvrés',
    status: 'paid',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2026-03-10')
  },
  {
    id: generateId(),
    number: 'FAC-2026-0002',
    date: new Date('2026-05-15'),
    dueDate: new Date('2026-06-14'),
    clientId: clients[1].id,
    items: [
      {
        id: generateId(),
        productId: products[2].id,
        description: products[2].name,
        quantity: 2000,
        unitPrice: products[2].price,
        unit: products[2].unit,
        discount: 10,
        total: Math.round(2000 * products[2].price * 0.9) // 450 000
      }
    ],
    subtotal: 450000,
    taxRate: 18,
    taxAmount: 81000,
    shippingFee: 15000,
    total: 546000,
    notes: 'Livraison sur chantier',
    status: 'sent',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2026-05-15')
  },
  {
    id: generateId(),
    number: 'FAC-2026-0003',
    date: new Date('2026-04-01'),
    dueDate: new Date('2026-05-01'),
    clientId: clients[2].id,
    items: [
      {
        id: generateId(),
        productId: products[3].id,
        description: products[3].name,
        quantity: 50,
        unitPrice: products[3].price,
        unit: products[3].unit,
        discount: 0,
        total: 50 * products[3].price // 325 000
      },
      {
        id: generateId(),
        productId: products[4].id,
        description: products[4].name,
        quantity: 100,
        unitPrice: products[4].price,
        unit: products[4].unit,
        discount: 0,
        total: 100 * products[4].price // 750 000
      }
    ],
    subtotal: 1075000,
    taxRate: 18,
    taxAmount: 193500,
    shippingFee: 20000,
    total: 1288500,
    notes: 'Livraison urgente',
    status: 'overdue',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2026-04-01')
  }
];

// Mock Quotes (TVA 18 %, montants entiers)
export const quotes: Quote[] = [
  {
    id: generateId(),
    number: 'DEV-2026-0001',
    date: new Date('2026-02-15'),
    validUntil: new Date('2026-03-17'),
    clientId: clients[0].id,
    items: [
      {
        id: generateId(),
        productId: products[0].id,
        description: products[0].name,
        quantity: 40,
        unitPrice: products[0].price,
        unit: products[0].unit,
        discount: 5,
        total: Math.round(40 * products[0].price * 0.95) // 171 000
      }
    ],
    subtotal: 171000,
    taxRate: 18,
    taxAmount: 30780,
    shippingFee: 10000,
    total: 211780,
    notes: 'Devis valable 30 jours',
    status: 'converted',
    createdAt: new Date('2026-02-15')
  },
  {
    id: generateId(),
    number: 'DEV-2026-0002',
    date: new Date('2026-06-10'),
    validUntil: new Date('2026-07-10'),
    clientId: clients[1].id,
    items: [
      {
        id: generateId(),
        productId: products[2].id,
        description: products[2].name,
        quantity: 3000,
        unitPrice: products[2].price,
        unit: products[2].unit,
        discount: 15,
        total: Math.round(3000 * products[2].price * 0.85) // 637 500
      }
    ],
    subtotal: 637500,
    taxRate: 18,
    taxAmount: 114750,
    shippingFee: 18000,
    total: 770250,
    notes: 'Option de livraison en plusieurs fois',
    status: 'sent',
    createdAt: new Date('2026-06-10')
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: generateId(),
    invoiceId: invoices[0].id,
    date: new Date('2026-04-05'),
    amount: invoices[0].total, // 256 325 (réglée)
    method: 'bank',
    reference: 'VIR-20260405-123456',
    notes: 'Paiement reçu',
    createdAt: new Date('2026-04-05')
  },
  {
    id: generateId(),
    invoiceId: invoices[1].id,
    date: new Date('2026-06-10'),
    amount: Math.round(invoices[1].total / 2), // acompte 50 %
    method: 'check',
    reference: 'CHQ-20260610-987654',
    notes: 'Acompte 50%',
    createdAt: new Date('2026-06-10')
  }
];

// Mock Users
export const users: User[] = [
  {
    id: generateId(),
    name: 'Administrateur',
    email: 'admin@appli-facture.sn',
    role: 'admin',
    createdAt: new Date('2026-01-01')
  },
  {
    id: generateId(),
    name: 'Awa Sow',
    email: 'commercial@appli-facture.sn',
    role: 'sales',
    createdAt: new Date('2026-01-02')
  },
  {
    id: generateId(),
    name: 'Modou Fall',
    email: 'comptable@appli-facture.sn',
    role: 'accountant',
    createdAt: new Date('2026-01-03')
  }
];

// App Settings
export const appSettings: AppSettings = {
  companyName: 'Ma Société',
  companyAddress: 'Dakar, Sénégal',
  companyPhone: '+221 77 000 00 00',
  companyEmail: 'contact@masociete.sn',
  companyTaxId: '', // NINEA / RC
  defaultTaxRate: 18, // TVA Sénégal
  defaultPaymentTerms: 'Paiement à 30 jours',
  currencySymbol: 'FCFA',
  dateFormat: 'dd/MM/yyyy'
};
