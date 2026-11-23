import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                MENU<span className="text-primary">ORA</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              La plateforme SaaS de référence pour la création et la gestion de menus digitaux interactifs avec QR Code. Modernisez votre établissement, sublimez vos plats et offrez une expérience sans contact inoubliable à vos clients.
            </p>
            <div className="flex items-center gap-3 text-gray-400 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>Disponible dans toute l'Algérie</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Produit</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-primary transition">Fonctionnalités</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition">Comment ça marche</a></li>
              <li><a href="#demo" className="hover:text-primary transition">Démonstration live</a></li>
              <li><a href="#pricing" className="hover:text-primary transition">Grille tarifaire (DZD)</a></li>
              <li><Link to="/menu/dar-el-bey" target="_blank" className="hover:text-primary transition">Exemple de menu public</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Légal & Aide</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#faq" className="hover:text-primary transition">Foire aux questions</a></li>
              <li><a href="#" className="hover:text-primary transition">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-primary transition">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition">Sécurité des données</a></li>
              <li><Link to="/login" className="hover:text-primary transition">Espace restaurateur</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact Algérie</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Alger, Hydra / Sidi Yahia, Algérie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+213 (0) 550 12 34 56</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@menuora.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} MENUORA SaaS. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Développé avec <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> pour l'excellence de la restauration en Algérie.
          </p>
        </div>
      </div>
    </footer>
  );
};
