import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import InvoiceForm from '../../components/invoices/InvoiceForm';

const NewInvoicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Nouvelle facture" subtitle="Créer une nouvelle facture client" />
      <InvoiceForm />
    </div>
  );
};

export default NewInvoicePage;
