import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Lock, Mail, ArrowRight, Shield, Store, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Adresse email ou mot de passe incorrect. Vous pouvez tester un compte démo ci-dessous.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setIsSubmitting(true);
    try {
      await login(demoEmail);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <QrCode className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-secondary">
            MENU<span className="text-primary">ORA</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight">
          Connexion à votre espace
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Ou{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
            créez votre compte restaurant gratuitement
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-danger">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@votre-restaurant.dz"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg transition duration-200 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-center text-text-muted uppercase tracking-wider mb-4">
              Comptes Démo prêts à tester :
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('owner@darelbey.dz')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 text-left text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-secondary font-bold">Amine (Propriétaire Dar El Bey)</strong>
                    <span className="text-gray-400">owner@darelbey.dz</span>
                  </div>
                </div>
                <span className="text-primary font-semibold">Tester →</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@menuora.dz')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-secondary font-bold">Karim (Super Admin MENUORA)</strong>
                    <span className="text-gray-400">admin@menuora.dz</span>
                  </div>
                </div>
                <span className="text-amber-700 font-semibold">Super Admin →</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('staff@darelbey.dz')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-left text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-secondary font-bold">Sarah (Équipe / Serveur)</strong>
                    <span className="text-gray-400">staff@darelbey.dz</span>
                  </div>
                </div>
                <span className="text-blue-700 font-semibold">Équipe →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

