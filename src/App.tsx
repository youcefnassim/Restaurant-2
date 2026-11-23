import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { MenuPage } from './pages/public/MenuPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingWizardPage } from './pages/auth/OnboardingWizardPage';

// Dashboard pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { RestaurantSettingsPage } from './pages/dashboard/RestaurantSettingsPage';
import { CategoriesPage } from './pages/dashboard/CategoriesPage';
import { ProductsPage } from './pages/dashboard/ProductsPage';
import { MenuAppearancePage } from './pages/dashboard/MenuAppearancePage';
import { QrCodeStudioPage } from './pages/dashboard/QrCodeStudioPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { TeamPage } from './pages/dashboard/TeamPage';
import { SubscriptionPage } from './pages/dashboard/SubscriptionPage';
import { GeneralSettingsPage } from './pages/dashboard/GeneralSettingsPage';

// Super Admin
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { RoleSwitcherToolbar } from './components/common/RoleSwitcherToolbar';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Menus */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu/:slug" element={<MenuPage />} />

            {/* Authentication & Onboarding */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingWizardPage />} />

            {/* Restaurant Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="restaurant" element={<RestaurantSettingsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="appearance" element={<MenuAppearancePage />} />
              <Route path="qr-code" element={<QrCodeStudioPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="settings" element={<GeneralSettingsPage />} />
            </Route>

            {/* Super Admin */}
            <Route
              path="/admin"
              element={
                <div>
                  <RoleSwitcherToolbar />
                  <SuperAdminDashboard />
                </div>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
