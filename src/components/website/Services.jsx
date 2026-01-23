import React from 'react';
import { BookOpen, Briefcase, Truck, ChevronRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, desc, imgPlaceholder, isDark }) => (
  <div className={`group relative h-full flex flex-col border overflow-hidden transition-all duration-300 hover:shadow-xl ${isDark ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>

    {/* Image Area */}
    <div className={`h-48 md:h-64 w-full relative overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
      {/* Placeholder / Image Logic */}
      <div className="absolute inset-0 flex items-center justify-center text-center p-4">
        {/* Simulating an image element for the effect */}
        <div className={`w-full h-full absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-40`}
             style={{ backgroundImage: `url('${imgPlaceholder}')`, backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}>
        </div>
        <span className={`relative z-10 text-xs uppercase tracking-widest font-bold opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
          {/* Fallback text if image fails to load */}
          {title} Image
        </span>
      </div>

      {/* Hover Overlay Gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t ${isDark ? 'from-zinc-900 via-transparent to-transparent' : 'from-zinc-100 via-transparent to-transparent'}`}></div>
    </div>

    {/* Content Area */}
    <div className="p-6 md:p-8 relative flex flex-col flex-grow">
      {/* Floating Icon Box */}
      <div className={`absolute -top-6 right-8 w-14 h-14 flex items-center justify-center border shadow-sm transition-colors duration-300 ${isDark ? 'bg-zinc-950 border-zinc-700 text-blue-400' : 'bg-white border-zinc-200 text-blue-600'}`}>
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <h3 className={`font-artistic text-xl md:text-2xl font-bold mb-4 mt-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        {title}
      </h3>

      <p className={`text-sm mb-8 leading-relaxed text-justify flex-grow ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        {desc}
      </p>

      {/* Button */}
      <button className={`w-max text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all group-hover:gap-4 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-zinc-900 group-hover:text-blue-600'}`}>
        Explore Service <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

const Services = ({ isDark }) => {
  const servicesData = [
    {
      icon: BookOpen,
      title: "Academy & Training",
      desc: "Empower local entrepreneurs with knowledge. comprehensive courses on Import/Export procedures designed to help you navigate and reach the global market with confidence.",
      img: "/images/training.jpg"
    },
    {
      icon: Briefcase,
      title: "Export Consultancy",
      desc: "Full management solutions: Business registration (BR, TIN), Customs registration, Buyer/Seller verification, and seamless Shipping Agent coordination.",
      img: "/images/consultation.jpg"
    },
    {
      icon: Truck,
      title: "Global Logistics",
      desc: "End-to-end logistic solutions. From complex Customs clearance to reliable Door-to-Door delivery services tailored specifically to your cargo requirements.",
      img: "/images/logistics.jpg"
    }
  ];

  return (
    <section className={`py-20 md:py-32 relative z-10 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 reveal">
          <h2 className={`font-artistic text-3xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Comprehensive Infrastructure
          </h2>
          <div className={`w-24 h-1.5 mx-auto rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              isDark={isDark}
              icon={service.icon}
              title={service.title}
              desc={service.desc}
              imgPlaceholder={service.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
