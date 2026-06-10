import { Client, Product, Invoice, Quote, Payment, User, AppSettings } from '../types';

// Generate a random ID
const generateId = (): string => Math.random().toString(36).substring(2, 10);

// Mock Clients
export const clients: Client[] = [
  {
    id: generateId(),
    name: 'Entreprise Dubois Construction',
    address: '15 Rue de la Construction, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@dubois-construction.fr',
    taxId: 'FR12345678901',
    createdAt: new Date('2023-01-15')
  },
  {
    id: generateId(),
    name: 'Martin Bâtiments',
    address: '42 Avenue des Artisans, 69002 Lyon',
    phone: '04 56 78 90 12',
    email: 'info@martin-batiments.fr',
    taxId: 'FR98765432101',
    createdAt: new Date('2023-02-20')
  },
  {
    id: generateId(),
    name: 'Société Rousseau & Fils',
    address: '8 Boulevard Haussmann, 33000 Bordeaux',
    phone: '05 67 89 01 23',
    email: 'contact@rousseau-fils.fr',
    taxId: 'FR45678901234',
    createdAt: new Date('2023-03-10')
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: generateId(),
    name: 'Ciment standard',
    description: 'Ciment portland de haute qualité',
    unit: 'tonne',
    price: 120.50,
    stock: 50,
    createdAt: new Date('2023-01-10')
  },
  {
    id: generateId(),
    name: 'Sable fin',
    description: 'Sable fin pour travaux de finition',
    unit: 'tonne',
    price: 35.75,
    stock: 120,
    createdAt: new Date('2023-01-12')
  },
  {
    id: generateId(),
    name: 'Brique rouge',
    description: 'Brique standard pour construction',
    unit: 'pièce',
    price: 0.85,
    stock: 5000,
    createdAt: new Date('2023-01-15')
  },
  {
    id: generateId(),
    name: 'Poutre en bois',
    description: 'Poutre en pin traité 200x100mm',
    unit: 'mètre',
    price: 12.99,
    stock: 300,
    createdAt: new Date('2023-02-05')
  },
  {
    id: generateId(),
    name: 'Plaque de plâtre',
    description: 'Plaque de plâtre standard 250x120cm',
    unit: 'm²',
    price: 8.50,
    stock: 450,
    createdAt: new Date('2023-02-15')
  },
];

// Mock Invoices with items
export const invoices: Invoice[] = [
  {
    id: generateId(),
    number: 'FACT-2023-001',
    date: new Date('2023-04-10'),
    dueDate: new Date('2023-05-10'),
    clientId: clients[0].id,
    items: [
      {
        id: generateId(),
        productId: products[0].id,
        description: products[0].name,
        quantity: 5,
        unitPrice: products[0].price,
        unit: products[0].unit,
        discount: 0,
        total: 5 * products[0].price
      },
      {
        id: generateId(),
        productId: products[1].id,
        description: products[1].name,
        quantity: 10,
        unitPrice: products[1].price,
        unit: products[1].unit,
        discount: 5,
        total: 10 * products[1].price * 0.95
      }
    ],
    subtotal: 5 * products[0].price + 10 * products[1].price * 0.95,
    taxRate: 20,
    taxAmount: (5 * products[0].price + 10 * products[1].price * 0.95) * 0.2,
    shippingFee: 50,
    total: (5 * products[0].price + 10 * products[1].price * 0.95) * 1.2 + 50,
    notes: 'Livraison sous 3 jours ouvrés',
    status: 'paid',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2023-04-10')
  },
  {
    id: generateId(),
    number: 'FACT-2023-002',
    date: new Date('2023-05-15'),
    dueDate: new Date('2023-06-15'),
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
        total: 2000 * products[2].price * 0.9
      }
    ],
    subtotal: 2000 * products[2].price * 0.9,
    taxRate: 20,
    taxAmount: (2000 * products[2].price * 0.9) * 0.2,
    shippingFee: 100,
    total: (2000 * products[2].price * 0.9) * 1.2 + 100,
    notes: 'Livraison sur chantier',
    status: 'sent',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2023-05-15')
  },
  {
    id: generateId(),
    number: 'FACT-2023-003',
    date: new Date('2023-06-01'),
    dueDate: new Date('2023-07-01'),
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
        total: 50 * products[3].price
      },
      {
        id: generateId(),
        productId: products[4].id,
        description: products[4].name,
        quantity: 100,
        unitPrice: products[4].price,
        unit: products[4].unit,
        discount: 0,
        total: 100 * products[4].price
      }
    ],
    subtotal: 50 * products[3].price + 100 * products[4].price,
    taxRate: 20,
    taxAmount: (50 * products[3].price + 100 * products[4].price) * 0.2,
    shippingFee: 75,
    total: (50 * products[3].price + 100 * products[4].price) * 1.2 + 75,
    notes: 'Livraison urgente',
    status: 'overdue',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: new Date('2023-06-01')
  }
];

