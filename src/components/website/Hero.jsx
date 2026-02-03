import React, { useState, useEffect } from 'react';
import { ArrowRight, Anchor } from 'lucide-react';
import ThreeBackground from './ThreeBackground';
import { useData } from '../../context/DataContext';

const Hero = ({ isDark }) => {
  const { banners } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
      if (banners && banners.length > 1) {
          const interval = setInterval(() => {
              setCurrentIndex(prev => (prev + 1) % banners.length);
          }, 5000);
          return () => clearInterval(interval);
      }
  }, [banners]);

  if (banners && banners.length > 0) {
      const banner = banners[currentIndex];
      return (
        <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Transition */}
             {banners.map((b, index) => (
                <div
                    key={b.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Overlay */}
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                </div>
            ))}

            <div className="relative z-20 max-w-6xl mx-auto px-6 text-center pt-24 md:pt-32">
                 <div className="reveal active">
                    <h1 className="font-artistic text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] text-white drop-shadow-lg max-w-4xl mx-auto">
                        {banner.title}
                    </h1>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        {banner.link ? (
                            <a href={banner.link} className="px-8 py-3 md:px-10 md:py-4 font-body font-bold text-xs md:text-sm uppercase tracking-widest bg-white text-black hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 rounded-none">
                                Learn More <ArrowRight className="w-4 h-4" />
                            </a>
                        ) : (
                             <button className="px-8 py-3 md:px-10 md:py-4 font-body font-bold text-xs md:text-sm uppercase tracking-widest bg-white text-black hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 rounded-none">
                                Explore <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                 </div>
            </div>

             {/* Indicators */}
             {banners.length > 1 && (
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                     {banners.map((_, idx) => (
                         <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'}`}
                         />
                     ))}
                 </div>
             )}
        </section>
      );
  }

  // Default Content if no banners
  return (
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
};

export default Hero;
