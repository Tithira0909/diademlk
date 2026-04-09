import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Trash2, UserPlus, Shield, User, Image as ImageIcon } from 'lucide-react';

const UserManagement = () => {
  const { users, addUser, deleteUser, uploadFile } = useData();
  const [newUser, setNewUser] = useState({ username: '', email: '', first_name: '', password: '', role: 'editor' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUser.username && newUser.password && newUser.email) {
      let imageUrl = '';
      if (imageFile) {
          try {
              const res = await uploadFile(imageFile);
              imageUrl = res.url;
          } catch (e) {
              alert("Image upload failed");
              return;
          }
      }

      await addUser({ ...newUser, image_url: imageUrl });
      setNewUser({ username: '', email: '', first_name: '', password: '', role: 'editor' });
      setImageFile(null);
      setImagePreview('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-800 font-artistic">User Management</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><UserPlus size={20}/> Create Account</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.first_name}
                            onChange={e => setNewUser({...newUser, first_name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.username}
                            onChange={e => setNewUser({...newUser, username: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile Image</label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border">
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                                </div>
                            )}
                            <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                                <ImageIcon size={16} /> Choose Image
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                            </label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                        <select
                            className="w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.role}
                            onChange={e => setNewUser({...newUser, role: e.target.value})}
                        >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Create Account
                    </button>
                </form>
            </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2 grid gap-4 content-start">
             {users.map(user => (
                 <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         {user.image_url ? (
                             <img src={user.image_url} alt={user.username} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                         ) : (
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                 {user.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                             </div>
                         )}
                         <div>
                             <h4 className="font-bold text-gray-800">{user.first_name || user.username}</h4>
                             <p className="text-xs text-gray-500">{user.email}</p>
                             <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">{user.role}</span>
                         </div>
                     </div>
                     <button
                        onClick={() => deleteUser(user.id)}
                        disabled={user.username === 'admin'}
                        className={`p-2 rounded-lg transition-colors ${user.username === 'admin' ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:bg-red-50 hover:text-red-600'}`}
                     >
                         <Trash2 size={18} />
                     </button>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
