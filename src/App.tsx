import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import NewClientPage from './pages/clients/NewClientPage';
import EditClientPage from './pages/clients/EditClientPage';

// Auth Guards
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard\" replace />} />
          
          <Route path="/" element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<NewClientPage />} />
            <Route path="clients/:id/edit" element={<EditClientPage />} />
            
            {/* Future routes for products, invoices, quotes, payments, settings */}
            <Route path="products" element={<div className="container mx-auto px-4 py-8">Page Produits en construction</div>} />
            <Route path="invoices" element={<div className="container mx-auto px-4 py-8">Page Factures en construction</div>} />
            <Route path="quotes" element={<div className="container mx-auto px-4 py-8">Page Devis en construction</div>} />
            <Route path="payments" element={<div className="container mx-auto px-4 py-8">Page Paiements en construction</div>} />
            <Route path="settings" element={<div className="container mx-auto px-4 py-8">Page Paramètres en construction</div>} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;