import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Facebook, Instagram, Linkedin, Youtube, Video } from 'lucide-react';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const ArticleViewer = () => {
  const { id } = useParams(); // 'id' will be the SLUG
  const { articles, settings, loading: contextLoading } = useData();
  const [article, setArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Read-Only Editor
  const editor = useCreateBlockNote();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!contextLoading && articles.length > 0) {
        const found = articles.find(a => a.slug === id);
        if (found) {
            setArticle(found);
            try {
                // If content is stored as JSON string, parse it
                const content = typeof found.content === 'string'
                    ? JSON.parse(found.content)
                    : found.content;

                if (content && Array.isArray(content) && content.length > 0) {
                     // We need to replace blocks. Since useCreateBlockNote creates an empty doc,
                     // we replace it with our content.
                     if(editor) {
                        editor.replaceBlocks(editor.document, content);
                     }
                }
            } catch (e) {
                console.error("Failed to parse article content for viewer:", e);
            }
        }
        setLoading(false);
    } else if (!contextLoading && articles.length === 0) {
        // Articles array empty but finished loading
        setLoading(false);
    }
  }, [id, articles, contextLoading, editor]);

  if (loading || contextLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  const { title, published_at, cover_image, category } = article;

  return (
    <div className={`min-h-screen font-body transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
        <Link to="/" className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-8 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
             <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-blue-500 mb-4">
                <span>{category || 'Insight'}</span>
                <span>•</span>
                <span>{new Date(published_at).toLocaleDateString()}</span>
            </div>
            <h1 className="font-artistic text-3xl md:text-5xl font-bold leading-tight mb-6">{title}</h1>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                    <Facebook size={24} />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition-transform">
                    <Linkedin size={24} />
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M16 14.5c-.5-1-1.5-1.5-2.5-1.5h-1c-1 0-2 .5-2.5 1.5l-1 1c-1.5-1-2.5-2-3.5-3.5l1-1c1-.5 1.5-1.5 1.5-2.5v-1c0-1-.5-2-1.5-2.5l-1.5-1c-1 0-2 .5-2.5 1.5a4.4 4.4 0 0 0 .5 4.5c1.5 3.5 4.5 6.5 8 8a4.4 4.4 0 0 0 4.5.5c1-.5 1.5-1.5 1.5-2.5l-1-1.5z"/></svg>
                </a>
            </div>
        </div>

        {/* Content */}
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
             {cover_image && (
                 <img src={cover_image} alt={title} className="w-full h-auto object-cover rounded-xl mb-12 shadow-lg" />
             )}

             {/* BlockNote Renderer (Read-Only) */}
             <div className={`blocknote-content ${isDark ? 'dark-mode-blocks' : ''}`}>
                 <BlockNoteView editor={editor} editable={false} theme={isDark ? "dark" : "light"} />
             </div>
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default ArticleViewer;
