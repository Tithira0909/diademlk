import React from 'react';
import { useData } from '../../context/DataContext';
import { ExternalLink, Eye, Calendar, Tag } from 'lucide-react';
import { strapiService } from '../../services/strapiService';

const BlogManager = () => {
  const { articles } = useData();
  const strapiAdminUrl = import.meta.env.VITE_STRAPI_API_URL ? `${import.meta.env.VITE_STRAPI_API_URL}/admin` : 'http://localhost:1337/admin';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 font-artistic">Blog & Article Management</h1>
            <p className="text-gray-500 mt-2">Content is managed via Strapi CMS. Changes made there will reflect here automatically.</p>
        </div>
        <a
          href={strapiAdminUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <ExternalLink size={18} /> Open Strapi Admin
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Published Articles ({articles.length})</h2>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Synced from Strapi</div>
        </div>

        <div className="divide-y divide-gray-100">
            {articles.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                    <p>No articles found. Publish your first post in Strapi!</p>
                </div>
            ) : (
                articles.map(article => {
                    const { title, excerpt, slug, publishedAt, cover, category } = article.attributes;
                    const coverUrl = cover?.data?.attributes?.url ? strapiService.getMediaUrl(cover.data.attributes.url) : null;
                    const categoryName = category?.data?.attributes?.name || 'Uncategorized';

                    return (
                        <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-6 group">
                            {/* Image */}
                            <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                {coverUrl ? (
                                    <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">No Image</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                                        <Tag size={10} /> {categoryName}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{excerpt}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={`/article/${slug}`}
                                    target="_blank"
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="View Article"
                                >
                                    <Eye size={20} />
                                </a>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
