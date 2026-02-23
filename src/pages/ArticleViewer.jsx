import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Download, FileText, AlertCircle, Facebook, Instagram, Linkedin, Youtube, Video } from 'lucide-react';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';
import DOMPurify from 'dompurify';

const ArticleViewer = () => {
  const { id } = useParams();
  const { articles, settings } = useData();
  const [article, setArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs'); // For Navbar highlighting
  const [isDark, setIsDark] = useState(false); // Can be connected to context later or kept local

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // ID comes as string from router, but usually stored as number in data
    const found = articles.find(a => a.id.toString() === id);
    setArticle(found);
  }, [id, articles]);

  if (!article) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.date}</span>
            </div>
            <h1 className="font-artistic text-3xl md:text-5xl font-bold leading-tight mb-6">{article.title}</h1>

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

            <div
                className={`tinymce-content text-base md:text-lg lg:text-xl leading-relaxed [&>*]:max-w-full ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.excerpt, { ADD_ATTR: ['style', 'class', 'target'] }) }}
            />
        </div>

        {/* PDF Viewer or Content */}
        {article.pdfUrl ? (
            <div className="space-y-6">
                 <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between border border-gray-200">
                     <div className="flex items-center gap-3">
                         <div className="bg-red-500 text-white p-2 rounded">
                             <FileText size={24} />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">Attached Document</p>
                             <p className="text-xs text-gray-500">PDF Format</p>
                         </div>
                     </div>
                     <a href={article.pdfUrl} download className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                         <Download size={16} /> Download
                     </a>
                 </div>

                 {/* Iframe Viewer */}
                 <div className="w-full h-[800px] border rounded-xl overflow-hidden shadow-lg bg-gray-50">
                     <iframe
                        src={article.pdfUrl}
                        className="w-full h-full"
                        title="PDF Viewer"
                     >
                        <div className="flex items-center justify-center h-full text-gray-500 gap-2">
                             <AlertCircle />
                             <p>Your browser does not support PDFs. <a href={article.pdfUrl} className="underline text-blue-500">Download the PDF</a> to view it.</p>
                        </div>
                     </iframe>
                 </div>
            </div>
        ) : (
            <div className={`tinymce-content ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                 <img src={article.image} alt={article.title} className="w-full h-96 object-cover rounded-xl mb-8" />
                 <div
                    className="[&>*]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content, { ADD_ATTR: ['style', 'class', 'target'] }) }}
                 />
            </div>
        )}
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default ArticleViewer;
