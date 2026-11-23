import React from 'react';
import { Menu, ExternalLink, QrCode, Store, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { activeRestaurant } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-secondary hover:bg-gray-100 transition"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-secondary tracking-tight">
            {title}
          </h1>
          {activeRestaurant && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{activeRestaurant.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-success font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>En ligne ({activeRestaurant.currency})</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activeRestaurant && (
          <>
            <Link
              to="/dashboard/qr-code"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-secondary bg-gray-100 hover:bg-gray-200/80 px-3 py-2 rounded-xl transition"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span>Générateur QR</span>
            </Link>

            <Link
              to={`/menu/${activeRestaurant.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3.5 py-2 rounded-xl shadow-sm shadow-primary/20 transition"
            >
              <span>Voir mon menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

