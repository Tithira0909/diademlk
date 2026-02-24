import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Facebook, Instagram, Linkedin, Youtube, Video } from 'lucide-react';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';
import DOMPurify from 'dompurify';
import { strapiService } from '../services/strapiService';

const ArticleViewer = () => {
  const { id } = useParams(); // 'id' will now be the SLUG
  const { settings } = useData();
  const [article, setArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
        try {
            setLoading(true);
            const data = await strapiService.getArticleBySlug(id);
            setArticle(data);
        } catch (error) {
            console.error("Failed to fetch article:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  const { title, excerpt, content, publishedAt, cover, category } = article.attributes;
  const coverUrl = cover?.data?.attributes?.url ? strapiService.getMediaUrl(cover.data.attributes.url) : null;
  const categoryName = category?.data?.attributes?.name || 'Insight';

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
                <span>{categoryName}</span>
                <span>•</span>
                <span>{new Date(publishedAt).toLocaleDateString()}</span>
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

            {/* Excerpt if exists */}
            {excerpt && (
                <div className={`text-lg md:text-xl font-medium mb-8 leading-relaxed italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {excerpt}
                </div>
            )}
        </div>

        {/* Content */}
        <div className={`strapi-content ck-content ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
             {coverUrl && (
                 <img src={coverUrl} alt={title} className="w-full h-96 object-cover rounded-xl mb-8" />
             )}

             {/* CKEditor HTML Content */}
             <div
                className="[&>*]:max-w-full"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, { ADD_ATTR: ['style', 'class', 'target', 'width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen'] }) }}
             />
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default ArticleViewer;
