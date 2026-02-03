import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Edit2, FileText, Image as ImageIcon, X } from 'lucide-react';

const BlogManager = () => {
  const { articles, addArticle, deleteArticle, uploadFile } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    image: '',
    readTime: '5 min read',
    author: 'Admin',
    pdfUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
          setUploading(true);
          const data = await uploadFile(file);
          setNewArticle(prev => ({ ...prev, pdfUrl: data.url }));
      } catch (error) {
          console.error("Upload error:", error);
          alert('Upload failed');
      } finally {
          setUploading(false);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!newArticle.title || !newArticle.category) return;

    // Fallback image if empty
    const finalArticle = {
        ...newArticle,
        image: newArticle.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        content: newArticle.content || `<p>${newArticle.excerpt}</p>`
    };

    addArticle(finalArticle);
    setIsModalOpen(false);
    setNewArticle({
        title: '',
        category: '',
        excerpt: '',
        content: '',
        image: '',
        readTime: '5 min read',
        author: 'Admin',
        pdfUrl: ''
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 font-artistic">Blog & Article Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all"
        >
          <Plus size={18} /> Add New Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">PDF</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No articles found.</td></tr>
            ) : (
                articles.map(article => (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                <img src={article.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{article.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-600">
                          {article.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{article.date}</td>
                      <td className="p-4">
                          {article.pdfUrl ? <span className="text-green-500 font-bold text-xs">Yes</span> : <span className="text-gray-400 text-xs">No</span>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteArticle(article.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">New Article</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Title</label>
                  <input required name="title" value={newArticle.title} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter title..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Category</label>
                  <input required name="category" value={newArticle.category} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Regulations" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Excerpt</label>
                <textarea required name="excerpt" value={newArticle.excerpt} onChange={handleChange} rows="3" className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief summary..."></textarea>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-600">Cover Image URL</label>
                 <div className="flex gap-2">
                    <input name="image" value={newArticle.image} onChange={handleChange} className="flex-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                    <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                        {newArticle.image ? <img src={newArticle.image} className="w-full h-full object-cover rounded" /> : <ImageIcon size={20} />}
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Article PDF (Upload)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input type="file" accept="application/pdf" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <FileText className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                          {uploading ? "Uploading..." : (newArticle.pdfUrl ? <span className="text-green-600 font-bold">PDF Uploaded!</span> : "Click to upload PDF")}
                      </p>
                  </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
