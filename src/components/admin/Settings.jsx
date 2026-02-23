import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Save, Facebook, Instagram, Linkedin, Youtube, Video } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState({
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    tiktok_url: '',
    youtube_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        tiktok_url: settings.tiktok_url || '',
        youtube_url: settings.youtube_url || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const success = await updateSettings(formData);
    if (success) {
      setMessage('Settings updated successfully!');
    } else {
      setMessage('Failed to update settings.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold font-artistic">Site Settings</h1>
           <p className="text-gray-500">Manage global website configurations and social links.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
             Social Media Links
         </h2>

         {message && (
             <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {message}
             </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
             {/* Facebook */}
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <Facebook size={16} className="text-blue-600" /> Facebook URL
                 </label>
                 <input
                     type="url"
                     name="facebook_url"
                     value={formData.facebook_url}
                     onChange={handleChange}
                     placeholder="https://facebook.com/yourpage"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
             </div>

             {/* Instagram */}
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <Instagram size={16} className="text-pink-600" /> Instagram URL
                 </label>
                 <input
                     type="url"
                     name="instagram_url"
                     value={formData.instagram_url}
                     onChange={handleChange}
                     placeholder="https://instagram.com/yourpage"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
             </div>

             {/* LinkedIn */}
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <Linkedin size={16} className="text-blue-700" /> LinkedIn URL
                 </label>
                 <input
                     type="url"
                     name="linkedin_url"
                     value={formData.linkedin_url}
                     onChange={handleChange}
                     placeholder="https://linkedin.com/company/yourpage"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
             </div>

             {/* TikTok */}
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <Video size={16} className="text-black" /> TikTok URL
                 </label>
                 <input
                     type="url"
                     name="tiktok_url"
                     value={formData.tiktok_url}
                     onChange={handleChange}
                     placeholder="https://tiktok.com/@yourpage"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
             </div>

             {/* YouTube */}
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <Youtube size={16} className="text-red-600" /> YouTube URL
                 </label>
                 <input
                     type="url"
                     name="youtube_url"
                     value={formData.youtube_url}
                     onChange={handleChange}
                     placeholder="https://youtube.com/@channel"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
             </div>

             <div className="pt-4 border-t border-gray-200">
                 <button
                     type="submit"
                     disabled={loading}
                     className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                 >
                     <Save size={20} />
                     {loading ? 'Saving...' : 'Save Settings'}
                 </button>
             </div>
         </form>
      </div>
    </div>
  );
};

export default Settings;
