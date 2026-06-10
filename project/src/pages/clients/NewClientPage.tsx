import React from 'react';
import ClientForm from '../../components/clients/ClientForm';
import PageHeader from '../../components/common/PageHeader';

const NewClientPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Nouveau client" 
        subtitle="Créer un nouveau client dans le système"
      />
      
      <ClientForm />
    </div>
  );
};

export default NewClientPage;