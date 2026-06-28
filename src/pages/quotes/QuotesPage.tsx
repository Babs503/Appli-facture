import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import QuoteList from '../../components/quotes/QuoteList';

const QuotesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Devis"
        subtitle="Gérez vos devis clients"
        action={
          <Link to="/quotes/new">
            <Button variant="primary" icon={<FilePlus className="h-4 w-4" />}>
              Nouveau devis
            </Button>
          </Link>
        }
      />
      <QuoteList />
    </div>
  );
};

export default QuotesPage;
