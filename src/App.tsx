import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import NewClientPage from './pages/clients/NewClientPage';
import EditClientPage from './pages/clients/EditClientPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import NewInvoicePage from './pages/invoices/NewInvoicePage';
import EditInvoicePage from './pages/invoices/EditInvoicePage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';
import ProductsPage from './pages/products/ProductsPage';
import NewProductPage from './pages/products/NewProductPage';
import EditProductPage from './pages/products/EditProductPage';
import QuotesPage from './pages/quotes/QuotesPage';
import NewQuotePage from './pages/quotes/NewQuotePage';
import EditQuotePage from './pages/quotes/EditQuotePage';
import QuoteDetailPage from './pages/quotes/QuoteDetailPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import NewPaymentPage from './pages/payments/NewPaymentPage';
import EditPaymentPage from './pages/payments/EditPaymentPage';
import SettingsPage from './pages/settings/SettingsPage';

// Auth Guards
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/" element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<NewClientPage />} />
            <Route path="clients/:id/edit" element={<EditClientPage />} />
            
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<NewInvoicePage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="invoices/:id/edit" element={<EditInvoicePage />} />

            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<NewProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />

            <Route path="quotes" element={<QuotesPage />} />
            <Route path="quotes/new" element={<NewQuotePage />} />
            <Route path="quotes/:id" element={<QuoteDetailPage />} />
            <Route path="quotes/:id/edit" element={<EditQuotePage />} />

            <Route path="payments" element={<PaymentsPage />} />
            <Route path="payments/new" element={<NewPaymentPage />} />
            <Route path="payments/:id/edit" element={<EditPaymentPage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;