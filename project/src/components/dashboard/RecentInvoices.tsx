import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';
import { ArrowRight } from 'lucide-react';

const RecentInvoices: React.FC = () => {
  const { invoices, clients, settings } = useApp();
  
  // Get the 5 most recent invoices
  const recentInvoices = [...invoices]
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
        <h3 className="text-lg font-medium text-gray-900">Factures récentes</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentInvoices.length > 0 ? (
          recentInvoices.map((invoice) => (
            <Link 
              key={invoice.id} 
              to={`/invoices/${invoice.id}`}
              className="block hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600">{invoice.number}</p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-sm text-gray-500">{getClientName(invoice.clientId)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(invoice.date)}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total, settings.currencySymbol)}</p>
                      <div className="mt-1">
                        <StatusBadge status={invoice.status} type="invoice" />
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
            Aucune facture récente à afficher
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link 
          to="/invoices" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center"
        >
          Voir toutes les factures
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecentInvoices;