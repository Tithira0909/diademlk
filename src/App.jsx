import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

import WebsiteLayout from './components/website/WebsiteLayout';
import ArticleViewer from './pages/ArticleViewer';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './components/admin/DashboardOverview';
import BannerManager from './components/admin/BannerManager';
import BlogManager from './components/admin/BlogManager';
import InquiryManager from './components/admin/InquiryManager';
import UserManagement from './components/admin/UserManagement';

const App = () => {
  return (
    <DataProvider>
      <Router>
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
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
