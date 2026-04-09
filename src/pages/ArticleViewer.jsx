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
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/article/' + id)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                    <Facebook size={24} />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/article/' + id)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition-transform">
                    <Linkedin size={24} />
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + window.location.origin + '/article/' + id)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
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
