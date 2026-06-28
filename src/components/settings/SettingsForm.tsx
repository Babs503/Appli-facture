import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppSettings } from '../../types';
import Button from '../common/Button';
import { Save, Upload, Trash2, Building } from 'lucide-react';

/** Taille max du logo avant encodage (200 Ko) pour éviter de saturer localStorage */
const MAX_LOGO_BYTES = 200 * 1024;

const SettingsForm: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [logoError, setLogoError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    setSaved(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoError('Veuillez choisir un fichier image.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Image trop volumineuse (max 200 Ko).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, companyLogo: reader.result as string }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setForm((prev) => ({ ...prev, companyLogo: undefined }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="status">
          Paramètres enregistrés.
        </div>
      )}

      {/* Logo */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo de l'entreprise</h3>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            {form.companyLogo ? (
              <img src={form.companyLogo} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <Building className="h-10 w-10 text-gray-300" />
            )}
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choisir une image
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
            {form.companyLogo && (
              <button
                type="button"
                onClick={removeLogo}
                className="block text-sm text-red-600 hover:text-red-800 inline-flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Retirer le logo
              </button>
            )}
            <p className="text-xs text-gray-500">PNG ou JPG, 200 Ko maximum.</p>
            {logoError && <p className="text-sm text-red-600">{logoError}</p>}
          </div>
        </div>
      </div>

      {/* Coordonnées de l'entreprise */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom / Raison sociale
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              rows={2}
              value={form.companyAddress}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={form.companyPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={form.companyEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="companyTaxId" className="block text-sm font-medium text-gray-700 mb-1">
              NINEA / RC
            </label>
            <input
              type="text"
              id="companyTaxId"
              name="companyTaxId"
              value={form.companyTaxId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Réglages de facturation */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Facturation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="defaultTaxRate" className="block text-sm font-medium text-gray-700 mb-1">
              TVA par défaut (%)
            </label>
            <input
              type="number"
              id="defaultTaxRate"
              name="defaultTaxRate"
              min={0}
              value={form.defaultTaxRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <input
              type="text"
              id="currencySymbol"
              name="currencySymbol"
              value={form.currencySymbol}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="defaultPaymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
              Conditions de paiement par défaut
            </label>
            <input
              type="text"
              id="defaultPaymentTerms"
              name="defaultPaymentTerms"
              value={form.defaultPaymentTerms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
