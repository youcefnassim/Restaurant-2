import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Store, UserCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoleSwitcherToolbar: React.FC = () => {
  const { user, activeRestaurant, switchUserRole } = useAuth();

  return (
    <div className="bg-secondary text-white text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-white/10 z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block"></span>
          MENUORA DEMO BAR:
        </span>
        <span className="text-gray-300 hidden sm:inline">Connecté en tant que:</span>
        <span className="font-medium bg-white/10 px-2 py-0.5 rounded text-white flex items-center gap-1">
          {user?.role === 'super_admin' && <Shield className="w-3 h-3 text-amber-400" />}
          {user?.role === 'restaurant_owner' && <Store className="w-3 h-3 text-primary" />}
          {user?.role === 'restaurant_staff' && <UserCheck className="w-3 h-3 text-blue-400" />}
          {user?.full_name} ({user?.role})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-400 hidden md:inline">Tester un autre rôle :</span>
        <button
          onClick={() => switchUserRole('restaurant_owner')}
          className={`px-2 py-0.5 rounded transition ${
            user?.role === 'restaurant_owner'
              ? 'bg-primary text-white font-semibold'
              : 'bg-white/10 hover:bg-white/20 text-gray-200'
          }`}
          title="Propriétaire de restaurant (Dar El Bey)"
        >
          Propriétaire
        </button>
        <button
          onClick={() => switchUserRole('super_admin')}
          className={`px-2 py-0.5 rounded transition ${
            user?.role === 'super_admin'
              ? 'bg-amber-500 text-secondary font-semibold'
              : 'bg-white/10 hover:bg-white/20 text-gray-200'
          }`}
          title="Super Administrateur de la plateforme"
        >
          Super Admin
        </button>
        <button
          onClick={() => switchUserRole('restaurant_staff')}
          className={`px-2 py-0.5 rounded transition ${
            user?.role === 'restaurant_staff'
              ? 'bg-blue-500 text-white font-semibold'
              : 'bg-white/10 hover:bg-white/20 text-gray-200'
          }`}
          title="Serveur / Équipe"
        >
          Équipe
        </button>

        {activeRestaurant && (
          <Link
            to={`/menu/${activeRestaurant.slug}`}
            target="_blank"
            className="ml-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-2.5 py-0.5 rounded flex items-center gap-1 font-medium transition"
          >
            <span>Voir Menu Public</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};

