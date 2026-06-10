import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';
import { ArrowRight } from 'lucide-react';

const RecentQuotes: React.FC = () => {
  const { quotes, clients, settings } = useApp();
  
  // Get the 5 most recent quotes
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Function to get client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Client inconnu';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Devis récents</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentQuotes.length > 0 ? (
          recentQuotes.map((quote) => (
            <Link 
              key={quote.id} 
              to={`/quotes/${quote.id}`}
              className="block hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-purple-600">{quote.number}</p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-sm text-gray-500">{getClientName(quote.clientId)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(quote.date)} - {formatDate(quote.validUntil)}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(quote.total, settings.currencySymbol)}</p>
                      <div className="mt-1">
                        <StatusBadge status={quote.status} type="quote" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            Aucun devis récent à afficher
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link 
          to="/quotes" 
          className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center justify-center"
        >
          Voir tous les devis
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecentQuotes;