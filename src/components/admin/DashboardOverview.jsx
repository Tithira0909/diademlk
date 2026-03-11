import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FileText, MessageSquare, Users, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const DashboardOverview = () => {
  const { articles, inquiries, users, siteViews } = useData();

  const stats = [
    { title: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
    { title: 'Inquiries', value: inquiries.length, icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Total Users', value: users.length, icon: Users, color: 'bg-purple-500' },
    { title: 'Views', value: siteViews || 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  // Prepare chart data
  const categoryData = articles.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
  }, {});

  const pieData = Object.keys(categoryData).map(key => ({ name: key, value: categoryData[key] }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock activity data
  const activityData = [
      { name: 'Mon', inquiries: 2, articles: 0 },
      { name: 'Tue', inquiries: 5, articles: 1 },
      { name: 'Wed', inquiries: 1, articles: 0 },
      { name: 'Thu', inquiries: 8, articles: 2 },
      { name: 'Fri', inquiries: 4, articles: 0 },
      { name: 'Sat', inquiries: 2, articles: 1 },
      { name: 'Sun', inquiries: 1, articles: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-800 font-artistic">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6 text-gray-800">Weekly Activity</h3>
              <div className="h-64" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Bar dataKey="inquiries" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="articles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Categories Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6 text-gray-800">Content Distribution</h3>
              <div className="h-64" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span>{entry.name} ({entry.value})</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
