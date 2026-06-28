import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import PaymentForm from '../../components/payments/PaymentForm';
import { useApp } from '../../context/AppContext';

const EditPaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPaymentById } = useApp();

  const payment = id ? getPaymentById(id) : undefined;

  if (!payment) {
    return <Navigate to="/payments" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Modifier le paiement" subtitle="Mettre à jour l'encaissement" />
      <PaymentForm payment={payment} isEditing />
    </div>
  );
};

export default EditPaymentPage;
