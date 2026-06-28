import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import InvoiceForm from '../../components/invoices/InvoiceForm';
import { useApp } from '../../context/AppContext';

const EditInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getInvoiceById } = useApp();

  const invoice = id ? getInvoiceById(id) : undefined;

  if (!invoice) {
    return <Navigate to="/invoices" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={`Modifier ${invoice.number}`} subtitle="Mettre à jour la facture" />
      <InvoiceForm invoice={invoice} isEditing />
    </div>
  );
};

export default EditInvoicePage;
