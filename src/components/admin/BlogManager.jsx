import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import BlogEditor from './BlogEditor';

const BlogManager = () => {
  const { articles, deleteArticle } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  // Helper: Open Editor for New Article
  const handleAddNew = () => {
    setCurrentArticle(null);
    setIsEditing(true);
  };

  // Helper: Open Editor for Existing Article
  const handleEdit = (article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  // Helper: Handle Delete
  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this article?")) {
          await deleteArticle(id);
      }
  };

  // Close Editor Handler
  const handleClose = () => {
      setIsEditing(false);
      setCurrentArticle(null);
  };

  // Render List View
  if (!isEditing) {
      return (
          <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                  <div>
                      <h1 className="text-3xl font-bold text-gray-800 font-artistic">Blog Management</h1>
                      <p className="text-gray-500 mt-2">Create and edit articles using the BlockNote editor.</p>
                  </div>
                  <button
                      onClick={handleAddNew}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                      <Plus size={20} /> Create New Article
                  </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {articles.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">No articles found.</div>
                    ) : (
                        articles.map(article => (
                            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                        {article.cover_image ? (
                                            <img src={article.cover_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No IMG</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{article.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">{article.category}</span>
                                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(article)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
          </div>
      );
  }

  // Render Editor
  return <BlogEditor article={currentArticle} onClose={handleClose} />;
};

export default BlogManager;
