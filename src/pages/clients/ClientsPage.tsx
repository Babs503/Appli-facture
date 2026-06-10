import React from 'react';
import ClientList from '../../components/clients/ClientList';
import PageHeader from '../../components/common/PageHeader';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const ClientsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Clients" 
        subtitle="Gérez votre base de clients"
        action={
          <Link to="/clients/new">
            <Button 
              variant="primary"
              icon={<UserPlus className="h-4 w-4" />}
            >
              Nouveau client
            </Button>
          </Link>
        }
      />
      
      <ClientList />
    </div>
  );
};

export default ClientsPage;