/**
 * Format a number as currency
 */
export const formatCurrency = (value: number, symbol: string = '€'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
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
 * Calculate invoice totals
 */
export const calculateInvoiceTotals = (
  items: { quantity: number; unitPrice: number; discount: number }[],
  taxRate: number,
  shippingFee: number
) => {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.quantity * item.unitPrice;
    const discountAmount = itemPrice * (item.discount / 100);
    return total + (itemPrice - discountAmount);
  }, 0);

  // Calculate tax amount
  const taxAmount = subtotal * (taxRate / 100);

  // Calculate total
  const total = subtotal + taxAmount + shippingFee;

  return {
    subtotal,
    taxAmount,
    total
  };
};

/**
 * Generate a new invoice number
 */
export const generateInvoiceNumber = (prefix: string = 'FACT', existingNumbers: string[] = []): string => {
  const currentYear = new Date().getFullYear();
  const lastNumber = existingNumbers
    .filter(num => num.startsWith(`${prefix}-${currentYear}`))
    .map(num => parseInt(num.split('-').pop() || '0'))
    .sort((a, b) => b - a)[0] || 0;
  
  const newNumber = lastNumber + 1;
  return `${prefix}-${currentYear}-${String(newNumber).padStart(3, '0')}`;
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
export const quoteToInvoice = (quote: any, invoiceNumber: string): any => {
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 30); // 30 days due date by default
  
  return {
    ...quote,
    id: Math.random().toString(36).substring(2, 10),
    number: invoiceNumber,
    date: now,
    dueDate,
    status: 'sent',
    paymentTerms: 'Paiement à 30 jours',
    createdAt: now
  };
};