import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  Palette,
  Check,
  Save,
  Smartphone,
  Eye,
  CheckCircle2,
  Sparkles,
  Layout,
  Sun,
  Moon,
} from 'lucide-react';
import { CardStyle, CategoryStyle, ThemeMode } from '../../types';

export const MenuAppearancePage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const currentTheme = dataService.getTheme(activeRestaurant.id);
  const products = dataService.getProducts(activeRestaurant.id);
  const categories = dataService.getCategories(activeRestaurant.id);

  const [primaryColor, setPrimaryColor] = useState(currentTheme.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(currentTheme.secondary_color);
  const [fontFamily, setFontFamily] = useState(currentTheme.font_family);
  const [cardStyle, setCardStyle] = useState<CardStyle>(currentTheme.card_style);
  const [categoryStyle, setCategoryStyle] = useState<CategoryStyle>(currentTheme.category_style);
  const [themeMode, setThemeMode] = useState<ThemeMode>(currentTheme.theme_mode);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const COLOR_PRESETS = [
    { name: 'Orange Gourmet (Défaut)', color: '#E76F35' },
    { name: 'Rouge Braisé', color: '#DC2626' },
    { name: 'Émeraude Bio & Frais', color: '#16A34A' },
    { name: 'Or & Safran', color: '#D97706' },
    { name: 'Bleu Méditerranéen', color: '#2563EB' },
    { name: 'Noir Ébène Minimaliste', color: '#1E293B' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateTheme(activeRestaurant.id, {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      font_family: fontFamily,
      card_style: cardStyle,
      category_style: categoryStyle,
      theme_mode: themeMode,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const previewSampleProduct = products[0] || {
    name: 'Couscous Royal d\'Alger',
    price: 2400,
    description: 'Semoule fine cuite à la vapeur, agneau mijoté tendre, poulet fermier et bouillon parfumé.',
    image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80',
    is_popular: true,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-secondary">Personnalisation du menu public</h2>
          <p className="text-xs text-text-muted">
            Ajustez votre palette, vos polices et la disposition de votre carte avec un aperçu interactif en direct.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition self-start"
        >
          <Save className="w-4 h-4" />
          <span>Appliquer au menu</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Thème enregistré avec succès ! Votre menu public a adopté vos nouvelles couleurs.</span>
        </div>
      )}

      {/* Editor & Live Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Color Picker */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-secondary">Couleur Principale de la Marque</h3>
                <p className="text-[11px] text-text-muted">Utilisée pour les boutons, badges et accents visuels.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = primaryColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setPrimaryColor(preset.color)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'border-secondary font-bold bg-gray-50 ring-1 ring-secondary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-bold text-text-muted">Code Hex personnalisé :</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* Card Layout Style */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-secondary">Style d'affichage des cartes de plats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCardStyle('modern')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  cardStyle === 'modern'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-xs text-secondary mb-1">Moderne (Équilibré)</div>
                <p className="text-[11px] text-text-muted">Photo carrée à gauche avec détails et prix alignés.</p>
              </button>

              <button
                type="button"
                onClick={() => setCardStyle('visual')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  cardStyle === 'visual'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-xs text-secondary mb-1">Visuel (Gourmet)</div>
                <p className="text-[11px] text-text-muted">Grande photo panoramique en haut de chaque carte.</p>
              </button>

              <button
                type="button"
                onClick={() => setCardStyle('compact')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  cardStyle === 'compact'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-xs text-secondary mb-1">Compact (Fast-Food)</div>
                <p className="text-[11px] text-text-muted">Liste dense pour menus à fort volume de produits.</p>
              </button>
            </div>
          </div>

          {/* Theme Mode & Category Style */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-secondary">Ambiance visuelle (Mode Clair / Sombre)</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                  themeMode === 'light'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-bold'
                    : 'border-gray-200'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs">Mode Clair (Standard)</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                  themeMode === 'dark'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-bold'
                    : 'border-gray-200'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-500" />
                <span className="text-xs">Mode Sombre (Feutré VIP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Live Phone Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-text-muted flex items-center gap-1.5 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Aperçu en direct (Smartphone)</span>
            </span>
            <span className="text-[10px] text-success font-bold bg-success/10 px-2 py-0.5 rounded-full">
              Temps réel
            </span>
          </div>

          {/* Realistic Phone container */}
          <div className="bg-secondary rounded-[36px] p-2.5 shadow-2xl border-4 border-gray-800 max-w-[340px] mx-auto">
            {/* Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />

            {/* Screen */}
            <div
              className={`rounded-[26px] overflow-hidden p-3.5 min-h-[460px] text-left transition-colors duration-300 ${
                themeMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-[#242424]'
              }`}
            >
              {/* Restaurant Header in Preview */}
              <div className="flex items-center gap-2.5 mb-3">
                <img
                  src={activeRestaurant.logo_url}
                  alt="Logo"
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-xs"
                />
                <div>
                  <h4 className="font-extrabold text-xs leading-tight">{activeRestaurant.name}</h4>
                  <span className="text-[10px] text-gray-400">Alger • Ouvert</span>
                </div>
              </div>

              {/* Category Bar preview */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3 text-[11px]">
                <span
                  className="text-white font-bold px-2.5 py-1 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {categories[0]?.name || 'Plats'}
                </span>
                <span className="bg-gray-200/60 text-gray-600 px-2.5 py-1 rounded-full shrink-0">
                  {categories[1]?.name || 'Entrées'}
                </span>
                <span className="bg-gray-200/60 text-gray-600 px-2.5 py-1 rounded-full shrink-0">
                  {categories[2]?.name || 'Desserts'}
                </span>
              </div>

              {/* Sample Product Card according to selected card style */}
              <div className="space-y-2.5">
                {cardStyle === 'visual' ? (
                  <div
                    className={`rounded-2xl overflow-hidden border shadow-xs ${
                      themeMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}
                  >
                    <img
                      src={previewSampleProduct.image_url}
                      alt="Sample"
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs">{previewSampleProduct.name}</span>
                        <span className="font-black text-xs" style={{ color: primaryColor }}>
                          {previewSampleProduct.price} DA
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">
                        {previewSampleProduct.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-2.5 rounded-2xl border shadow-xs flex gap-2.5 ${
                      themeMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}
                  >
                    <img
                      src={previewSampleProduct.image_url}
                      alt="Sample"
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs truncate">{previewSampleProduct.name}</span>
                        <span className="font-black text-xs shrink-0 ml-1" style={{ color: primaryColor }}>
                          {previewSampleProduct.price} DA
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                        {previewSampleProduct.description}
                      </p>
                      <span
                        className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                      >
                        Populaire
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom CTA preview */}
              <div className="mt-4 pt-3 border-t border-gray-200/40 text-center">
                <button
                  className="w-full py-2 rounded-xl text-white font-bold text-xs shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

