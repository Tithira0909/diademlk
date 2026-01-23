import React from 'react';
import { ArrowRight, Anchor } from 'lucide-react';
import ThreeBackground from './ThreeBackground';

const Hero = ({ isDark }) => (
  <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
    <ThreeBackground isDark={isDark} />
    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24 md:pt-32">
      <div className="reveal active">
        <div className={`inline-flex items-center gap-3 px-4 py-2 border rounded-full backdrop-blur-md mb-6 md:mb-8 ${isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}`}>
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'} animate-pulse`}></div>
          <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-zinc-600'}`}>Connecting Sri Lanka to the World</span>
        </div>

        <h1 className={`font-artistic text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          The Architect of <br />
          <span className="font-bit opacity-80">Global Trade</span>
        </h1>

        <p className={`font-body text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 font-light leading-relaxed text-justify ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>
          Partner with us to reach global markets from Sri Lanka. We build resilient enterprises and foster global recognition through collaborative growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button className={`px-8 py-3 md:px-10 md:py-4 font-body font-bold text-xs md:text-sm uppercase tracking-widest transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className={`px-8 py-3 md:px-10 md:py-4 font-body font-bold text-xs md:text-sm uppercase tracking-widest border transition-all hover:bg-opacity-10 ${isDark ? 'border-white text-white hover:bg-white' : 'border-black text-black hover:bg-black'}`}>
            Our Services
          </button>
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className={`absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce ${isDark ? 'text-white' : 'text-black'}`}>
      <Anchor className="w-5 h-5 md:w-6 md:h-6 opacity-50" />
    </div>
  </section>
);

export default Hero;
