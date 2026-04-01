import React from 'react';

const GlobalStyles = () => (
  <style>{`
    /* Added Silkscreen to mimic Bitcount Prop Single (which is not on Google Fonts) */
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Silkscreen&display=swap');

    .font-artistic { font-family: 'Space Grotesk', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-bit { font-family: 'Silkscreen', cursive; }

    /* Smooth Reveal Animation Classes */
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 1s cubic-bezier(0.5, 0, 0, 1);
    }
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1a1a1a; }
    ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #666; }
  `}</style>
);

export default GlobalStyles;
