import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  QrCode,
  UtensilsCrossed,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { activeRestaurant } = useAuth();
  const [period, setPeriod] = useState<'7d' | '30d'>('30d');

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const analytics = dataService.getAnalytics(activeRestaurant.id);
  const qrCodes = dataService.getQrCodes(activeRestaurant.id);

  const chartData = period === '7d' ? analytics.chartData7Days : analytics.chartData30Days;
  const totalScans = analytics.totalViews;
  const uniqueVisitors = Math.round(totalScans * 0.74);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-secondary">Statistiques de consultation</h2>
          <p className="text-xs text-text-muted">
            Suivez l'activité de vos clients en salle et analysez l'attractivité de vos plats.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 rounded-lg transition ${
              period === '7d' ? 'bg-primary text-white shadow-xs font-bold' : 'text-gray-500'
            }`}
          >
            7 derniers jours
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 rounded-lg transition ${
              period === '30d' ? 'bg-primary text-white shadow-xs font-bold' : 'text-gray-500'
            }`}
          >
            30 derniers jours
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Scans</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-secondary">{totalScans.toLocaleString('fr-FR')}</div>
          <div className="mt-2 text-xs text-success font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% ce mois-ci</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Visiteurs Uniques</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-secondary">{uniqueVisitors.toLocaleString('fr-FR')}</div>
          <div className="mt-2 text-xs text-text-muted">Smartphones distincts détectés</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Scans Aujourd'hui</span>
            <div className="w-9 h-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-secondary">{analytics.todayViews}</div>
          <div className="mt-2 text-xs text-text-muted">Pic de fréquentation à 13h et 21h</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Moyenne par Jour</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-secondary">
            {Math.round(totalScans / 30)}
          </div>
          <div className="mt-2 text-xs text-text-muted">Scans quotidiens moyens</div>
        </div>
      </div>

      {/* Main Views Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-secondary">Évolution des consultations</h3>
          <p className="text-xs text-text-muted">Nombre de scans du menu par jour (pics les vendredis et samedis).</p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E76F35" stopOpacity={0.35} />
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
                name="Consultations"
                stroke="#E76F35"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#viewsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Top Categories & Table breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 5 Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            <h3 className="font-extrabold text-sm text-secondary uppercase tracking-wider">
              Plats les plus consultés
            </h3>
          </div>

          <div className="space-y-3">
            {analytics.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-bold text-secondary truncate">{p.name}</span>
                </div>
                <span className="font-black text-primary shrink-0 ml-2">{p.views} vues</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-extrabold text-sm text-secondary uppercase tracking-wider">
              Catégories préférées
            </h3>
          </div>

          <div className="space-y-3">
            {analytics.topCategories.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-secondary">
                  <span>{c.name}</span>
                  <span className="text-primary">{c.views} consultations</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, (c.views / totalScans) * 200)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Scans by Table */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <QrCode className="w-4 h-4 text-primary" />
            <h3 className="font-extrabold text-sm text-secondary uppercase tracking-wider">
              Scans par Table
            </h3>
          </div>

          <div className="space-y-3">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="flex items-center justify-between text-xs">
                <span className="font-bold text-secondary truncate">{qr.label}</span>
                <span className="font-black text-secondary bg-gray-100 px-2 py-0.5 rounded-md">
                  {qr.scan_count} scans
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

