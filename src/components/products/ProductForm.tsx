import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';

interface ProductFormProps {
  /** Le produit à modifier (uniquement en mode édition) */
  product?: Product;
  /** true = modification d'un produit existant, false = création (défaut) */
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isEditing = false }) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct, settings } = useApp();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [unit, setUnit] = useState(product?.unit ?? '');
  const [price, setPrice] = useState<number>(product?.price ?? 0);
  const [stock, setStock] = useState<number>(product?.stock ?? 0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Le nom du produit est requis.');
      return;
    }
    setError('');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      unit: unit.trim(),
      // Le FCFA n'a pas de décimale : on arronde le prix à l'entier au stockage
      price: Math.round(price || 0),
      stock: Math.round(stock || 0),
    };

    if (isEditing && product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </h3>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unité
            </label>
            <input
              type="text"
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="m², kg, unité, heure…"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Prix unitaire ({settings.currencySymbol})
            </label>
            <input
              type="number"
              id="price"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-right focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-right focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => navigate('/products')} icon={<X className="h-4 w-4" />}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
          {isEditing ? 'Enregistrer' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
