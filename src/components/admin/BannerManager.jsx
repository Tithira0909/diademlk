import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';

const BannerManager = () => {
  const { banners, addBanner, deleteBanner, uploadFile } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    imageUrl: '',
    link: '',
    list_order: 0
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
          setUploading(true);
          const data = await uploadFile(file);
          setNewBanner(prev => ({ ...prev, imageUrl: data.url }));
      } catch (error) {
          console.error("Upload error:", error);
          alert('Upload failed');
      } finally {
          setUploading(false);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!newBanner.imageUrl) return alert('Image is required');

    const bannerToSave = {
        ...newBanner,
        list_order: parseInt(newBanner.list_order) || 0
    };

    const success = await addBanner(bannerToSave);
    if (success) {
        setIsModalOpen(false);
        setNewBanner({
            title: '',
            imageUrl: '',
            link: '',
            list_order: 0
        });
    } else {
        alert('Failed to add banner');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 font-artistic">Hero Banners</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">No banners found. Add one to get started.</p>
            </div>
        ) : (
            banners.map(banner => (
                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                            Order: {banner.list_order}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{banner.title || "Untitled"}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 line-clamp-1">
                            <LinkIcon size={14} />
                            <span className="truncate">{banner.link || "No Link"}</span>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button
                                onClick={() => deleteBanner(banner.id)}
                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">New Banner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-600">Banner Image</label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {newBanner.imageUrl ? (
                          <img src={newBanner.imageUrl} className="max-h-32 mx-auto rounded shadow-sm" />
                      ) : (
                          <>
                            <ImageIcon className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{uploading ? "Uploading..." : "Click to upload image"}</p>
                          </>
                      )}
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Title / Caption (Optional)</label>
                <input name="title" value={newBanner.title} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter title..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Link URL (Optional)</label>
                <input name="link" value={newBanner.link} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Display Order</label>
                <input type="number" name="list_order" value={newBanner.list_order} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">Add Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
