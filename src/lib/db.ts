import { supabase } from './supabase';
import {
  Client,
  Product,
  Invoice,
  Quote,
  Payment,
  AppSettings,
  InvoiceItem,
} from '../types';

/**
 * Accès aux données Supabase. Les colonnes sont en snake_case côté Postgres et
 * mappées vers les types camelCase de l'app. add et update passent tous deux par
 * un `upsert` (les id sont générés côté client, donc la clé primaire est connue).
 *
 * Toutes les fonctions supposent Supabase configuré ; AppContext ne les appelle
 * que dans ce cas (sinon mode démo local).
 */

const db = () => {
  if (!supabase) throw new Error('Supabase non configuré');
  return supabase;
};

const toISO = (d: Date | string): string =>
  typeof d === 'string' ? d : d.toISOString();

// ─── Mappers ligne → entité ────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
const rowToClient = (r: any): Client => ({
  id: r.id,
  name: r.name,
  address: r.address,
  phone: r.phone,
  email: r.email,
  taxId: r.tax_id,
  createdAt: new Date(r.created_at),
});

const rowToProduct = (r: any): Product => ({
  id: r.id,
  name: r.name,
  description: r.description,
  unit: r.unit,
  price: r.price,
  stock: r.stock,
  createdAt: new Date(r.created_at),
});

const rowToInvoice = (r: any): Invoice => ({
  id: r.id,
  number: r.number,
  date: new Date(r.date),
  dueDate: new Date(r.due_date),
  clientId: r.client_id,
  items: (r.items ?? []) as InvoiceItem[],
  subtotal: r.subtotal,
  taxRate: r.tax_rate,
  taxAmount: r.tax_amount,
  shippingFee: r.shipping_fee,
  total: r.total,
  notes: r.notes,
  status: r.status,
  paymentTerms: r.payment_terms,
  createdAt: new Date(r.created_at),
});

const rowToQuote = (r: any): Quote => ({
  id: r.id,
  number: r.number,
  date: new Date(r.date),
  validUntil: new Date(r.valid_until),
  clientId: r.client_id,
  items: (r.items ?? []) as InvoiceItem[],
  subtotal: r.subtotal,
  taxRate: r.tax_rate,
  taxAmount: r.tax_amount,
  shippingFee: r.shipping_fee,
  total: r.total,
  notes: r.notes,
  status: r.status,
  createdAt: new Date(r.created_at),
});

const rowToPayment = (r: any): Payment => ({
  id: r.id,
  invoiceId: r.invoice_id,
  date: new Date(r.date),
  amount: r.amount,
  method: r.method,
  reference: r.reference,
  notes: r.notes,
  createdAt: new Date(r.created_at),
});

