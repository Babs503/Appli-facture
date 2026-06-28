import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, InvoiceItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateInvoiceTotals, formatCurrency } from '../../utils/format';
import Button from '../common/Button';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface QuoteFormProps {
  /** Le devis à modifier (uniquement en mode édition) */
  quote?: Quote;
  /** true = modification d'un devis existant, false = création (défaut) */
  isEditing?: boolean;
}

/** Ligne de saisie du formulaire (le total est recalculé à la volée) */
interface FormItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  discount: number;
}

const newId = () => Math.random().toString(36).substring(2, 10);

const toInputDate = (d: Date | string): string => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const emptyItem = (): FormItem => ({
  id: newId(),
  productId: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  unit: '',
  discount: 0,
});

const QuoteForm: React.FC<QuoteFormProps> = ({ quote, isEditing = false }) => {
  const navigate = useNavigate();
  const { clients, products, settings, addQuote, updateQuote } = useApp();

  // Validité par défaut : 30 jours après l'émission
  const defaultValidUntil = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toInputDate(d);
  };

  const [clientId, setClientId] = useState(quote?.clientId ?? '');
  const [date, setDate] = useState(quote ? toInputDate(quote.date) : toInputDate(new Date()));
  const [validUntil, setValidUntil] = useState(quote ? toInputDate(quote.validUntil) : defaultValidUntil());
  const [status, setStatus] = useState<Quote['status']>(quote?.status ?? 'draft');
  const [taxRate, setTaxRate] = useState<number>(quote?.taxRate ?? settings.defaultTaxRate);
  const [shippingFee, setShippingFee] = useState<number>(quote?.shippingFee ?? 0);
  const [notes, setNotes] = useState(quote?.notes ?? '');
  const [items, setItems] = useState<FormItem[]>(
    quote && quote.items.length > 0
      ? quote.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          unit: it.unit,
          discount: it.discount,
        }))
      : [emptyItem()]
  );
  const [error, setError] = useState('');

  // Totaux recalculés à chaque rendu à partir des lignes
  const { subtotal, taxAmount, total } = calculateInvoiceTotals(
    items.map((i) => ({ quantity: i.quantity, unitPrice: i.unitPrice, discount: i.discount })),
    taxRate,
    shippingFee
  );

  const lineTotal = (i: FormItem) => Math.round(i.quantity * i.unitPrice * (1 - i.discount / 100));

  const updateItem = (id: string, changes: Partial<FormItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  };

  // Quand on choisit un produit, on pré-remplit description / prix / unité
  const handleProductChange = (id: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateItem(id, {
        productId,
        description: product.name,
        unitPrice: product.price,
        unit: product.unit,
      });
    } else {
      updateItem(id, { productId: '' });
    }
  };

  const addLine = () => setItems((prev) => [...prev, emptyItem()]);
  const removeLine = (id: string) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));

  const validate = (): boolean => {
    if (!clientId) {
      setError('Veuillez sélectionner un client.');
      return false;
    }
    if (items.length === 0 || items.every((i) => !i.description.trim())) {
      setError('Ajoutez au moins une ligne avec une désignation.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // On ne conserve que les lignes ayant une désignation
    const builtItems: InvoiceItem[] = items
      .filter((i) => i.description.trim())
      .map((i) => ({
        id: i.id,
        productId: i.productId,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        unit: i.unit,
        discount: i.discount,
        total: lineTotal(i),
      }));

    const payload = {
      date: new Date(date),
      validUntil: new Date(validUntil),
      clientId,
      items: builtItems,
      subtotal,
      taxRate,
      taxAmount,
      shippingFee,
      total,
      notes,
      status,
    };

    if (isEditing && quote) {
      updateQuote(quote.id, payload);
      navigate(`/quotes/${quote.id}`);
    } else {
      addQuote(payload);
      navigate('/quotes');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      {/* En-tête : client, dates, statut */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">— Sélectionner un client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Quote['status'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Rejeté</option>
              <option value="expired">Expiré</option>
              <option value="converted">Converti</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date d'émission
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
            <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
              Valable jusqu'au
            </label>
            <input
              type="date"
              id="validUntil"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Lignes du devis */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Lignes</h3>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addLine}>
            Ajouter une ligne
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qté</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">P.U.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Remise %</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(item.id, e.target.value)}
                      className="block w-40 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">— Libre —</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="block w-48 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Désignation"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                      className="block w-20 rounded-md border-gray-300 text-sm text-right focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                      className="block w-28 rounded-md border-gray-300 text-sm text-right focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, { discount: Number(e.target.value) })}
                      className="block w-20 rounded-md border-gray-300 text-sm text-right focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-gray-900 whitespace-nowrap">
                    {formatCurrency(lineTotal(item), settings.currencySymbol)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeLine(item.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30"
                      disabled={items.length === 1}
                      aria-label="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes et totaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
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

        <div className="bg-white shadow-md rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sous-total</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(subtotal, settings.currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="taxRate" className="text-sm text-gray-600">
              TVA (%)
            </label>
            <input
              type="number"
              id="taxRate"
              min={0}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-24 rounded-md border-gray-300 text-sm text-right focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Montant TVA</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(taxAmount, settings.currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="shippingFee" className="text-sm text-gray-600">
              Frais de livraison
            </label>
            <input
              type="number"
              id="shippingFee"
              min={0}
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="w-32 rounded-md border-gray-300 text-sm text-right focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">Total TTC</span>
            <span className="text-lg font-bold text-blue-700">
              {formatCurrency(total, settings.currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          icon={<X className="h-4 w-4" />}
          onClick={() => navigate('/quotes')}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
          {isEditing ? 'Enregistrer' : 'Créer le devis'}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
