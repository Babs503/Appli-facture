import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ProductForm from '../../components/products/ProductForm';
import { useApp } from '../../context/AppContext';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useApp();

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={`Modifier ${product.name}`} subtitle="Mettre à jour le produit" />
      <ProductForm product={product} isEditing />
    </div>
  );
};

export default EditProductPage;
