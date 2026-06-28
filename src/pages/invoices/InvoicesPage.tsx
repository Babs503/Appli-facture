import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import InvoiceList from '../../components/invoices/InvoiceList';

const InvoicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Factures"
        subtitle="Gérez vos factures clients"
        action={
          <Link to="/invoices/new">
            <Button variant="primary" icon={<FilePlus className="h-4 w-4" />}>
              Nouvelle facture
            </Button>
          </Link>
        }
      />
      <InvoiceList />
    </div>
  );
};

export default InvoicesPage;
