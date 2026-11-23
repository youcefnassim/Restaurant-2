import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Smartphone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  Image,
  Sliders,
  BarChart3,
  Globe2,
  ShieldCheck,
  ChevronDown,
  Eye,
  Store,
  Printer,
  Zap,
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { dataService } from '../../services/dataService';

export const LandingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = dataService.getPlans();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Comment fonctionne le QR Code pour mes clients ?',
      a: 'Le client ouvre l’appareil photo de son smartphone (iPhone ou Android) et vise simplement le QR Code posé sur la table. Votre menu digital s’ouvre instantanément dans son navigateur web, sans aucune application à télécharger ni inscription requise.',
    },
    {
      q: 'Dois-je réimprimer mes QR Codes si je change mes prix ou mes plats ?',
      a: 'Absolument jamais ! Le QR Code est permanent et pointe vers votre URL unique MENUORA. Lorsque vous modifiez un prix, ajoutez une photo ou activez une rupture de stock depuis votre dashboard, les clients voient le changement en temps réel à la seconde près.',
    },
    {
      q: 'Le menu est-il compatible avec tous les smartphones ?',
      a: 'Oui, MENUORA est conçu pour fonctionner de façon ultra-fluide sur tous les smartphones (iOS et Android), tablettes et ordinateurs, même avec une connexion 3G/4G moyenne en Algérie.',
    },
    {
      q: 'Quels sont les frais d’abonnement et modes de paiement ?',
      a: 'Nos forfaits sont transparents et sans engagement (Starter, Professional, Business), payables en Dinars Algériens (DZD). Nous acceptons les paiements par BaridiMob, virement CCP, virement bancaire et espèces.',
    },
    {
      q: 'Que se passe-t-il si la connexion Internet du client est lente ?',
      a: 'L’architecture frontend de MENUORA est ultra-légère et optimise automatiquement le poids des photographies culinaires pour un chargement express en moins d’une seconde même sur les réseaux mobiles standards.',
    },
    {
      q: 'Combien de temps faut-il pour créer et lancer mon menu ?',
      a: 'Moins de 10 minutes ! Notre assistant de création intuitif vous guide étape par étape : vous saisissez le nom de votre établissement, ajoutez vos premières catégories, téléchargez vos plats, et votre QR Code est prêt à être imprimé.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-4 h-4" />
                <span>La solution N°1 en Algérie pour restaurants & cafés</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary tracking-tight leading-[1.15]">
                Votre menu, <br className="hidden sm:inline" />
                <span className="text-primary relative inline-block">
                  toujours à portée de main.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                    <path d="M5 15Q150 2 295 15" stroke="#E76F35" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transformez votre menu traditionnel en une expérience digitale moderne grâce à un simple QR Code. Modifiez vos prix à tout moment, mettez vos plats en valeur et gagnez du temps en salle.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                  <Store className="w-5 h-5" />
                  <span>Créer mon menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#demo"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-secondary border border-gray-200 text-base font-semibold px-7 py-3.5 rounded-xl shadow-sm hover:shadow transition"
                >
                  <Eye className="w-5 h-5 text-primary" />
                  <span>Découvrir une démonstration</span>
                </a>
              </div>

              {/* Mini trust signals */}
              <div className="pt-6 border-t border-gray-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Sans application à installer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Mise à jour en 1 clic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Support en Algérie (DZD)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Decorative background glow */}
              <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none" />

              {/* Realistic Smartphone Frame */}
              <div className="relative w-[320px] sm:w-[350px] bg-secondary rounded-[42px] p-3 shadow-2xl border-4 border-gray-800">
                {/* Speaker & notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-900 mr-2" />
                  <div className="w-12 h-1 bg-gray-700 rounded-full" />
                </div>

                {/* Screen Content */}
                <div className="relative bg-white rounded-[32px] overflow-hidden border border-gray-200 pt-8 pb-4 text-left">
                  {/* Mock Menu Header */}
                  <div className="relative h-32 bg-gray-900 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                      alt="Dar El Bey"
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-primary border-2 border-white flex items-center justify-center font-bold text-white text-base">
                        M
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight">Dar El Bey Alger</h4>
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Ouvert aujourd’hui
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Categories Bar */}
                  <div className="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-gray-100 text-xs">
                    <span className="bg-primary text-white font-semibold px-3 py-1 rounded-full shrink-0">
                      Plats Traditionnels
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full shrink-0">
                      Entrées
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full shrink-0">
                      Grillades
                    </span>
                  </div>

                  {/* Mock Product Items */}
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3 p-2.5 rounded-xl border border-gray-100 shadow-sm bg-white hover:border-primary/30 transition">
                      <img
                        src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=200&q=80"
                        alt="Couscous"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-xs text-secondary truncate">Couscous Royal d'Alger</h5>
                          <span className="text-primary font-bold text-xs">2 400 DA</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                          Agneau mijoté tendre, poulet fermier, légumes du terroir et semoule fine.
                        </p>
                        <span className="inline-block mt-1 text-[9px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                          ★ Populaire
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 p-2.5 rounded-xl border border-gray-100 shadow-sm bg-white">
                      <img
                        src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=200&q=80"
                        alt="Chorba"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-xs text-secondary truncate">Chorba Frik & Bourek</h5>
                          <span className="text-primary font-bold text-xs">1 200 DA</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                          Blé vert concassé, agneau et 2 boureks croustillants.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge bottom */}
                  <div className="px-4 pt-1">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        <span className="text-[11px] font-bold text-secondary">Table N° 4</span>
                      </div>
                      <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-md">
                        Menu en direct
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating KPI card 1 */}
              <div className="hidden sm:flex absolute -bottom-6 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-text-muted">Scans enregistrés</div>
                  <div className="text-base font-extrabold text-secondary">+1 420 cette semaine</div>
                </div>
              </div>

              {/* Floating KPI card 2 */}
              <div className="hidden sm:flex absolute -top-4 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-secondary">Mise à jour directe</div>
                  <div className="text-[11px] text-text-muted">Prix changés en 0.2s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROBLEMS VS SOLUTIONS ===================== */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">
              Pourquoi passer au digital ?
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">
              Les menus papier appartiennent au passé
            </h3>
            <p className="text-text-muted text-base mt-4">
              Comparez les contraintes quotidiennes d’un menu papier avec les avantages décisifs de MENUORA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Old Way: Paper Menu */}
            <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-danger flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-secondary">Menu Papier Traditionnel</h4>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Réimpressions coûteuses</strong>
                    <span className="text-text-muted text-sm">Chaque changement de tarif ou de plat nécessite d’imprimer à nouveau 50 ou 100 livrets.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Aucune flexibilité sur les ruptures</strong>
                    <span className="text-text-muted text-sm">Un ingrédient manque en cuisine ? Les serveurs doivent s’excuser auprès de chaque client.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Manque de visuels appétissants</strong>
                    <span className="text-text-muted text-sm">Espace restreint pour les photos, descriptions tronquées et aspect souvent dégradé avec le temps.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Hygiène et usure</strong>
                    <span className="text-text-muted text-sm">Les menus se tachent, s’abîment et passent de main en main toute la journée.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* The New Way: MENUORA */}
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 relative shadow-sm">
              <div className="absolute -top-3 right-6 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommandé
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-secondary">MENUORA Digital Menu</h4>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Modifications instantanées en 1 clic</strong>
                    <span className="text-text-muted text-sm">Modifiez vos prix, ajoutez la suggestion du chef ou un nouveau dessert depuis votre smartphone.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Gestion des stocks et disponibilités</strong>
                    <span className="text-text-muted text-sm">Désactivez un plat en rupture d’un simple glissement de bouton sans rature sur le menu.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">Photos gastronomiques HD & Variantes</strong>
                    <span className="text-text-muted text-sm">Mettez l'eau à la bouche avec des visuels gourmands, vos tailles de portion et vos suppléments.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary block text-sm">QR Code unique et permanent</strong>
                    <span className="text-text-muted text-sm">Imprimez vos chevalets une seule fois. Votre QR Code reste valable pour toujours !</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section id="features" className="py-20 lg:py-28 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">
              Fonctionnalités avancées
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">
              Tout ce dont votre restaurant a besoin pour rayonner
            </h3>
            <p className="text-text-muted text-base mt-4">
              Conçu spécifiquement pour les professionnels de la restauration en Algérie, du petit café branché aux grandes tables gastronomiques.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Menu digital interactif</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Une expérience fluide, ultra-rapide et ergonomique sur smartphone avec recherche instantanée et filtres par catégorie.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">QR Code personnalisé</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Générez des QR Codes élégants avec vos couleurs de marque et le logo de votre restaurant intégré au centre.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Gestion des catégories</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Organisez vos entrées, plats, pizzas, grillades, desserts et boissons avec réorganisation par simple glisser-déposer.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Variantes & Suppléments</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Configurez des tailles de portion (Petite, Moyenne, Grande) et des extras payants (fromage, sauce, garnitures supplémentaires).
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Image className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Photos culinaires HD</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Sublimez vos créations avec des photographies en haute définition optimisées pour un affichage express sans ralentissement.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Gestion des disponibilités</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Passez un produit en rupture d’un clic ou mettez en avant vos plats vedettes grâce au badge "Populaire".
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Multilingue & Support Arabe RTL</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Offrez un accueil parfait à vos clients locaux et touristes : Français, Arabe avec mise en page RTL native, et Anglais.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Statistiques & Plats préférés</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Analysez vos scans quotidiens, identifiez vos plats les plus consultés et optimisez votre carte avec des données réelles.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Printer className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-secondary mb-2">Impression Chevalets & Tables</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Téléchargez vos QR Codes en formats haute définition PNG, SVG et modèles PDF prêts à imprimer pour chaque table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">
              Simplicité absolue
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">
              Comment ça marche ?
            </h3>
            <p className="text-text-muted text-base mt-4">
              Passez au digital en 3 étapes simples et commencez à accueillir vos premiers clients aujourd’hui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-bg p-8 rounded-2xl border border-gray-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-primary font-black text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">Créez votre restaurant</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Inscrivez-vous en quelques secondes, renseignez le nom de votre établissement, votre adresse, vos horaires et votre logo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-bg p-8 rounded-2xl border border-gray-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                2
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">Personnalisez votre menu</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Ajoutez vos catégories et produits avec leurs photos, descriptions et prix en Dinars. Choisissez vos couleurs de marque.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-bg p-8 rounded-2xl border border-gray-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-primary font-black text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h4 className="text-xl font-bold text-secondary mb-3">Partagez votre QR Code</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Téléchargez votre QR Code unique, imprimez-le sur vos tables ou chevalets. Vos clients scannent et dégustent immédiatement !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LIVE DEMO SHOWCASE ===================== */}
      <section id="demo" className="py-20 lg:py-28 bg-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Démonstration en temps réel</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Testez un menu digital comme si vous étiez à table
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Découvrez le menu digital de notre restaurant partenaire de démonstration <strong>« Dar El Bey »</strong> à Hydra, Alger.
                Naviguez entre les catégories traditionnelles, observez les photos en haute définition, testez les variantes de portions et le sélecteur multilingue.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/menu/dar-el-bey"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/30 transition"
                >
                  <Eye className="w-5 h-5" />
                  <span>Ouvrir le menu « Dar El Bey »</span>
                </Link>
                <Link
                  to="/menu/smash-burger"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition"
                >
                  <span>Ouvrir « Le Smash Burger »</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-white p-6 rounded-3xl shadow-2xl text-secondary max-w-sm w-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-secondary">Scannez ou cliquez</h4>
                <p className="text-xs text-text-muted mt-1 mb-6">
                  Menu public réel sans inscription requise
                </p>

                {/* Simulated QR Code Box */}
                <div className="bg-bg p-5 rounded-2xl border border-gray-200 inline-block mb-6">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://menuora.dz/menu/dar-el-bey&color=22-22-22"
                    alt="QR Code Dar El Bey"
                    className="w-40 h-40 mx-auto"
                  />
                </div>

                <Link
                  to="/menu/dar-el-bey"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition"
                >
                  <span>Accéder directement au menu</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING SECTION ===================== */}
      <section id="pricing" className="py-20 lg:py-28 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">
              Tarification transparente en Dinar Algérien
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">
              Des forfaits adaptés à chaque établissement
            </h3>
            <p className="text-text-muted text-base mt-4">
              Investissez dans une solution pérenne. Prix modifiables directement depuis l'espace Super Admin.
            </p>

            {/* Billing switcher */}
            <div className="mt-8 inline-flex items-center p-1.5 bg-gray-200/60 rounded-xl">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-text-muted hover:text-secondary'
                }`}
              >
                Facturation mensuelle
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-text-muted hover:text-secondary'
                }`}
              >
                <span>Annuel</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -17% Économie
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const price = billingPeriod === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12);
              const isPopular = plan.slug === 'professional';

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-8 border transition-all duration-300 relative flex flex-col justify-between ${
                    isPopular
                      ? 'border-2 border-primary shadow-xl shadow-primary/10 lg:-translate-y-2'
                      : 'border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold py-1 px-4 rounded-full uppercase tracking-wider shadow-sm">
                      Le plus populaire
                    </div>
                  )}

                  <div>
                    <div className="mb-6">
                      <h4 className="text-2xl font-extrabold text-secondary mb-2">{plan.name}</h4>
                      <p className="text-sm text-text-muted">{plan.description}</p>
                    </div>

                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-secondary tracking-tight">
                        {price.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-base font-semibold text-text-muted">
                        {plan.currency} / mois
                      </span>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-text-main font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className={`w-full py-3.5 rounded-xl font-bold text-center block transition ${
                      isPopular
                        ? 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20'
                        : 'bg-secondary hover:bg-gray-800 text-white'
                    }`}
                  >
                    Démarrer avec {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FAQ SECTION ===================== */}
      <section id="faq" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">
              Foire aux questions
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-secondary">
              Questions fréquentes
            </h3>
            <p className="text-text-muted text-base mt-4">
              Retrouvez toutes les réponses sur le fonctionnement et la mise en place de MENUORA.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-gray-200/80 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-5 px-6 text-left flex justify-between items-center bg-white hover:bg-gray-50/80 transition"
                  >
                    <span className="font-bold text-secondary text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-text-muted leading-relaxed bg-white border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CTA BANNER ===================== */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Prêt à révolutionner l'expérience de vos clients ?
          </h3>
          <p className="text-white/90 text-base max-w-2xl mx-auto mb-8">
            Rejoignez les meilleurs restaurateurs en Algérie. Créez votre menu interactif en moins de 10 minutes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition"
          >
            <span>Créer mon menu maintenant</span>
            <ArrowRight className="w-5 h-5 text-primary" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

