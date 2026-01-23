import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useData();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 font-body p-6">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-artistic font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-zinc-500 text-sm">Sign in to manage the Diadem platform</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors"
                    placeholder="admin"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors"
                    placeholder="password"
                />
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-4">
                Sign In
            </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-600">
            Protected by Diadem Security Systems
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
