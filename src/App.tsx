import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { CollegesPage } from './pages/CollegesPage';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ComparePage } from './pages/ComparePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Tenant Pages
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { SavedStaysPage } from './pages/tenant/SavedStaysPage';
import { TenantEnquiriesPage } from './pages/tenant/TenantEnquiriesPage';
import { TenantVisitsPage } from './pages/tenant/TenantVisitsPage';

// Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerPropertiesPage } from './pages/owner/OwnerPropertiesPage';
import { OwnerNewPropertyPage } from './pages/owner/OwnerNewPropertyPage';
import { OwnerEditPropertyPage } from './pages/owner/OwnerEditPropertyPage';
import { OwnerEnquiriesPage } from './pages/owner/OwnerEnquiriesPage';
import { OwnerVisitsPage } from './pages/owner/OwnerVisitsPage';
import { OwnerAnalyticsPage } from './pages/owner/OwnerAnalyticsPage';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PropertyProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-[#0A0A0B] text-slate-100 selection:bg-amber-500 selection:text-black">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Discovery Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/colleges" element={<CollegesPage />} />
                  <Route path="/colleges/:id" element={<CollegeDetailPage />} />
                  <Route path="/property/:id" element={<PropertyDetailPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Student / Tenant Portal */}
                  <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                  <Route path="/tenant/saved" element={<SavedStaysPage />} />
                  <Route path="/tenant/enquiries" element={<TenantEnquiriesPage />} />
                  <Route path="/tenant/visits" element={<TenantVisitsPage />} />
                  <Route path="/tenant/compare" element={<ComparePage />} />

                  {/* PG Owner Portal */}
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                  <Route path="/owner/properties" element={<OwnerPropertiesPage />} />
                  <Route path="/owner/properties/new" element={<OwnerNewPropertyPage />} />
                  <Route path="/owner/properties/:id/edit" element={<OwnerEditPropertyPage />} />
                  <Route path="/owner/enquiries" element={<OwnerEnquiriesPage />} />
                  <Route path="/owner/visits" element={<OwnerVisitsPage />} />
                  <Route path="/owner/analytics" element={<OwnerAnalyticsPage />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </PropertyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
