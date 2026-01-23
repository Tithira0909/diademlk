import React from 'react';

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

export default StatsStrip;
