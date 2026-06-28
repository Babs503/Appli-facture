import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import { formatCurrency, formatDate, paymentMethodLabel } from '../../utils/format';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

const PaymentList: React.FC = () => {
  const { payments, invoices, clients, settings, deletePayment } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const invoiceNumber = (invoiceId: string): string =>
    invoices.find((i) => i.id === invoiceId)?.number ?? 'Facture inconnue';

  const clientNameForInvoice = (invoiceId: string): string => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return '—';
    return clients.find((c) => c.id === invoice.clientId)?.name ?? 'Client inconnu';
  };

  const filtered = payments
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        invoiceNumber(p.invoiceId).toLowerCase().includes(q) ||
        clientNameForInvoice(p.invoiceId).toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer ce paiement ?')) {
      deletePayment(id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un paiement..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/payments/new">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Nouveau paiement
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/invoices/${payment.invoiceId}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {invoiceNumber(payment.invoiceId)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{clientNameForInvoice(payment.invoiceId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paymentMethodLabel(payment.method)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{payment.reference || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount, settings.currencySymbol)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/payments/${payment.id}/edit`}>
                        <Button variant="outline" size="sm" icon={<Pencil className="h-4 w-4" />} className="text-blue-600">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun paiement enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
