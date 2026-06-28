import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';
import { Search, FilePlus, Eye, Pencil, Trash2 } from 'lucide-react';

const QuoteList: React.FC = () => {
  const { quotes, clients, settings, deleteQuote } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Client inconnu';
  };

  const filtered = quotes
    .filter((q) => {
      const query = searchQuery.toLowerCase();
      return (
        q.number.toLowerCase().includes(query) ||
        getClientName(q.clientId).toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string, number: string) => {
    if (window.confirm(`Supprimer le devis ${number} ?`)) {
      deleteQuote(id);
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
            placeholder="Rechercher un devis..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/quotes/new">
          <Button variant="primary" icon={<FilePlus className="h-4 w-4" />}>
            Nouveau devis
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valable jusqu'au</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/quotes/${quote.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {quote.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getClientName(quote.clientId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.validUntil)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(quote.total, settings.currencySymbol)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={quote.status} type="quote" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/quotes/${quote.id}`}>
                        <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />} className="text-gray-600">
                          Voir
                        </Button>
                      </Link>
                      <Link to={`/quotes/${quote.id}/edit`}>
                        <Button variant="outline" size="sm" icon={<Pencil className="h-4 w-4" />} className="text-blue-600">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600"
                        onClick={() => handleDelete(quote.id, quote.number)}
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
                  Aucun devis trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuoteList;
