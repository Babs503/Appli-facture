import React from 'react';
import { DollarSign, FileText, FilePenLine, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';

const DashboardStats: React.FC = () => {
  const { invoices, quotes, payments, settings } = useApp();
  
  // Calculate total revenue (sum of all payments)
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Count number of invoices, quotes, and overdue invoices
  const totalInvoices = invoices.length;
  const totalQuotes = quotes.length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  
  // Calculate outstanding balance (total amount of unpaid invoices)
  const outstandingBalance = invoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue, settings.currencySymbol)}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Factures</p>
          <p className="text-2xl font-semibold text-gray-900">{totalInvoices}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
          <FilePenLine className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Devis</p>
          <p className="text-2xl font-semibold text-gray-900">{totalQuotes}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
          <Clock className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Factures en retard</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{overdueInvoices}</p>
            <p className="ml-2 text-sm text-gray-500">
              ({formatCurrency(outstandingBalance, settings.currencySymbol)})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;