import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Layers,
  UtensilsCrossed,
  Palette,
  QrCode,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Shield,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, activeRestaurant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Vue générale', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mon restaurant', path: '/dashboard/restaurant', icon: Store },
    { name: 'Catégories', path: '/dashboard/categories', icon: Layers },
    { name: 'Produits', path: '/dashboard/products', icon: UtensilsCrossed },
    { name: 'Apparence du menu', path: '/dashboard/appearance', icon: Palette },
    { name: 'Studio QR Code', path: '/dashboard/qr-code', icon: QrCode },
    { name: 'Statistiques', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Équipe', path: '/dashboard/team', icon: Users },
    { name: 'Abonnement', path: '/dashboard/subscription', icon: CreditCard },
    { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Close button on mobile */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-secondary">
                  MENU<span className="text-primary">ORA</span>
                </span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider -mt-1">
                  Espace Restaurant
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant switcher banner */}
          {activeRestaurant && (
            <div className="px-4 py-3 mx-4 my-3 bg-bg rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Restaurant Actif
                </span>
                <span className="w-2 h-2 rounded-full bg-success"></span>
              </div>
              <div className="font-bold text-xs text-secondary truncate">{activeRestaurant.name}</div>
              <Link
                to={`/menu/${activeRestaurant.slug}`}
                target="_blank"
                className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Voir mon menu</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'text-text-muted hover:text-secondary hover:bg-gray-100/70'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            {/* Super Admin section if user has super admin role */}
            {user?.role === 'super_admin' && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <span className="block px-3 text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Administration Globale
                </span>
                <NavLink
                  to="/admin"
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`
                  }
                >
                  <Shield className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Espace Super Admin</span>
                </NavLink>
              </div>
            )}
          </nav>

          {/* User profile footer */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-secondary truncate">{user?.full_name}</div>
                  <div className="text-[10px] text-text-muted capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Déconnexion"
                className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

