import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building, Users, Package, FileText, FilePenLine, CreditCard, BarChart3, Settings, HardHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const links = [
  { to: '/dashboard',  label: 'Tableau de bord',    icon: BarChart3 },
  { to: '/clients',    label: 'Clients',             icon: Users },
  { to: '/products',   label: 'Produits & Services', icon: Package },
  { to: '/quotes',     label: 'Devis',               icon: FilePenLine },
  { to: '/invoices',   label: 'Factures',            icon: FileText },
  { to: '/btp',        label: 'Matériaux BTP',       icon: HardHat },
  { to: '/payments',   label: 'Paiements',           icon: CreditCard },
];

const Navbar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-bsm-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Building className="h-8 w-8 text-bsm-orange" />
            <div>
              <span className="font-bold text-lg leading-none">BSM FacturePro</span>
              <p className="text-xs text-gray-400 leading-none">Construire avec confiance</p>
            </div>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-baseline gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-bsm-orange text-white'
                    : 'text-gray-300 hover:bg-bsm-navy-light hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-bsm-orange text-white'
                    : 'text-gray-300 hover:bg-bsm-navy-light hover:text-white'
                }`}
              >
                Paramètres
              </Link>
            )}
          </div>

          {/* Utilisateur desktop */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-300">{currentUser?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 border border-gray-500 rounded-md text-sm font-medium hover:bg-bsm-orange hover:border-bsm-orange transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-bsm-navy-light"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-bsm-orange text-white'
                    : 'text-gray-300 hover:bg-bsm-navy-light hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-700 px-4 py-3">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.email}</p>
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-bsm-navy-light"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
