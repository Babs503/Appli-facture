import React from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ProductList from '../../components/products/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Produits"
        subtitle="Gérez votre catalogue de produits et services"
        action={
          <Link to="/products/new">
            <Button variant="primary" icon={<PackagePlus className="h-4 w-4" />}>
              Nouveau produit
            </Button>
          </Link>
        }
      />
      <ProductList />
    </div>
  );
};

export default ProductsPage;
