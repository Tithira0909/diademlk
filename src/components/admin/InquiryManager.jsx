import React from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Phone, Calendar } from 'lucide-react';

const InquiryManager = () => {
  const { inquiries } = useData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-800 font-artistic">Inquiries</h1>

      <div className="grid gap-4">
        {inquiries.length === 0 ? (
           <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
               No inquiries received yet.
           </div>
        ) : (
            inquiries.map(inquiry => (
                <div key={inquiry.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{inquiry.name}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Mail size={12}/> {inquiry.email || 'No Email'}</span>
                                <span className="flex items-center gap-1"><Phone size={12}/> {inquiry.phone || 'No Phone'}</span>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
                            <Calendar size={12} /> {inquiry.date}
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-100">
                        {inquiry.message}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                            Mark as Read
                        </button>
                         <button className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-800 border border-gray-200 px-3 py-1 rounded hover:bg-gray-50 transition-colors">
                            Reply
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default InquiryManager;
