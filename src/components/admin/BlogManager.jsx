import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Check } from 'lucide-react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const BlogManager = () => {
  const { articles, addArticle, updateArticle, deleteArticle, uploadFile } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [initialContent, setInitialContent] = useState(undefined);

  // Initialize BlockNote editor
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: async (file) => {
       try {
           const result = await uploadFile(file);
           return result.url;
       } catch(e) {
           console.error("Image upload failed", e);
           return "https://via.placeholder.com/150"; // Fallback
       }
    }
  });

  // Effect to handle initial content loading when editing
  useEffect(() => {
    if (initialContent && editor) {
        async function loadContent() {
             try {
                 const jsonContent = JSON.parse(initialContent);
                 // Clear existing blocks first to avoid duplication or conflicts
                 editor.removeBlocks(editor.document);
                 editor.replaceBlocks(editor.document, jsonContent);
             } catch(e) {
                 console.error("Failed to parse/load article content", e);
             }
        }
        loadContent();
    }
  }, [initialContent, editor]);


  // Helper: Open Editor for New Article
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentArticle(null);
    setTitle('');
    setSlug('');
    setCategory('');
    setExcerpt('');
    setCoverImage(null);
    setCoverImagePreview(null);
    setInitialContent(undefined);
    if(editor) {
        editor.removeBlocks(editor.document);
    }
  };

  // Helper: Open Editor for Existing Article
  const handleEdit = (article) => {
    setIsEditing(true);
    setCurrentArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setCategory(article.category);
    setExcerpt(article.excerpt);
    setCoverImagePreview(article.cover_image);
    setInitialContent(article.content); // This triggers the useEffect
  };

  // Helper: Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get content from BlockNote
    // Use editor.document directly, which returns the array of blocks
    const content = JSON.stringify(editor.document);

    // Upload Cover Image if changed
    let coverImageUrl = coverImagePreview;
    if (coverImage) {
        try {
            const uploadRes = await uploadFile(coverImage);
            coverImageUrl = uploadRes.url;
        } catch (e) {
             console.error("Cover image upload failed", e);
             alert("Cover image upload failed. Saving without new image.");
        }
    }

    const articleData = {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        category,
        excerpt,
        cover_image: coverImageUrl,
        content: content,
        published_at: currentArticle ? currentArticle.published_at : new Date().toISOString()
    };

    let success;
    if (currentArticle) {
        success = await updateArticle(currentArticle.id, articleData);
    } else {
        success = await addArticle(articleData);
    }

    if (success) {
        setIsEditing(false);
        // Reset form is handled by handleAddNew/handleEdit
    } else {
        alert("Failed to save article.");
    }
  };

  // Helper: Handle Delete
  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this article?")) {
          await deleteArticle(id);
      }
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

  // Render Editor View
  return (
      <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{currentArticle ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
              {/* Metadata Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                          <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                          <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              placeholder="auto-generated-if-empty"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                          <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                              required
                          >
                              <option value="">Select Category...</option>
                              <option value="Technology">Technology</option>
                              <option value="Trade">Trade</option>
                              <option value="Economy">Economy</option>
                              <option value="Logistics">Logistics</option>
                              <option value="News">News</option>
                          </select>
                      </div>
                  </div>

                  <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt (Summary)</label>
                          <textarea
                              value={excerpt}
                              onChange={(e) => setExcerpt(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
                          <div className="flex items-center gap-4">
                              {coverImagePreview && (
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                                      <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                              )}
                              <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                  <ImageIcon size={16} /> Choose File
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if(file) {
                                          setCoverImage(file);
                                          setCoverImagePreview(URL.createObjectURL(file));
                                      }
                                  }} />
                              </label>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Editor Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Content Editor</span>
                  </div>
                  <div className="p-4 flex-grow">
                     <BlockNoteView editor={editor} theme={"light"} />
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                      Cancel
                  </button>
                  <button
                      type="submit"
                      className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                      <Save size={20} /> Save Article
                  </button>
              </div>
          </form>
      </div>
  );
};

export default BlogManager;
