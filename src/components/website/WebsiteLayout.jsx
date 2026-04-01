import React, { useState } from 'react';
import GlobalStyles from '../GlobalStyles';
import useScrollReveal from '../../hooks/useScrollReveal';
import Navbar from './Navbar';
import Hero from './Hero';
import StatsStrip from './StatsStrip';
import VisionMission from './VisionMission';
import Services from './Services';
import FeaturePreview from './FeaturePreview';
import BlogSection from './BlogSection'; // Needs to be the one in this folder
import Footer from './Footer';

const WebsiteLayout = () => {
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

export default WebsiteLayout;
