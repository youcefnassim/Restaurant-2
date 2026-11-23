import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          Récupération de mot de passe
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Saisissez votre e-mail pour recevoir le lien de réinitialisation.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-gray-100">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-secondary">E-mail envoyé avec succès</h3>
              <p className="text-sm text-text-muted">
                Si un compte correspond à <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour à la connexion</span>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  Votre adresse e-mail
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

              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 transition duration-200"
              >
                Envoyer les instructions
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-secondary"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la page de connexion</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

