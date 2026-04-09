import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

// Eager Loading for critical paths (Home, Login)
import WebsiteLayout from './components/website/WebsiteLayout';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';

// Lazy Loading for heavy components
const ArticleViewer = lazy(() => import('./pages/ArticleViewer'));
const DashboardOverview = lazy(() => import('./components/admin/DashboardOverview'));
const BannerManager = lazy(() => import('./components/admin/BannerManager'));
const BlogManager = lazy(() => import('./components/admin/BlogManager')); // Heavy (BlockNote)
const InquiryManager = lazy(() => import('./components/admin/InquiryManager'));
const UserManagement = lazy(() => import('./components/admin/UserManagement'));
const Settings = lazy(() => import('./components/admin/Settings'));

// Loading Fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Preloader = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 1500); // Show preloader for 1.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <img src="/logo-black.png" alt="Diadem Loading..." className="h-16 animate-pulse" />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = React.useState(true);

  return (
    <DataProvider>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<WebsiteLayout />} />
            <Route path="/article/:id" element={<ArticleViewer />} />
            <Route path="/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Navigate to="dashboard" replace />} />
               <Route path="dashboard" element={<DashboardOverview />} />
               <Route path="banners" element={<BannerManager />} />
               <Route path="blogs" element={<BlogManager />} />
               <Route path="inquiries" element={<InquiryManager />} />
               <Route path="users" element={<UserManagement />} />
               <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </DataProvider>
  );
};

export default App;
