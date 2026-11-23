import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-secondary">
                MENU<span className="text-primary">ORA</span>
              </span>
              <span className="text-[10px] text-text-muted uppercase font-medium tracking-widest -mt-1">
                Digital Menu SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-muted hover:text-primary transition">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-text-muted hover:text-primary transition">
              Comment ça marche
            </a>
            <a href="#demo" className="text-sm font-medium text-text-muted hover:text-primary transition">
              Démonstration
            </a>
            <a href="#pricing" className="text-sm font-medium text-text-muted hover:text-primary transition">
              Tarifs
            </a>
            <a href="#faq" className="text-sm font-medium text-text-muted hover:text-primary transition">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary px-3 py-2 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Mon Dashboard</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-secondary hover:text-primary px-3 py-2 transition"
              >
                Connexion
              </Link>
            )}

            <Link
              to={user ? '/dashboard' : '/register'}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <span>Créer mon menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-secondary hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-text-main hover:text-primary px-2 py-1"
            >
              Fonctionnalités
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-text-main hover:text-primary px-2 py-1"
            >
              Comment ça marche
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-text-main hover:text-primary px-2 py-1"
            >
              Démonstration
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-text-main hover:text-primary px-2 py-1"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-text-main hover:text-primary px-2 py-1"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl text-secondary font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Mon Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center border border-gray-200 py-2.5 rounded-xl text-secondary font-semibold"
              >
                Connexion
              </Link>
            )}

            <Link
              to={user ? '/dashboard' : '/register'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20"
            >
              <span>Créer mon menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

