import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import SettingsForm from '../../components/settings/SettingsForm';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Paramètres"
        subtitle="Coordonnées de l'entreprise, logo et réglages de facturation"
      />
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
