import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Building, Users, Package, FileText, FilePenLine, CreditCard, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar: React.FC = () => {
  const { currentUser, logout, settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-900 text-white print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {settings.companyLogo ? (
                <img src={settings.companyLogo} alt="Logo" className="h-8 w-8 mr-2 object-contain bg-white rounded" />
              ) : (
                <Building className="h-8 w-8 mr-2" />
              )}
              <span className="font-bold text-xl">{settings.companyName}</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Tableau de bord
              </Link>
              <Link to="/clients" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Clients
              </Link>
              <Link to="/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Produits
              </Link>
              <Link to="/invoices" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Factures
              </Link>
              <Link to="/quotes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Devis
              </Link>
              <Link to="/payments" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Paiements
              </Link>
              {currentUser?.role === 'admin' && (
                <Link to="/settings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                  Paramètres
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="mr-2">{currentUser?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-blue-800"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <BarChart3 className="mr-3 h-5 w-5" />
                Tableau de bord
              </div>
            </Link>
            <Link 
              to="/clients" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5" />
                Clients
              </div>
            </Link>
            <Link 
              to="/products" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Package className="mr-3 h-5 w-5" />
                Produits
              </div>
            </Link>
            <Link 
              to="/invoices" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <FileText className="mr-3 h-5 w-5" />
                Factures
              </div>
            </Link>
            <Link 
              to="/quotes" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <FilePenLine className="mr-3 h-5 w-5" />
                Devis
              </div>
            </Link>
            <Link 
              to="/payments" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                Paiements
              </div>
            </Link>
            {currentUser?.role === 'admin' && (
              <Link 
                to="/settings" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5" />
                  Paramètres
                </div>
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none">{currentUser?.name}</div>
                <div className="text-sm font-medium leading-none text-gray-300 mt-1">{currentUser?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;