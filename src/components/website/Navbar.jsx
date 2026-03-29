import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab, isDark, toggleTheme, hasHeroBanners }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Academy' },
    { id: 'trade', label: 'Trade' },
    { id: 'blogs', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    if (setActiveTab) setActiveTab(id);
    setMobileMenuOpen(false);

    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Theme Styles
  const isTransparent = !isScrolled && location.pathname === '/';

  // If we are transparent and have banners, the background is dark, so force white text
  const forceWhite = isTransparent && hasHeroBanners;

  const navBg = isScrolled || location.pathname !== '/'
    ? (isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200')
    : 'bg-transparent border-transparent';

  const textColor = isDark || forceWhite ? 'text-white' : 'text-zinc-900';
  const logoSrc = isDark || forceWhite ? "/logo-white.png" : "/logo-black.png";
  const hoverLineColor = isDark || forceWhite ? 'bg-white' : 'bg-black';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-md border-b py-4 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
          <img
            src={logoSrc}
            alt="Diadem Logo"
            className="h-14 object-contain transition-all duration-500"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-xs font-bold tracking-widest uppercase transition-all duration-300 relative group ${activeTab === link.id ? textColor : (forceWhite ? 'text-gray-300' : 'text-gray-500')}`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${hoverLineColor}`}></span>
            </button>
          ))}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-transform hover:rotate-180 duration-500 ${isDark || forceWhite ? 'text-yellow-400 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className={isDark || forceWhite ? 'text-yellow-400' : 'text-zinc-600'}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className={textColor} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full border-b p-8 flex flex-col gap-6 shadow-2xl ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left text-lg font-artistic font-bold ${isDark ? 'text-white' : 'text-black'}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