// Mock Quotes
export const quotes: Quote[] = [
  {
    id: generateId(),
    number: 'DEV-2023-001',
    date: new Date('2023-03-15'),
    validUntil: new Date('2023-04-15'),
    clientId: clients[0].id,
    items: [
      {
        id: generateId(),
        productId: products[0].id,
        description: products[0].name,
        quantity: 10,
        unitPrice: products[0].price,
        unit: products[0].unit,
        discount: 5,
        total: 10 * products[0].price * 0.95
      }
    ],
    subtotal: 10 * products[0].price * 0.95,
    taxRate: 20,
    taxAmount: (10 * products[0].price * 0.95) * 0.2,
    shippingFee: 50,
    total: (10 * products[0].price * 0.95) * 1.2 + 50,
    notes: 'Devis valable 30 jours',
    status: 'converted',
    createdAt: new Date('2023-03-15')
  },
  {
    id: generateId(),
    number: 'DEV-2023-002',
    date: new Date('2023-05-10'),
    validUntil: new Date('2023-06-10'),
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
        total: 3000 * products[2].price * 0.85
      }
    ],
    subtotal: 3000 * products[2].price * 0.85,
    taxRate: 20,
    taxAmount: (3000 * products[2].price * 0.85) * 0.2,
    shippingFee: 120,
    total: (3000 * products[2].price * 0.85) * 1.2 + 120,
    notes: 'Option de livraison en plusieurs fois',
    status: 'sent',
    createdAt: new Date('2023-05-10')
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: generateId(),
    invoiceId: invoices[0].id,
    date: new Date('2023-05-05'),
    amount: invoices[0].total,
    method: 'bank',
    reference: 'VIR-20230505-123456',
    notes: 'Paiement reçu',
    createdAt: new Date('2023-05-05')
  },
  {
    id: generateId(),
    invoiceId: invoices[1].id,
    date: new Date('2023-06-10'),
    amount: invoices[1].total / 2,
    method: 'check',
    reference: 'CHQ-20230610-987654',
    notes: 'Acompte 50%',
    createdAt: new Date('2023-06-10')
  }
];

// Mock Users
export const users: User[] = [
  {
    id: generateId(),
    name: 'Admin User',
    email: 'admin@materiaux-app.fr',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: generateId(),
    name: 'Vendeur Test',
    email: 'vendeur@materiaux-app.fr',
    role: 'sales',
    createdAt: new Date('2023-01-02')
  },
  {
    id: generateId(),
    name: 'Comptable Test',
    email: 'comptable@materiaux-app.fr',
    role: 'accountant',
    createdAt: new Date('2023-01-03')
  }
];

// App Settings
export const appSettings: AppSettings = {
  companyName: 'Matériaux Construction Pro',
  companyAddress: '123 Avenue des Bâtisseurs, 75000 Paris',
  companyPhone: '01 23 45 67 89',
  companyEmail: 'contact@materiaux-pro.fr',
  companyTaxId: 'FR12345678900',
  defaultTaxRate: 20,
  defaultPaymentTerms: 'Paiement à 30 jours',
  currencySymbol: '€',
  dateFormat: 'dd/MM/yyyy'
};