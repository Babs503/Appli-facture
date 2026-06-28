import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import QuoteForm from '../../components/quotes/QuoteForm';
import { useApp } from '../../context/AppContext';

const EditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getQuoteById } = useApp();

  const quote = id ? getQuoteById(id) : undefined;

  if (!quote) {
    return <Navigate to="/quotes" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={`Modifier ${quote.number}`} subtitle="Mettre à jour le devis" />
      <QuoteForm quote={quote} isEditing />
    </div>
  );
};

export default EditQuotePage;
