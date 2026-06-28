import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import PaymentList from '../../components/payments/PaymentList';

const PaymentsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Paiements"
        subtitle="Suivez les encaissements de vos factures"
        action={
          <Link to="/payments/new">
            <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
              Nouveau paiement
            </Button>
          </Link>
        }
      />
      <PaymentList />
    </div>
  );
};

export default PaymentsPage;
