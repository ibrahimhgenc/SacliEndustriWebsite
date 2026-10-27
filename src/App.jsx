import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';

const BlogPost = lazy(() => import('./components/BlogPost'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./components/TermsOfUse'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const [showCatalog, setShowCatalog] = useState(false);

  return (
    <LanguageProvider>
      <Router>
        <div className="font-sans text-gray-900 bg-gray-50">
          <Navbar />
          <Suspense
            fallback={
              <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<MainLayout showCatalog={showCatalog} setShowCatalog={setShowCatalog} />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
              <Route path="/kullanim-sartlari" element={<TermsOfUse />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
