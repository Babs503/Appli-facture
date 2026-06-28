import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useApp } from '../context/AppContext';

const MainLayout: React.FC = () => {
  const { settings } = useApp();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 print:hidden">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {settings.companyName} — Application de facturation
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;