import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Restaurant, SubscriptionPlan, UserProfile } from '../../types';
import {
  Shield,
  Store,
  Users,
  Eye,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit,
  Save,
  Plus,
  AlertCircle,
  TrendingUp,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState<Restaurant[]>(dataService.getRestaurants());
  const [plans, setPlans] = useState<SubscriptionPlan[]>(dataService.getPlans());
  const [users, setUsers] = useState<UserProfile[]>(dataService.getUsers());

  const [activeTab, setActiveTab] = useState<'restaurants' | 'plans' | 'users'>('restaurants');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing plan modal
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planMonthly, setPlanMonthly] = useState('');
  const [planYearly, setPlanYearly] = useState('');

  const stats = dataService.getSuperAdminStats();

  const refreshData = () => {
    setRestaurants(dataService.getRestaurants());
    setPlans(dataService.getPlans());
    setUsers(dataService.getUsers());
  };

  const handleToggleStatus = (restaurant: Restaurant) => {
    const newStatus = restaurant.status === 'active' ? 'suspended' : 'active';
    dataService.updateRestaurant(restaurant.id, { status: newStatus });
    refreshData();
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanMonthly(plan.price_monthly.toString());
    setPlanYearly(plan.price_yearly.toString());
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    dataService.updatePlan(editingPlan.id, {
      price_monthly: parseFloat(planMonthly) || editingPlan.price_monthly,
      price_yearly: parseFloat(planYearly) || editingPlan.price_yearly,
    });
    setEditingPlan(null);
    refreshData();
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-danger flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-secondary">Accès Restreint</h2>
        <p className="text-sm text-text-muted mt-2 max-w-sm">
          Cet espace est réservé exclusivement au Super Administrateur de la plateforme MENUORA.
        </p>
        <p className="text-xs text-text-muted mt-1">
          Vous pouvez utiliser la barre démo en haut pour basculer sur le compte Super Admin.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
        >
          <span>Retour à mon dashboard restaurant</span>
        </Link>
      </div>
    );
  }

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-secondary to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Console Super Administrateur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestion Globale MENUORA
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            Supervisez tous les restaurants abonnés, modifiez la grille tarifaire en Dinars et gérez les utilisateurs de la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition"
          >
            <span>Espace Restaurant</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Total Restaurants</span>
            <Store className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-secondary">{stats.totalRestaurants}</div>
          <div className="text-[11px] text-success font-semibold mt-1">
            {stats.activeRestaurants} actifs • {stats.suspendedRestaurants} suspendus
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Comptes Utilisateurs</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-secondary">{stats.totalUsers}</div>
          <div className="text-[11px] text-text-muted mt-1">Gérants et serveurs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Scans Totaux</span>
            <Eye className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-secondary">
            {stats.totalViews.toLocaleString('fr-FR')}
          </div>
          <div className="text-[11px] text-success font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Croissance continue</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Abonnements Actifs</span>
            <CreditCard className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-black text-secondary">{stats.activeSubscriptions}</div>
          <div className="text-[11px] text-success font-semibold mt-1">100% à jour</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase">Devise Principale</span>
            <span className="text-xs font-bold text-primary">DZD</span>
          </div>
          <div className="text-2xl font-black text-secondary">Dinars</div>
          <div className="text-[11px] text-text-muted mt-1">Algérie</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
            activeTab === 'restaurants'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-secondary'
          }`}
        >
          Tous les Restaurants ({restaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
            activeTab === 'plans'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-secondary'
          }`}
        >
          Grille Tarifaire SaaS ({plans.length} formules)
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-secondary'
          }`}
        >
          Comptes & Utilisateurs ({users.length})
        </button>
      </div>

      {/* TAB 1: RESTAURANTS DIRECTORY */}
      {activeTab === 'restaurants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, slug, ville..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg text-text-muted uppercase tracking-wider font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-5">Restaurant</th>
                    <th className="py-3.5 px-4">URL / Slug</th>
                    <th className="py-3.5 px-4">Localisation & Tel</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4">Tables</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRestaurants.map((rest) => (
                    <tr key={rest.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.logo_url}
                            alt={rest.name}
                            className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-extrabold text-secondary block">{rest.name}</span>
                            <span className="text-[10px] text-gray-400">ID: {rest.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-text-muted">
                        <Link
                          to={`/menu/${rest.slug}`}
                          target="_blank"
                          className="hover:text-primary flex items-center gap-1 font-semibold"
                        >
                          <span>/menu/{rest.slug}</span>
                          <ExternalLink className="w-3 h-3 text-primary" />
                        </Link>
                      </td>

                      <td className="py-4 px-4 text-text-muted">
                        <div>{rest.address}</div>
                        <div className="font-medium text-gray-700">{rest.phone}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rest.status === 'active'
                              ? 'bg-success/10 text-success'
                              : 'bg-red-100 text-danger'
                          }`}
                        >
                          {rest.status === 'active' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Actif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Suspendu</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-secondary">
                        {rest.table_count || 15} tables
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleToggleStatus(rest)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                            rest.status === 'active'
                              ? 'bg-red-50 text-danger hover:bg-red-100'
                              : 'bg-success/10 text-success hover:bg-success/20'
                          }`}
                        >
                          {rest.status === 'active' ? 'Suspendre' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANS & PRICING MANAGEMENT */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-secondary">
              Gestion des offres d'abonnement (DZD)
            </h3>
            <p className="text-xs text-text-muted">
              Modifiez les tarifs mensuels et annuels sans toucher au code. Les prix changent instantanément sur la landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-extrabold text-lg text-secondary">{p.name}</h4>
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {p.slug}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-4">{p.description}</p>

                  <div className="p-4 bg-bg rounded-2xl space-y-2 border border-gray-100 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-500">Prix mensuel :</span>
                      <span className="font-black text-secondary">
                        {p.price_monthly.toLocaleString('fr-FR')} {p.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-500">Prix annuel :</span>
                      <span className="font-black text-primary">
                        {p.price_yearly.toLocaleString('fr-FR')} {p.currency}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-text-muted">
                    <div className="font-bold text-secondary mb-1">Limites configurées :</div>
                    <div>• Max produits : {p.max_products}</div>
                    <div>• Max catégories : {p.max_categories}</div>
                    <div>• Max QR Codes : {p.max_qr_codes}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditPlan(p)}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 bg-secondary hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Modifier les tarifs</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                  <h3 className="font-extrabold text-base text-secondary">
                    Modifier les tarifs — Forfait {editingPlan.name}
                  </h3>
                  <button onClick={() => setEditingPlan(null)} className="p-1 text-gray-400 hover:text-secondary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                      Prix Mensuel (DZD)
                    </label>
                    <input
                      type="number"
                      required
                      value={planMonthly}
                      onChange={(e) => setPlanMonthly(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                      Prix Annuel (DZD)
                    </label>
                    <input
                      type="number"
                      required
                      value={planYearly}
                      onChange={(e) => setPlanYearly(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLATFORM USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg text-text-muted uppercase tracking-wider font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Utilisateur</th>
                  <th className="py-3.5 px-4">Adresse E-mail</th>
                  <th className="py-3.5 px-4">Rôle</th>
                  <th className="py-3.5 px-4">Téléphone</th>
                  <th className="py-3.5 px-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={u.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <span className="font-extrabold text-secondary">{u.full_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-gray-600">{u.email}</td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'super_admin'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'restaurant_owner'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-text-muted">{u.phone || '—'}</td>

                    <td className="py-4 px-4 text-text-muted">
                      {new Date(u.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

