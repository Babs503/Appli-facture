import React from 'react';
import { useApp } from '../../context/AppContext';
import LoginPage from '../../pages/auth/LoginPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser } = useApp();
  
  // For this MVP, we're auto-logging in
  // In a real app, we would check for a valid session/token

  if (!currentUser) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;