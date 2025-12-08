import React, { useState } from 'react';
import { X, Calendar, User, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { blogData } from '../data/blogData';

const BlogCard = ({ post, onClick, isDark }) => (
    <div
        onClick={() => onClick(post)}
        className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
    >
        {/* Image Container */}
        <div className="h-48 overflow-hidden relative">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md ${isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-black'}`}>
                {post.category}
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            <div className={`flex items-center gap-4 text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-zinc-500'}`}>
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                </div>
            </div>

            <h3 className={`font-artistic text-xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-green-500 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {post.title}
            </h3>

            <p className={`text-sm line-clamp-3 mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>
                {post.excerpt}
            </p>

            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all ${isDark ? 'text-white' : 'text-black'}`}>
                Read Article <ArrowRight size={14} />
            </div>
        </div>
    </div>
);

const BlogModal = ({ post, onClose, isDark }) => {
    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative w-full max-w-4xl max-h-full overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${isDark ? 'bg-black/50 text-white hover:bg-black' : 'bg-white/50 text-black hover:bg-white'}`}
                >
                    <X size={24} />
                </button>

                {/* Hero Image */}
                <div className="h-64 md:h-96 w-full relative">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-green-400 mb-4">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                        </div>
                        <h2 className="font-artistic text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <User size={16} />
                            <span>By {post.author}</span>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className={`p-8 md:p-12 prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Footer */}
                <div className={`p-8 border-t flex justify-between items-center ${isDark ? 'border-zinc-800 bg-black/20' : 'border-zinc-100 bg-zinc-50'}`}>
                    <button onClick={onClose} className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                        Back to Insights
                    </button>
                    <div className="flex gap-4">
                        {/* Share buttons could go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BlogSection = ({ isDark }) => {
    const [selectedPost, setSelectedPost] = useState(null);

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
                    <button className={`hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b pb-1 transition-all ${isDark ? 'text-white border-zinc-700 hover:border-white' : 'text-black border-zinc-300 hover:border-black'}`}>
                        View All Articles <ChevronRight size={16} />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogData.map(post => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            isDark={isDark}
                            onClick={setSelectedPost}
                        />
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-12 md:hidden text-center">
                    <button className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border px-6 py-3 transition-all ${isDark ? 'text-white border-zinc-700' : 'text-black border-zinc-300'}`}>
                        View All Articles <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Modal */}
            {selectedPost && (
                <BlogModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    isDark={isDark}
                />
            )}
        </section>
    );
};

export default BlogSection;
