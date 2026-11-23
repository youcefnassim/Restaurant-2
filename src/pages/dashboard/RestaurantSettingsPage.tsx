import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  Save,
  Store,
  MapPin,
  Phone,
  Wifi,
  Clock,
  Globe,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { OpeningHours, SocialLinks } from '../../types';

export const RestaurantSettingsPage: React.FC = () => {
  const { activeRestaurant, refreshRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const [name, setName] = useState(activeRestaurant.name);
  const [description, setDescription] = useState(activeRestaurant.description);
  const [logoUrl, setLogoUrl] = useState(activeRestaurant.logo_url);
  const [coverUrl, setCoverUrl] = useState(activeRestaurant.cover_url);
  const [address, setAddress] = useState(activeRestaurant.address);
  const [phone, setPhone] = useState(activeRestaurant.phone);
  const [wifiPassword, setWifiPassword] = useState(activeRestaurant.wifi_password || '');
  const [currency, setCurrency] = useState(activeRestaurant.currency || 'DZD');
  const [defaultLanguage, setDefaultLanguage] = useState(activeRestaurant.default_language || 'fr');
  const [isOrderingEnabled, setIsOrderingEnabled] = useState(activeRestaurant.is_ordering_enabled);
  const [whatsappNumber, setWhatsappNumber] = useState(activeRestaurant.whatsapp_number || '');
  const [status, setStatus] = useState(activeRestaurant.status);

  const [openingHours, setOpeningHours] = useState<OpeningHours>(
    activeRestaurant.opening_hours || {
      monday: '10:00 - 23:00',
      tuesday: '10:00 - 23:00',
      wednesday: '10:00 - 23:00',
      thursday: '10:00 - 23:00',
      friday: '15:00 - 00:00',
      saturday: '10:00 - 00:00',
      sunday: '10:00 - 23:00',
    }
  );

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    activeRestaurant.social_links || { instagram: '', facebook: '', tiktok: '', website: '' }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateRestaurant(activeRestaurant.id, {
      name,
      description,
      logo_url: logoUrl,
      cover_url: coverUrl,
      address,
      phone,
      wifi_password: wifiPassword,
      currency,
      default_language: defaultLanguage,
      is_ordering_enabled: isOrderingEnabled,
      whatsapp_number: whatsappNumber,
      status,
      opening_hours: openingHours,
      social_links: socialLinks,
    });
    refreshRestaurant();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>Informations du restaurant mises à jour avec succès ! Votre menu public a été actualisé.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-secondary">Identité de l'établissement</h3>
              <p className="text-xs text-text-muted">Nom, descriptions et images affichées aux clients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Nom du restaurant
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Statut du restaurant
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition bg-white"
              >
                <option value="active">Actif (Menu accessible en ligne)</option>
                <option value="suspended">Suspendu (Temporairement inaccessible)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
              Description de l'établissement
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                URL du Logo
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                URL de l'image de couverture
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="w-16 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Localisation */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-secondary">Coordonnées & Accès</h3>
              <p className="text-xs text-text-muted">Adresse, numéro de téléphone et code Wi-Fi client.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Adresse complète
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Numéro de téléphone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Mot de passe Wi-Fi (affiché sur le menu)
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Ex: MonWifiResto2025"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Devise & Langue par défaut
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="DZD">DZD (DA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes WhatsApp */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-secondary">Commandes directes WhatsApp</h3>
                <p className="text-xs text-text-muted">Permettez aux clients d'envoyer leur panier directement sur votre WhatsApp.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOrderingEnabled}
                onChange={(e) => setIsOrderingEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>

          {isOrderingEnabled && (
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                Numéro WhatsApp de réception des commandes (avec indicatif +213)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+213550123456"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              <p className="text-[11px] text-text-muted mt-1.5">
                Le client verra un bouton "Commander" sur son menu et pourra envoyer le récapitulatif avec table et suppléments en un clic.
              </p>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-secondary">Horaires d'ouverture</h3>
              <p className="text-xs text-text-muted">Affichés sur le menu digital pour renseigner vos clients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {Object.entries(openingHours).map(([day, hours]) => (
              <div key={day} className="bg-bg p-3 rounded-xl border border-gray-100">
                <span className="block font-bold text-secondary uppercase tracking-wider mb-1">
                  {day === 'monday'
                    ? 'Lundi'
                    : day === 'tuesday'
                    ? 'Mardi'
                    : day === 'wednesday'
                    ? 'Mercredi'
                    : day === 'thursday'
                    ? 'Jeudi'
                    : day === 'friday'
                    ? 'Vendredi'
                    : day === 'saturday'
                    ? 'Samedi'
                    : 'Dimanche'}
                </span>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setOpeningHours({ ...openingHours, [day]: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-7 py-3 rounded-xl shadow-md shadow-primary/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
};
