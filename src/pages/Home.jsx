import React, { useState, useEffect, useRef } from 'react';
import {
    Menu, X, ArrowRight, Globe, TrendingUp, BookOpen,
    Anchor, CheckCircle, Mail, Phone, MapPin, ChevronRight,
    Ship, Briefcase, Users, FileText, Sun, Moon,
    BarChart3, ShieldCheck, Truck, Award
} from 'lucide-react';
import * as THREE from 'three';
import BlogSection from '../components/BlogSection';

// --- STYLES & FONTS ---
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

// --- HOOKS ---
const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

// --- COMPONENTS ---

// 1. Navigation Bar
const Navbar = ({ activeTab, setActiveTab, isDark, toggleTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'vision', label: 'Vision' },
        { id: 'courses', label: 'Academy' },
        { id: 'trade', label: 'Trade' },
        { id: 'blogs', label: 'Insights' },
        { id: 'contact', label: 'Contact' },
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    // Theme Styles
    const navBg = isScrolled
        ? (isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200')
        : 'bg-transparent border-transparent';

    const textColor = isDark ? 'text-white' : 'text-zinc-900';
    const logoText = isDark ? 'text-white' : 'text-black';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-md border-b py-4 ${navBg}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo Area */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
                    <div className={`w-10 h-10 border-2 rounded-sm flex items-center justify-center transition-transform group-hover:rotate-45 duration-500 ${isDark ? 'border-white bg-transparent' : 'border-black bg-transparent'}`}>
                        <span className={`font-artistic font-bold text-xl group-hover:-rotate-45 transition-transform duration-500 ${logoText}`}>D</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-artistic font-bold text-xl tracking-[0.2em] leading-none ${textColor}`}>DIADEM</span>
                        <span className={`text-[0.6rem] uppercase tracking-widest opacity-60 ${textColor}`}>Global Trade</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavClick(link.id)}
                            className={`text-xs font-bold tracking-widest uppercase transition-all duration-300 relative group ${activeTab === link.id ? textColor : 'text-gray-500'}`}
                        >
                            {link.label}
                            <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isDark ? 'bg-white' : 'bg-black'}`}></span>
                        </button>
                    ))}

                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-transform hover:rotate-180 duration-500 ${isDark ? 'text-yellow-400 hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'}`}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <button onClick={toggleTheme} className={isDark ? 'text-yellow-400' : 'text-zinc-600'}>
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

// 2. Three.js Background
const ThreeBackground = ({ isDark }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const globeRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(isDark ? 0x000000 : 0xffffff, 0.003);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 18;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        // Abstract Globe
        const geometry = new THREE.IcosahedronGeometry(10, 2);
        const material = new THREE.MeshBasicMaterial({
            color: isDark ? 0x444444 : 0xdddddd,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const globe = new THREE.Mesh(geometry, material);
        globeRef.current = globe;
        scene.add(globe);

        // Floating Particles
        const particlesGeo = new THREE.BufferGeometry();
        const count = 1000;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 60;
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.05,
            color: isDark ? 0xffffff : 0x000000,
            opacity: 0.4,
            transparent: true
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        const animate = () => {
            requestAnimationFrame(animate);
            if (globe) {
                globe.rotation.y += 0.0005;
                globe.rotation.x -= 0.0002;
            }
            particles.rotation.y += 0.0002;
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mount) mount.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.fog = new THREE.FogExp2(isDark ? 0x000000 : 0xffffff, 0.003);
        }
        if (globeRef.current) {
            // Update Globe Material based on theme
            globeRef.current.material.color.setHex(isDark ? 0x444444 : 0x888888); // Darker gray for white theme
            globeRef.current.material.opacity = isDark ? 0.15 : 0.35; // Higher opacity for white theme
        }
    }, [isDark]);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// 3. Hero Section
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

// 3.5 Vision & Mission Section (New)
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

// 4. Stats & Trust Strip
const StatsStrip = ({ isDark }) => {
    const stats = [
        { label: "Partner Enterprises", value: "200+" },
        { label: "Countries Reached", value: "15+" },
        { label: "Successful Shipments", value: "1.2K" },
        { label: "Success Rate", value: "98%" },
    ];

    return (
        <div className={`border-y relative z-10 ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="text-center reveal">
                        <div className={`font-artistic text-3xl md:text-4xl font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            {stat.value}
                        </div>
                        <div className={`text-[10px] md:text-xs uppercase tracking-widest font-bold ${isDark ? 'text-gray-500' : 'text-zinc-500'}`}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 6. Services & Values
import { BookOpen, Briefcase, Truck, ChevronRight, CheckCircle, Users } from 'lucide-react'; // Assuming these are your imports

const ServiceCard = ({ icon: Icon, title, desc, imgPlaceholder, isDark }) => (
    <div className={`group relative border overflow-hidden reveal ${isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'}`}>
        {/* Image Area - FIXED */}
        <div className={`h-48 md:h-64 w-full relative overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <img 
                src={imgPlaceholder} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}></div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 relative">
            <div className={`absolute -top-6 right-8 w-12 h-12 flex items-center justify-center border transition-colors ${isDark ? 'bg-black border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}>
                <Icon size={20} />
            </div>
            <h3 className={`font-artistic text-xl md:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>
            <p className={`text-sm mb-6 leading-relaxed text-justify ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>{desc}</p>
            <button className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all ${isDark ? 'text-white' : 'text-black'}`}>
                Explore Service <ChevronRight size={14} />
            </button>
        </div>
    </div>
);

const Services = ({ isDark }) => (
    <section className={`py-20 md:py-32 relative z-10 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 md:mb-24 reveal">
                <h2 className={`font-artistic text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Comprehensive Infrastructure</h2>
                <div className={`w-24 h-1 mx-auto ${isDark ? 'bg-white' : 'bg-black'}`}></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ServiceCard
                    isDark={isDark}
                    icon={BookOpen}
                    title="Academy & Training"
                    desc="Empower local entrepreneurs with knowledge. Courses on Import/Export procedures designed to help you reach the global market."
                    imgPlaceholder="test"
                />
                <ServiceCard
                    isDark={isDark}
                    icon={Briefcase}
                    title="Export Consultancy"
                    desc="Full management: Business registration (BR, TIN), Customs registration, Buyer/Seller verification, and Shipping Agent coordination."
                    imgPlaceholder="/images/consultation.jpg"
                />
                <ServiceCard
                    isDark={isDark}
                    icon={Truck}
                    title="Global Logistics"
                    desc="All kinds of logistic solutions. From Customs clearance to Door-to-Door delivery services tailored to your requirements."
                    imgPlaceholder="/images/logistics.jpg"
                />
            </div>
        </div>
    </section>
);

// 7. Phase 2 Previews (High End)
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

// 8. Footer (High Information Density)
const Footer = ({ isDark }) => {
    const bg = isDark ? 'bg-black border-zinc-900' : 'bg-zinc-100 border-zinc-200';
    const textHead = isDark ? 'text-white' : 'text-zinc-900';
    const textBody = isDark ? 'text-gray-500' : 'text-zinc-500';

    return (
        <footer id="contact" className={`pt-24 pb-12 relative z-10 border-t ${bg}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-12 mb-20">

                    {/* Brand Col */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`w-8 h-8 border flex items-center justify-center ${isDark ? 'border-white text-white' : 'border-black text-black'}`}>
                                <span className="font-artistic font-bold">D</span>
                            </div>
                            <span className={`font-artistic font-bold text-2xl tracking-widest ${textHead}`}>DIADEM</span>
                        </div>
                        <p className={`mb-6 leading-relaxed text-sm text-justify ${textBody}`}>
                            Strengthening Sri Lanka’s international trade sector by building a resilient infrastructure and empowering local talent.
                        </p>
                        <div className={`text-xs space-y-2 mb-6 ${textBody}`}>
                            <p>Office: Mon – Fri (9AM – 5PM)</p>
                            <p>Inquiry: Mon – Sat (8.30AM – 7PM)</p>
                        </div>
                        <div className="flex gap-4">
                            {['FB', 'LN', 'IG', 'X'].map(s => (
                                <div key={s} className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${isDark ? 'border-zinc-800 text-gray-500 hover:border-white hover:text-white' : 'border-zinc-300 text-zinc-500 hover:border-black hover:text-black'}`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Cols */}
                    <div className="lg:col-span-3">
                        <h4 className={`font-bold mb-6 uppercase text-xs tracking-widest ${textHead}`}>Useful Links</h4>
                        <ul className={`space-y-4 text-sm ${textBody}`}>
                            <li>Customs, Sri Lanka</li>
                            <li>BOI (Board of Investment)</li>
                            <li>IDB (Industrial Development Board)</li>
                            <li>Export Agriculture Dept</li>
                            <li>EDB (Export Development Board)</li>
                            <li>NCGIL</li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div className="lg:col-span-5">
                        <h4 className={`font-bold mb-6 uppercase text-xs tracking-widest ${textHead}`}>Make an Inquiry</h4>
                        <div className={`p-6 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'}`}>
                            <div className="space-y-4">
                                <input type="text" placeholder="Name" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`} />
                                <input type="text" placeholder="Contact No" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`} />
                                <textarea placeholder="Message" rows="2" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`}></textarea>
                                <button className={`w-full py-3 text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Submit Inquiry</button>
                            </div>
                        </div>
                        <div className={`mt-6 flex items-center gap-4 text-sm ${textBody}`}>
                            <Mail size={16} />
                            <span>info@diadem.com</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs ${isDark ? 'border-zinc-900 text-gray-600' : 'border-zinc-300 text-zinc-500'}`}>
                    <p>© 2024 DiademLK. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <span>Privacy Policy</span>
                        <span>Terms of Trade</span>
                        <span>Sitemap</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- MAIN APP ---
const Home = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isDark, setIsDark] = useState(false);

    useScrollReveal();

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className={`min-h-screen font-body selection:bg-gray-500 selection:text-white transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
            <GlobalStyles />
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isDark={isDark}
                toggleTheme={toggleTheme}
            />

            <Hero isDark={isDark} />
            <StatsStrip isDark={isDark} />
            <VisionMission isDark={isDark} />
            <Services isDark={isDark} />

            <FeaturePreview
                id="courses"
                title="Diadem Academy"
                subtitle="Bridging the knowledge gap. Our upcoming Learning Management System (LMS) will feature video modules, downloadable PDFs, and certification from industry veterans."
                features={['Self-Paced Learning', 'Expert Certification', 'Resource Library']}
                isDark={isDark}
                align="left"
            />

            <FeaturePreview
                id="trade"
                title="Trade Marketplace"
                subtitle="A secure ecosystem for buyers and sellers. Post leads, verify partners, and manage periodic subscriptions for sustained growth."
                features={['Verified Leads', 'Single Order (Free)', 'Subscription Tiers']}
                isDark={isDark}
                align="right"
            />

            <BlogSection isDark={isDark} />
            <Footer isDark={isDark} />
        </div>
    );
};

export default Home;
