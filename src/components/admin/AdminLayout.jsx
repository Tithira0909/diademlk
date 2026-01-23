import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MessageSquare, Users,
  Settings, LogOut, Sun, Moon
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminLayout = () => {
  const { logout, currentUser } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Blogs & Articles', path: '/admin/blogs' },
    { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
           <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded">D</div>
           <span className="font-artistic font-bold text-xl tracking-widest">DIADEM</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
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
               <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                   {currentUser.username[0].toUpperCase()}
               </div>
               <div>
                   <p className="text-sm font-bold">{currentUser.username}</p>
                   <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
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
