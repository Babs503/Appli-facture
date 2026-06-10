import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ClientForm from '../../components/clients/ClientForm';
import PageHeader from '../../components/common/PageHeader';
import { useApp } from '../../context/AppContext';

const EditClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getClientById } = useApp();
  
  const client = id ? getClientById(id) : undefined;
  
  if (!client) {
    return <Navigate to="/clients" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={`Modifier ${client.name}`}
        subtitle="Mettre à jour les informations du client"
      />
      
      <ClientForm client={client} isEditing={true} />
    </div>
  );
};

export default EditClientPage;