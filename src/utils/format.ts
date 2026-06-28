import { Quote, Invoice } from '../types';

/**
 * Format a number as currency.
 * Par défaut en FCFA (franc CFA, XOF) : pas de décimales, séparateur d'espace.
 * Le symbole est paramétrable via les réglages de l'application.
 */
export const formatCurrency = (value: number, symbol: string = 'FCFA'): string => {
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value || 0));
  return `${formatted} ${symbol}`;
};

/**
 * Format a date
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
};

/**
 * Libellé français d'une méthode de paiement.
 */
export const paymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cash':
      return 'Espèces';
    case 'bank':
      return 'Virement bancaire';
    case 'check':
      return 'Chèque';
    case 'other':
      return 'Autre';
    default:
      return method;
  }
};

/**
 * Calculate invoice totals
 */
export const calculateInvoiceTotals = (
  items: { quantity: number; unitPrice: number; discount: number }[],
  taxRate: number,
  shippingFee: number
) => {
  // Sous-total : chaque ligne est arrondie à l'entier (le FCFA n'a pas de décimale)
  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.quantity * item.unitPrice;
    const discountAmount = itemPrice * (item.discount / 100);
    return total + Math.round(itemPrice - discountAmount);
  }, 0);

  // Montant de la TVA, arrondi à l'entier
  const taxAmount = Math.round(subtotal * (taxRate / 100));

  // Total (tous les opérandes sont déjà entiers)
  const total = subtotal + taxAmount + Math.round(shippingFee || 0);

  return {
    subtotal,
    taxAmount,
    total
  };
};

/**
 * Generate a new invoice number
 */
export const generateInvoiceNumber = (prefix: string = 'FAC', existingNumbers: string[] = []): string => {
  const currentYear = new Date().getFullYear();
  const lastNumber = existingNumbers
    .filter(num => num.startsWith(`${prefix}-${currentYear}`))
    .map(num => parseInt(num.split('-').pop() || '0'))
    .sort((a, b) => b - a)[0] || 0;

  const newNumber = lastNumber + 1;
  // Format : FAC-AAAA-NNNN (séquence sur 4 chiffres par année)
  return `${prefix}-${currentYear}-${String(newNumber).padStart(4, '0')}`;
};

/**
 * Generate a new quote number
 */
export const generateQuoteNumber = (prefix: string = 'DEV', existingNumbers: string[] = []): string => {
  return generateInvoiceNumber(prefix, existingNumbers);
};

/**
 * Convert a quote to an invoice
 */
export const quoteToInvoice = (quote: Quote, invoiceNumber: string): Invoice => {
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 30); // échéance par défaut à 30 jours

  return {
    id: Math.random().toString(36).substring(2, 10),
    number: invoiceNumber,
    date: now,
    dueDate,
    clientId: quote.clientId,
    items: quote.items,
    subtotal: quote.subtotal,
    taxRate: quote.taxRate,
    taxAmount: quote.taxAmount,
    shippingFee: quote.shippingFee,
    total: quote.total,
    notes: quote.notes,
    status: 'sent',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: now
  };
};