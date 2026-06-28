import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Payment } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';

interface PaymentFormProps {
  /** Le paiement à modifier (uniquement en mode édition) */
  payment?: Payment;
  /** true = modification d'un paiement existant, false = création (défaut) */
  isEditing?: boolean;
  /** Facture pré-sélectionnée à la création (depuis le détail d'une facture) */
  defaultInvoiceId?: string;
}

const toInputDate = (d: Date | string): string => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, isEditing = false, defaultInvoiceId }) => {
  const navigate = useNavigate();
  const { invoices, clients, settings, getPaymentsByInvoiceId, addPayment, updatePayment } = useApp();

  // Solde restant dû d'une facture (total - paiements déjà enregistrés)
  const balanceOf = (invoiceId: string): number => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return 0;
    const paid = getPaymentsByInvoiceId(invoiceId)
      // En édition, on exclut le paiement courant pour ne pas le compter deux fois
      .filter((p) => p.id !== payment?.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return invoice.total - paid;
  };

  const clientName = (clientId: string): string =>
    clients.find((c) => c.id === clientId)?.name ?? 'Client inconnu';

  const [invoiceId, setInvoiceId] = useState(payment?.invoiceId ?? defaultInvoiceId ?? '');
  const [date, setDate] = useState(payment ? toInputDate(payment.date) : toInputDate(new Date()));
  const [amount, setAmount] = useState<number>(
    payment?.amount ?? (defaultInvoiceId ? Math.max(0, balanceOf(defaultInvoiceId)) : 0)
  );
  const [method, setMethod] = useState<Payment['method']>(payment?.method ?? 'cash');
  const [reference, setReference] = useState(payment?.reference ?? '');
  const [notes, setNotes] = useState(payment?.notes ?? '');
  const [error, setError] = useState('');

  // Quand on choisit une facture (en création), on pré-remplit le montant avec son solde
  const handleInvoiceChange = (id: string) => {
    setInvoiceId(id);
    if (!isEditing && id) {
      setAmount(Math.max(0, balanceOf(id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceId) {
      setError('Veuillez sélectionner une facture.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Le montant doit être supérieur à zéro.');
      return;
    }
    setError('');

    const payload = {
      invoiceId,
      date: new Date(date),
      // FCFA : montant entier
      amount: Math.round(amount),
      method,
      reference: reference.trim(),
      notes: notes.trim(),
    };

    if (isEditing && payment) {
      updatePayment(payment.id, payload);
    } else {
      addPayment(payload);
    }

    navigate('/payments');
  };

  const balance = invoiceId ? balanceOf(invoiceId) : 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Modifier le paiement' : 'Nouveau paiement'}
        </h3>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700 mb-1">
            Facture <span className="text-red-500">*</span>
          </label>
          <select
            id="invoiceId"
            value={invoiceId}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">— Sélectionner une facture —</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.number} — {clientName(inv.clientId)} ({formatCurrency(inv.total, settings.currencySymbol)})
              </option>
            ))}
          </select>
          {invoiceId && (
            <p className="mt-1 text-sm text-gray-500">
              Solde dû avant ce paiement : {formatCurrency(balance, settings.currencySymbol)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant ({settings.currencySymbol}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-right focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date du paiement
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Méthode
            </label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value as Payment['method'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cash">Espèces</option>
              <option value="bank">Virement bancaire</option>
              <option value="check">Chèque</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
              Référence
            </label>
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="N° de chèque, référence de virement…"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => navigate('/payments')} icon={<X className="h-4 w-4" />}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
          {isEditing ? 'Enregistrer' : 'Enregistrer le paiement'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
