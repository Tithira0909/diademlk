import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ChevronRight, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

const BlogCard = ({ post, isDark }) => {
    // Contentful Fields: id, title, slug, publishedAt, excerpt, coverImage, categories
    const { title, slug, publishedAt, excerpt, coverImage, categories } = post;
    const categoryName = (categories && categories.length > 0) ? categories[0] : 'Insight';

    return (
    <Link
        to={`/article/${slug}`}
        className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
    >
        {/* Image Container */}
        <div className="h-48 overflow-hidden relative bg-gray-200">
            {coverImage ? (
                <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
            )}

            <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md ${isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-black'}`}>
                {categoryName}
            </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
            <div className={`flex items-center gap-4 text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-zinc-500'}`}>
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                </div>
            </div>

            <h3 className={`font-artistic text-xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-green-500 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {title}
            </h3>

            <p className={`text-sm line-clamp-3 mb-6 leading-relaxed flex-grow excerpt-content ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>
                {excerpt}
            </p>

            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all ${isDark ? 'text-white' : 'text-black'}`}>
                Read Article <ArrowRight size={14} />
            </div>
        </div>
    </Link>
    );
};

const BlogSection = ({ isDark }) => {
    const { articles } = useData();

    // Limit to latest 6 articles
    const displayedArticles = articles ? articles.slice(0, 6) : [];

    return (
        <section id="blogs" className={`py-20 md:py-32 relative z-10 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className={`font-artistic text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            Latest Insights
                        </h2>
                        <p className={`max-w-xl text-lg ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>
                            Expert analysis, trade updates, and success stories from the heart of Sri Lanka's export sector.
                        </p>
                    </div>
                    {/* View All Button could route to a full blog page if we had one */}
                    <button className={`hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b pb-1 transition-all ${isDark ? 'text-white border-zinc-700 hover:border-white' : 'text-black border-zinc-300 hover:border-black'}`}>
                        View All Articles <ChevronRight size={16} />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedArticles.length > 0 ? (
                        displayedArticles.map(post => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                isDark={isDark}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10 opacity-50">No articles available.</div>
                    )}
                </div>

                {/* Mobile View All */}
                <div className="mt-12 md:hidden text-center">
                    <button className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border px-6 py-3 transition-all ${isDark ? 'text-white border-zinc-700' : 'text-black border-zinc-300'}`}>
                        View All Articles <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
