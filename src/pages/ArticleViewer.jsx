import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import edjsHTML from 'editorjs-html';
import { ArrowLeft, Facebook, Instagram, Linkedin, Youtube, Video } from 'lucide-react';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';





const ArticleViewer = () => {
  const { id } = useParams(); // 'id' will be the SLUG
  const { articles, settings, loading: contextLoading } = useData();
  const [article, setArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Content state variables
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!contextLoading && articles.length > 0) {
        const found = articles.find(a => a.slug === id);
        if (found) {
            setArticle(found);

            let html = found.content || '';

            try {
                const parsed = JSON.parse(found.content);

                // Handle Editor.js JSON Format
                if (parsed && typeof parsed === 'object' && parsed.blocks) {
                    const edjsParser = edjsHTML({
                        paragraph: (block) => {
                             const align = block.tunes?.textAlignment?.alignment || 'left';
                             return `<p style="text-align: ${align};">${block.data.text}</p>`;
                        },
                        header: (block) => {
                             const align = block.tunes?.textAlignment?.alignment || 'left';
                             return `<h${block.data.level} style="text-align: ${align};">${block.data.text}</h${block.data.level}>`;
                        }
                    });
                    const parsedHtmlArray = edjsParser.parse(parsed);
                    html = parsedHtmlArray.join('');
                } else if (typeof parsed === 'string') {
                    // Legacy Lexical HTML string or standard HTML
                    html = parsed;
                } else if (Array.isArray(parsed) && parsed.length > 0) {
                    // Legacy BlockNote format
                    html = '<p><em>Error: Legacy BlockNote format is no longer supported. Please open this article in the admin panel and re-save it to migrate it.</em></p>';
                }
            } catch (e) {
                // It's probably already raw HTML
            }

            setContentHtml(html);
        }
        setLoading(false);
    } else if (!contextLoading && articles.length === 0) {
        // Articles array empty but finished loading
        setLoading(false);
    }
  }, [id, articles, contextLoading]);

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
                {settings?.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                        <Facebook size={24} />
                    </a>
                )}
                {settings?.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition-transform">
                        <Instagram size={24} />
                    </a>
                )}
                {settings?.linkedin_url && (
                    <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition-transform">
                        <Linkedin size={24} />
                    </a>
                )}
                {settings?.tiktok_url && (
                    <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className={`hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-black'}`}>
                        <Video size={24} />
                    </a>
                )}
                {settings?.youtube_url && (
                    <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition-transform">
                        <Youtube size={24} />
                    </a>
                )}
            </div>
        </div>

        {/* Content */}
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
             {cover_image && (
                 <img src={cover_image} alt={title} className="w-full h-auto object-cover rounded-xl mb-12 shadow-lg" />
             )}

             {/* BlockNote Renderer (Read-Only) */}
             <div className={`prose prose-lg max-w-none prose-blue ${isDark ? 'dark:prose-invert text-gray-300' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default ArticleViewer;
