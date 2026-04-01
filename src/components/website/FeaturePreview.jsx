import React from 'react';
import { BookOpen, Users, CheckCircle } from 'lucide-react';

const FeaturePreview = ({ id, title, subtitle, features, isDark, align = 'left' }) => {
  const isRight = align === 'right';
  return (
    <section id={id} className={`py-20 md:py-32 relative z-10 border-t ${isDark ? 'bg-black border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Content Side */}
        <div className={`order-2 ${isRight ? 'md:order-1' : 'md:order-2'} reveal`}>
          <div className={`inline-block px-3 py-1 mb-6 border rounded-full ${isDark ? 'border-zinc-700 bg-zinc-900 text-gray-300' : 'border-zinc-300 bg-white text-zinc-600'}`}>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Coming Soon • Phase 2</span>
          </div>
          <h2 className={`font-artistic text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h2>
          <p className={`text-base md:text-lg mb-8 leading-relaxed text-justify ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>{subtitle}</p>

          <ul className="space-y-4">
            {features.map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                  <CheckCircle size={14} className={isDark ? 'text-white' : 'text-black'} />
                </div>
                <span className={`font-body ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}>{item}</span>
              </li>
            ))}
          </ul>

          <button className={`mt-10 px-8 py-3 text-sm font-bold uppercase tracking-widest border transition-all ${isDark ? 'border-zinc-700 text-gray-400 hover:border-white hover:text-white' : 'border-zinc-300 text-zinc-600 hover:border-black hover:text-black'}`}>
            Get Notified on Launch
          </button>
        </div>

        {/* Visual Side */}
        <div className={`order-1 ${isRight ? 'md:order-2' : 'md:order-1'} reveal`}>
          <div className={`aspect-square relative border p-4 ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
            <div className={`w-full h-full relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(${isDark ? '#555' : '#ccc'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
              <div className="text-center relative z-10">
                <div className={`w-20 h-20 mx-auto mb-6 border-2 rounded-full flex items-center justify-center animate-pulse ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-white'}`}>
                  {id === 'courses' ? <BookOpen size={32} className={isDark ? 'text-white' : 'text-black'} /> : <Users size={32} className={isDark ? 'text-white' : 'text-black'} />}
                </div>
                <p className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-zinc-500'}`}>
                  {id === 'courses' ? 'Online Course Modules' : 'Buyer/Seller Leads'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturePreview;
