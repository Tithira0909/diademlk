import React from 'react';
import { TrendingUp, Globe } from 'lucide-react';

const VisionMission = ({ isDark }) => {
  const cardClass = `p-8 border-l-4 transition-colors duration-500 ${isDark ? 'bg-zinc-900/50 border-white hover:bg-zinc-800' : 'bg-zinc-50 border-black hover:bg-zinc-100'}`;

  return (
    <section id="vision" className={`py-20 md:py-32 relative z-10 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className={`reveal ${cardClass}`}>
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp size={32} className={isDark ? 'text-white' : 'text-black'} />
            <h2 className={`font-artistic text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Our Vision</h2>
          </div>
          <p className={`leading-relaxed text-sm md:text-base text-justify ${isDark ? 'text-gray-400' : 'text-zinc-700'}`}>
            To transform Sri Lanka’s international trade sector by establishing a pioneering foundation of resilient enterprises, empowering local entrepreneurs, driving supply chain innovation, and fostering global recognition through collaborative growth.
          </p>
        </div>

        <div className={`reveal ${cardClass}`}>
          <div className="flex items-center gap-4 mb-6">
            <Globe size={32} className={isDark ? 'text-white' : 'text-black'} />
            <h2 className={`font-artistic text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Our Mission</h2>
          </div>
          <p className={`leading-relaxed text-sm md:text-base text-justify ${isDark ? 'text-gray-400' : 'text-zinc-700'}`}>
            Diadem is committed to strengthening Sri Lanka’s international trade sector by building a resilient infrastructure, forging partnerships with self-employed entrepreneurs, and leveraging community support to address gaps in trade capabilities. Our mission is to empower local talent, enhance supply chain innovation, transfer sustainable businesses to deserving individuals, and promote global recognition through collaborative growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
