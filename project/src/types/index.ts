export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string; // NIF/RC
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string; // m², kg, ton, etc.
  price: number;
  stock: number;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  discount: number; // percentage
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  createdAt: Date;
}

export interface Quote {
  id: string;
  number: string;
  date: Date;
  validUntil: Date;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: Date;
  amount: number;
  method: 'cash' | 'bank' | 'check' | 'other';
  reference: string;
  notes: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'accountant';
  createdAt: Date;
}

export interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTaxId: string;
  companyLogo?: string;
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  currencySymbol: string;
  dateFormat: string;
}