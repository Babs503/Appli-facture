import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentInvoices from '../components/dashboard/RecentInvoices';
import RecentQuotes from '../components/dashboard/RecentQuotes';
import PageHeader from '../components/common/PageHeader';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Tableau de bord" 
        subtitle="Aperçu de votre activité commerciale"
      />
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoices />
        <RecentQuotes />
      </div>
    </div>
  );
};

export default DashboardPage;