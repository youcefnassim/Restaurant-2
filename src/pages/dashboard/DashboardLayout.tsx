import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';
import { RoleSwitcherToolbar } from '../../components/common/RoleSwitcherToolbar';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Vue générale',
  '/dashboard/restaurant': 'Gestion du restaurant',
  '/dashboard/categories': 'Gestion des catégories',
  '/dashboard/products': 'Gestion des produits & carte',
  '/dashboard/appearance': 'Personnalisation du menu',
  '/dashboard/qr-code': 'Studio QR Code & Impression',
  '/dashboard/analytics': 'Statistiques de consultation',
  '/dashboard/team': 'Membres de l’équipe',
  '/dashboard/subscription': 'Abonnement & Facturation',
  '/dashboard/settings': 'Paramètres généraux',
};

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] || 'Espace Restaurant';

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <RoleSwitcherToolbar />

      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

