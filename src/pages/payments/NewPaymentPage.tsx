import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import PaymentForm from '../../components/payments/PaymentForm';

const NewPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Facture éventuellement pré-sélectionnée via ?invoice=<id> (depuis le détail d'une facture)
  const invoiceId = searchParams.get('invoice') ?? undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Nouveau paiement" subtitle="Enregistrer un encaissement sur une facture" />
      <PaymentForm defaultInvoiceId={invoiceId} />
    </div>
  );
};

export default NewPaymentPage;