const rowToSettings = (r: any): AppSettings => ({
  companyName: r.company_name,
  companyAddress: r.company_address,
  companyPhone: r.company_phone,
  companyEmail: r.company_email,
  companyTaxId: r.company_tax_id,
  companyLogo: r.company_logo ?? undefined,
  defaultTaxRate: r.default_tax_rate,
  defaultPaymentTerms: r.default_payment_terms,
  currencySymbol: r.currency_symbol,
  dateFormat: r.date_format,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Mappers entité → ligne (avec user_id) ──────────────────────────────────

const clientToRow = (userId: string, c: Client) => ({
  id: c.id,
  user_id: userId,
  name: c.name,
  address: c.address,
  phone: c.phone,
  email: c.email,
  tax_id: c.taxId,
  created_at: toISO(c.createdAt),
});

const productToRow = (userId: string, p: Product) => ({
  id: p.id,
  user_id: userId,
  name: p.name,
  description: p.description,
  unit: p.unit,
  price: p.price,
  stock: p.stock,
  created_at: toISO(p.createdAt),
});

const invoiceToRow = (userId: string, i: Invoice) => ({
  id: i.id,
  user_id: userId,
  number: i.number,
  date: toISO(i.date),
  due_date: toISO(i.dueDate),
  client_id: i.clientId,
  items: i.items,
  subtotal: i.subtotal,
  tax_rate: i.taxRate,
  tax_amount: i.taxAmount,
  shipping_fee: i.shippingFee,
  total: i.total,
  notes: i.notes,
  status: i.status,
  payment_terms: i.paymentTerms,
  created_at: toISO(i.createdAt),
});

const quoteToRow = (userId: string, q: Quote) => ({
  id: q.id,
  user_id: userId,
  number: q.number,
  date: toISO(q.date),
  valid_until: toISO(q.validUntil),
  client_id: q.clientId,
  items: q.items,
  subtotal: q.subtotal,
  tax_rate: q.taxRate,
  tax_amount: q.taxAmount,
  shipping_fee: q.shippingFee,
  total: q.total,
  notes: q.notes,
  status: q.status,
  created_at: toISO(q.createdAt),
});

const paymentToRow = (userId: string, p: Payment) => ({
  id: p.id,
  user_id: userId,
  invoice_id: p.invoiceId,
  date: toISO(p.date),
  amount: p.amount,
  method: p.method,
  reference: p.reference,
  notes: p.notes,
  created_at: toISO(p.createdAt),
});

const settingsToRow = (userId: string, s: AppSettings) => ({
  user_id: userId,
  company_name: s.companyName,
  company_address: s.companyAddress,
  company_phone: s.companyPhone,
  company_email: s.companyEmail,
  company_tax_id: s.companyTaxId,
  company_logo: s.companyLogo ?? null,
  default_tax_rate: s.defaultTaxRate,
  default_payment_terms: s.defaultPaymentTerms,
  currency_symbol: s.currencySymbol,
  date_format: s.dateFormat,
  updated_at: new Date().toISOString(),
});

// ─── Chargement global ───────────────────────────────────────────────────────

export interface LoadedData {
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  quotes: Quote[];
  payments: Payment[];
  settings: AppSettings | null;
}

export const fetchAllData = async (): Promise<LoadedData> => {
  const c = db();
  const [clients, products, invoices, quotes, payments, settings] = await Promise.all([
    c.from('clients').select('*'),
    c.from('products').select('*'),
    c.from('invoices').select('*'),
    c.from('quotes').select('*'),
    c.from('payments').select('*'),
    c.from('settings').select('*').maybeSingle(),
  ]);

  const firstError =
    clients.error || products.error || invoices.error ||
    quotes.error || payments.error || settings.error;
  if (firstError) throw firstError;

  return {
    clients: (clients.data ?? []).map(rowToClient),
    products: (products.data ?? []).map(rowToProduct),
    invoices: (invoices.data ?? []).map(rowToInvoice),
    quotes: (quotes.data ?? []).map(rowToQuote),
    payments: (payments.data ?? []).map(rowToPayment),
    settings: settings.data ? rowToSettings(settings.data) : null,
  };
};

// ─── Écritures (upsert = add ou update) ──────────────────────────────────────

const upsert = async (table: string, row: Record<string, unknown>) => {
  const { error } = await db().from(table).upsert(row);
  if (error) throw error;
};

const remove = async (table: string, id: string) => {
  const { error } = await db().from(table).delete().eq('id', id);
  if (error) throw error;
};

export const saveClient = (userId: string, c: Client) => upsert('clients', clientToRow(userId, c));
export const deleteClient = (id: string) => remove('clients', id);

export const saveProduct = (userId: string, p: Product) => upsert('products', productToRow(userId, p));
export const deleteProduct = (id: string) => remove('products', id);

export const saveInvoice = (userId: string, i: Invoice) => upsert('invoices', invoiceToRow(userId, i));
export const deleteInvoice = (id: string) => remove('invoices', id);

export const saveQuote = (userId: string, q: Quote) => upsert('quotes', quoteToRow(userId, q));
export const deleteQuote = (id: string) => remove('quotes', id);

export const savePayment = (userId: string, p: Payment) => upsert('payments', paymentToRow(userId, p));
export const deletePayment = (id: string) => remove('payments', id);

export const saveSettings = (userId: string, s: AppSettings) =>
  upsert('settings', settingsToRow(userId, s));
