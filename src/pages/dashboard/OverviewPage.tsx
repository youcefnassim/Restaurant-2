import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  UtensilsCrossed,
  Layers,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  QrCode,
  Plus,
  Palette,
  ExternalLink,
  Clock,
  Sparkles,
  Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { activeRestaurant } = useAuth();
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d'>('7d');

  if (!activeRestaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Aucun restaurant sélectionné.</p>
      </div>
    );
  }

  const products = dataService.getProducts(activeRestaurant.id);
  const categories = dataService.getCategories(activeRestaurant.id);
  const analytics = dataService.getAnalytics(activeRestaurant.id);

  const availableProducts = products.filter((p) => p.is_available).length;
  const unavailableProducts = products.filter((p) => !p.is_available).length;

  const chartData = chartPeriod === '7d' ? analytics.chartData7Days : analytics.chartData30Days;

  const recentActivities = [
    {
      icon: QrCode,
      color: 'text-primary bg-primary/10',
      title: 'Scan QR Code — Table 2',
      detail: 'Menu consulté sur smartphone Android',
      time: 'Il y a 3 minutes',
    },
    {
      icon: Eye,
      color: 'text-success bg-success/10',
      title: 'Plat consulté : Couscous Royal d\'Alger',
      detail: 'Portion individuelle & Harissa Berbère',
      time: 'Il y a 14 minutes',
    },
    {
      icon: UtensilsCrossed,
      color: 'text-blue-500 bg-blue-50',
      title: 'Disponibilité mise à jour',
      detail: 'Rechta Algéroise marquée comme disponible',
      time: 'Il y a 1 heure',
    },
    {
      icon: QrCode,
      color: 'text-primary bg-primary/10',
      title: 'Scan QR Code — Table 5',
      detail: 'Menu consulté sur iPhone Safari',
      time: 'Il y a 2 heures',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-gray-800 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de bord {activeRestaurant.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenue dans votre gestionnaire MENUORA
          </h2>
          <p className="text-gray-300 text-sm">
            Vos clients scannent et découvrent vos plats en direct. Toute modification effectuée ici est visible instantanément.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/dashboard/products"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-3 rounded-xl shadow-md shadow-primary/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau plat</span>
          </Link>
          <Link
            to={`/menu/${activeRestaurant.slug}`}
            target="_blank"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-xl border border-white/20 transition"
          >
            <ExternalLink className="w-4 h-4 text-primary" />
            <span>Voir mon menu en ligne</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Produits</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-secondary">{products.length}</span>
            <span className="text-xs font-bold text-text-muted">sur la carte</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs pt-3 border-t border-gray-100">
            <span className="text-success flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {availableProducts} dispo
            </span>
            {unavailableProducts > 0 && (
              <span className="text-danger flex items-center gap-1 font-semibold">
                <XCircle className="w-3.5 h-3.5" />
                {unavailableProducts} épuisé
              </span>
            )}
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Catégories</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-secondary">{categories.length}</span>
            <span className="text-xs font-bold text-text-muted">actives</span>
          </div>
          <div className="mt-3 text-xs text-text-muted pt-3 border-t border-gray-100 truncate">
            {categories.map((c) => c.name).slice(0, 2).join(', ')}...
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Scans & Vues</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-secondary">{analytics.totalViews.toLocaleString('fr-FR')}</span>
            <span className="text-xs font-semibold text-success flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
          <div className="mt-3 text-xs text-text-muted pt-3 border-t border-gray-100">
            Consultations du menu en ligne
          </div>
        </div>

        {/* Today Views */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Scans Aujourd’hui</span>
            <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-secondary">{analytics.todayViews}</span>
            <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              Actif en salle
            </span>
          </div>
          <div className="mt-3 text-xs text-text-muted pt-3 border-t border-gray-100">
            Moyenne de 22 scans / heure
          </div>
        </div>
      </div>

      {/* Analytics Chart & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-secondary">
                Consultations du menu ({chartPeriod === '7d' ? '7 derniers jours' : '30 derniers jours'})
              </h3>
              <p className="text-xs text-text-muted">Nombre de fois où vos clients ont ouvert votre menu digital.</p>
            </div>

            <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartPeriod('7d')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartPeriod === '7d' ? 'bg-white text-secondary shadow-xs font-bold' : 'text-gray-500'
                }`}
              >
                7 jours
              </button>
              <button
                onClick={() => setChartPeriod('30d')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartPeriod === '30d' ? 'bg-white text-secondary shadow-xs font-bold' : 'text-gray-500'
                }`}
              >
                30 jours
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E76F35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E76F35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#222222',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#E76F35' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Scans"
                  stroke="#E76F35"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider">
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/dashboard/products"
                className="p-3.5 rounded-2xl bg-bg hover:bg-primary/5 hover:border-primary/30 border border-gray-100 flex flex-col items-center text-center transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-secondary">Ajouter un plat</span>
              </Link>

              <Link
                to="/dashboard/appearance"
                className="p-3.5 rounded-2xl bg-bg hover:bg-primary/5 hover:border-primary/30 border border-gray-100 flex flex-col items-center text-center transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-secondary">Personnaliser</span>
              </Link>

              <Link
                to="/dashboard/qr-code"
                className="p-3.5 rounded-2xl bg-bg hover:bg-primary/5 hover:border-primary/30 border border-gray-100 flex flex-col items-center text-center transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-secondary">Télécharger QR</span>
              </Link>

              <Link
                to="/dashboard/restaurant"
                className="p-3.5 rounded-2xl bg-bg hover:bg-primary/5 hover:border-primary/30 border border-gray-100 flex flex-col items-center text-center transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-secondary">Horaires & Infos</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider">
              Activité récente
            </h3>
            <div className="space-y-3.5">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                    <act.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-secondary truncate">{act.title}</div>
                    <div className="text-text-muted truncate">{act.detail}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
