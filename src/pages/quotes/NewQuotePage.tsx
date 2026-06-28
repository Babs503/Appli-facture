import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import QuoteForm from '../../components/quotes/QuoteForm';

const NewQuotePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Nouveau devis" subtitle="Créer un nouveau devis client" />
      <QuoteForm />
    </div>
  );
};

export default NewQuotePage;
