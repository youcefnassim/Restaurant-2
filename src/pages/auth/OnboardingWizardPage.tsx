import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  Store,
  Layers,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingWizardPage: React.FC = () => {
  const { activeRestaurant, refreshRestaurant } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1: Restaurant Info
  const [restName, setRestName] = useState(activeRestaurant?.name || 'Mon Nouveau Restaurant');
  const [address, setAddress] = useState(activeRestaurant?.address || 'Alger, Algérie');
  const [phone, setPhone] = useState(activeRestaurant?.phone || '+213 550 00 00 00');
  const [currency, setCurrency] = useState('DZD');

  // Step 2: Categories & First Product
  const [categoryName, setCategoryName] = useState('Plats Principaux');
  const [categoryNameAr, setCategoryNameAr] = useState('الأطباق الرئيسية');
  const [productName, setProductName] = useState('Spécialité Maison du Chef');
  const [productPrice, setProductPrice] = useState('1800');
  const [productDesc, setProductDesc] = useState('Recette signature préparée avec des ingrédients frais du terroir.');

  useEffect(() => {
    if (activeRestaurant) {
      setRestName(activeRestaurant.name);
      setAddress(activeRestaurant.address);
      setPhone(activeRestaurant.phone);
    }
  }, [activeRestaurant]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRestaurant) {
      dataService.updateRestaurant(activeRestaurant.id, {
        name: restName,
        address,
        phone,
        currency,
      });
      refreshRestaurant();
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRestaurant) {
      // Create first category
      const cat = dataService.createCategory({
        restaurant_id: activeRestaurant.id,
        name: categoryName,
        name_ar: categoryNameAr,
        sort_order: 1,
        is_active: true,
      });

      // Create first product
      dataService.createProduct({
        restaurant_id: activeRestaurant.id,
        category_id: cat.id,
        name: productName,
        price: parseFloat(productPrice) || 1500,
        description: productDesc,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        is_available: true,
        is_popular: true,
        sort_order: 1,
      });
    }

    // Launch celebratory confetti for Step 3
    setStep(3);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Safe fallback if confetti isn't supported
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistant de configuration MENUORA</span>
          </div>
          <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
            Configurez votre menu digital
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            En 3 étapes simples, votre menu sera en ligne et prêt à être scanné.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-10">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 1 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <span className="text-xs font-medium text-text-muted mt-2">Établissement</span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 2 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span className="text-xs font-medium text-text-muted mt-2">Premier plat</span>
          </div>

          <div className={`flex-1 h-1 mx-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 3 ? 'bg-success text-white shadow-md shadow-success/20' : 'bg-gray-200 text-gray-500'
              }`}
            >
              ✓
            </div>
            <span className="text-xs font-medium text-text-muted mt-2">Votre QR Code</span>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100">
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-secondary">Profil de votre établissement</h3>
                  <p className="text-xs text-text-muted">Ces informations apparaîtront en tête de votre menu public.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  Nom du restaurant
                </label>
                <input
                  type="text"
                  required
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="Ex: Le Grill d'Alger"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="Hydra, Alger"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Téléphone (Algérie)
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                    placeholder="+213 550 12 34 56"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  Devise d'affichage
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition bg-white"
                >
                  <option value="DZD">Dinar Algérien (DZD / DA)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-primary/20 transition"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-secondary">Ajoutez votre premier plat</h3>
                  <p className="text-xs text-text-muted">Vous pourrez en ajouter d'autres à tout moment depuis le dashboard.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Nom de la catégorie (Français)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Nom de la catégorie (العربية)
                  </label>
                  <input
                    type="text"
                    value={categoryNameAr}
                    onChange={(e) => setCategoryNameAr(e.target.value)}
                    dir="rtl"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Nom du plat
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Prix ({currency})
                  </label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  Description appétissante
                </label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-primary/20 transition"
                >
                  <span>Créer et générer mon QR Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-secondary">Félicitations !</h3>
                <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
                  Votre restaurant <strong>{restName}</strong> possède désormais son propre menu digital interactif.
                </p>
              </div>

              {/* QR Code preview box */}
              <div className="bg-bg p-6 rounded-2xl border border-gray-200 inline-block shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://menuora.dz/menu/${activeRestaurant?.slug || 'mon-menu'}&color=22-22-22`}
                  alt="QR Code"
                  className="w-44 h-44 mx-auto rounded-lg"
                />
                <span className="block text-xs font-mono text-gray-500 mt-3">
                  menuora.dz/menu/{activeRestaurant?.slug || 'mon-menu'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                {activeRestaurant && (
                  <a
                    href={`/menu/${activeRestaurant.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-secondary font-bold px-6 py-3 rounded-xl transition"
                  >
                    <span>Voir mon menu en direct</span>
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </a>
                )}

                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3 rounded-xl shadow-md shadow-primary/20 transition"
                >
                  <span>Accéder à mon Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

