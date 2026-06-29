import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Building, Mail, Lock, User } from 'lucide-react';
import Button from '../../components/common/Button';

type Mode = 'login' | 'signup';

const LoginPage: React.FC = () => {
  const { login, signup, users, settings } = useApp();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { ok, error: err } = await signup(name, email, password);
        if (!ok) {
          setError(err || "Échec de l'inscription");
        } else {
          // Si la confirmation par email est désactivée, la session s'ouvre automatiquement.
          // Sinon, l'utilisateur doit confirmer son email avant de se connecter.
          setInfo('Compte créé. Si demandé, confirmez votre email puis connectez-vous.');
          setMode('login');
          setPassword('');
        }
      } else {
        const success = await login(email, password);
        if (!success) {
          setError('Email ou mot de passe incorrect');
        }
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  // Comptes de démonstration : uniquement en mode local (Supabase non configuré)
  const demoAccounts = users.map(user => ({ email: user.email, role: user.role }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {settings.companyName}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signup' ? 'Créer un compte' : 'Application de facturation'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {info && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" role="status">
                <span className="block sm:inline">{info}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                {mode === 'signup' ? 'Créer le compte' : 'Se connecter'}
              </Button>
            </div>
          </form>

          {/* Bascule connexion / inscription (mode cloud uniquement) */}
          {isSupabaseConfigured && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Pas encore de compte ? Créer un compte
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setInfo(''); }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Déjà un compte ? Se connecter
                </button>
              )}
            </div>
          )}

          {/* Comptes de démonstration — uniquement sans backend configuré */}
          {!isSupabaseConfigured && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4">
                <strong>Comptes de démonstration :</strong> Pour cette version de test, utilisez n'importe quel email ci-dessous avec n'importe quel mot de passe.
              </div>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{account.email}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {account.role === 'admin' ? 'Administrateur' : account.role === 'sales' ? 'Commercial' : 'Comptable'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
