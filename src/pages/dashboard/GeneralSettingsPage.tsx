import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Settings, Shield, RefreshCw, CheckCircle2, User, Mail, Phone } from 'lucide-react';

export const GeneralSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration MENUORA par défaut ?')) {
      dataService.resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-secondary">Paramètres du compte</h2>
        <p className="text-xs text-text-muted">
          Gérez votre profil utilisateur, la sécurité et la configuration de l’application.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Données réinitialisées avec succès. Rechargement...</span>
        </div>
      )}

      {/* Profile Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-secondary">Profil utilisateur</h3>
            <p className="text-xs text-text-muted">Informations personnelles du compte connecté.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-secondary uppercase tracking-wider mb-1">Nom complet</label>
            <input
              type="text"
              readOnly
              value={user?.full_name || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase tracking-wider mb-1">Adresse e-mail</label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase tracking-wider mb-1">Rôle plateforme</label>
            <input
              type="text"
              readOnly
              value={user?.role?.replace('_', ' ') || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 capitalize"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase tracking-wider mb-1">Téléphone</label>
            <input
              type="text"
              readOnly
              value={user?.phone || '+213 550 12 34 56'}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Demo data management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-secondary">Réinitialisation des données démo</h3>
            <p className="text-xs text-text-muted">Restaure la carte et les produits par défaut de Dar El Bey et Smash Burger.</p>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          Si vous avez modifié des prix, des noms de plats ou des thèmes et souhaitez repartir d'un jeu de données neuf, vous pouvez réinitialiser le stockage local ici.
        </p>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-secondary text-xs font-bold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Restaurer les données d'origine</span>
        </button>
      </div>
    </div>
  );
};

