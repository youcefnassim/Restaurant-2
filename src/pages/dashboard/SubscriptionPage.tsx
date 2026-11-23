import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { CreditCard, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const { subscription, plan } = dataService.getSubscription(activeRestaurant.id);
  const allPlans = dataService.getPlans();
  const products = dataService.getProducts(activeRestaurant.id);
  const categories = dataService.getCategories(activeRestaurant.id);
  const qrCodes = dataService.getQrCodes(activeRestaurant.id);

  const [notification, setNotification] = useState('');

  const handleSelectPlan = (newPlanSlug: string) => {
    setNotification(`Votre demande de passage au forfait a été enregistrée. Notre équipe vous contactera pour la validation du paiement CCP / BaridiMob.`);
    setTimeout(() => setNotification(''), 6000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-xl font-extrabold text-secondary">Abonnement & Formule SaaS</h2>
        <p className="text-xs text-text-muted">
          Gérez votre formule, consultez l'échéance de votre abonnement et suivez l'utilisation de vos quotas.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center gap-3 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="bg-gradient-to-r from-secondary to-gray-800 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-success/20 text-green-300 border border-success/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Abonnement {subscription.status === 'active' ? 'Actif' : 'Période d\'essai'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Forfait {plan.name}
          </h3>
          <p className="text-gray-300 text-sm">
            Expire le {new Date(subscription.expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="text-right sm:text-right relative z-10">
          <div className="text-3xl font-black text-primary">
            {plan.price_monthly.toLocaleString('fr-FR')} {plan.currency}
          </div>
          <div className="text-xs text-gray-400">par mois</div>
        </div>
      </div>

      {/* Quotas & Usage Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text-muted uppercase tracking-wider">Produits sur la carte</span>
            <span className="font-extrabold text-secondary">
              {products.length} / {plan.max_products}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (products.length / plan.max_products) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted">
            {plan.max_products - products.length} emplacements de plats restants.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text-muted uppercase tracking-wider">Catégories actives</span>
            <span className="font-extrabold text-secondary">
              {categories.length} / {plan.max_categories}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (categories.length / plan.max_categories) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted">
            {plan.max_categories - categories.length} catégories restantes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text-muted uppercase tracking-wider">QR Codes de tables</span>
            <span className="font-extrabold text-secondary">
              {qrCodes.length} / {plan.max_qr_codes}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (qrCodes.length / plan.max_qr_codes) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted">
            Jusqu’à {plan.max_qr_codes} tables simultanées.
          </p>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-lg text-secondary">Changer de formule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allPlans.map((p) => {
            const isCurrent = p.id === plan.id;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'border-2 border-primary shadow-lg shadow-primary/10'
                    : 'border-gray-200/80 shadow-xs hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-extrabold text-lg text-secondary">{p.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full uppercase">
                        Forfait Actuel
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-secondary mb-4">
                    {p.price_monthly.toLocaleString('fr-FR')} {p.currency}{' '}
                    <span className="text-xs font-normal text-text-muted">/ mois</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-text-muted mb-6">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(p.slug)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : 'bg-secondary hover:bg-gray-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Votre formule active' : `Passer à ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

