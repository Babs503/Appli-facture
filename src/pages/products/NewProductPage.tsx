import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import ProductForm from '../../components/products/ProductForm';

const NewProductPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Nouveau produit" subtitle="Ajouter un produit ou service au catalogue" />
      <ProductForm />
    </div>
  );
};

export default NewProductPage;
