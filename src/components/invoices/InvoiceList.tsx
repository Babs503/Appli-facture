import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';
import { Search, FilePlus, Eye, Pencil, Trash2 } from 'lucide-react';

const InvoiceList: React.FC = () => {
  const { invoices, clients, settings, deleteInvoice } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Client inconnu';
  };

  const filtered = invoices
    .filter((inv) => {
      const q = searchQuery.toLowerCase();
      return (
        inv.number.toLowerCase().includes(q) ||
        getClientName(inv.clientId).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string, number: string) => {
    if (window.confirm(`Supprimer la facture ${number} ?`)) {
      deleteInvoice(id);
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
            placeholder="Rechercher une facture..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/invoices/new">
          <Button variant="primary" icon={<FilePlus className="h-4 w-4" />}>
            Nouvelle facture
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/invoices/${invoice.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getClientName(invoice.clientId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.total, settings.currencySymbol)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={invoice.status} type="invoice" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />} className="text-gray-600">
                          Voir
                        </Button>
                      </Link>
                      <Link to={`/invoices/${invoice.id}/edit`}>
                        <Button variant="outline" size="sm" icon={<Pencil className="h-4 w-4" />} className="text-blue-600">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600"
                        onClick={() => handleDelete(invoice.id, invoice.number)}
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
                  Aucune facture trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
