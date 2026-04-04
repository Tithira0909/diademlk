import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MessageSquare, Users, Image,
  Settings, LogOut, Sun, Moon
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminLayout = () => {
  const { logout, currentUser, loading } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', roles: ['admin', 'editor'] },
    { icon: Image, label: 'Hero Banners', path: '/admin/banners', roles: ['admin', 'editor'] },
    { icon: FileText, label: 'Blogs & Articles', path: '/admin/blogs', roles: ['admin', 'editor'] },
    { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries', roles: ['admin', 'editor'] },
    { icon: Users, label: 'User Management', path: '/admin/users', roles: ['admin'] },
    { icon: Settings, label: 'Settings', path: '/admin/settings', roles: ['admin'] },
  ];

  // Auth Guard
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login', { state: { from: location } });
    }
  }, [currentUser, loading, navigate, location]);

  // Auto-logout on inactivity (15 minutes)
  useEffect(() => {
    if (!currentUser) return; // Don't run timer if not logged in

    let lastActivity = Date.now();
    let activityInterval;

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const checkActivity = () => {
      if (Date.now() - lastActivity > 15 * 60 * 1000) { // 15 mins
        console.log("Auto-logging out due to inactivity");
        handleLogout();
      }
    };

    // Only start interval if user is logged in
    activityInterval = setInterval(checkActivity, 60000); // Check every minute

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      if (activityInterval) clearInterval(activityInterval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, [currentUser, logout, navigate]); // Added currentUser to dependency to reset timer on login

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-start">
           <img src="/logo-white.png" alt="Diadem" className="h-12 w-auto object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.filter(item => item.roles.includes(currentUser.role)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
           <div className="flex items-center gap-3 mb-4 px-4">
               {currentUser.image_url ? (
                   <img src={currentUser.image_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
               ) : (
                   <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                       {currentUser.first_name ? currentUser.first_name[0].toUpperCase() : currentUser.username[0].toUpperCase()}
                   </div>
               )}
               <div>
                   <p className="text-sm font-bold">{currentUser.first_name || currentUser.username}</p>
                   <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{currentUser.role}</p>
               </div>
           </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
