import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Footer = ({ isDark }) => {
  const bg = isDark ? 'bg-black border-zinc-900' : 'bg-zinc-100 border-zinc-200';
  const textHead = isDark ? 'text-white' : 'text-zinc-900';
  const textBody = isDark ? 'text-gray-500' : 'text-zinc-500';

  const { addInquiry } = useData();
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || (!formData.contact && !formData.email)) return;

      addInquiry({
          name: formData.name,
          phone: formData.contact,
          email: formData.email,
          message: formData.message
      });
      setStatus('Inquiry sent!');
      setFormData({ name: '', contact: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
  };

  return (
    <footer id="contact" className={`pt-24 pb-12 relative z-10 border-t ${bg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">

          {/* Brand Col */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <img
                src={isDark ? "/logo-white.png" : "/logo-black.png"}
                alt="Diadem"
                className="h-16 w-auto object-contain"
              />
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
              <li>
                <a href="https://www.customs.gov.lk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  Customs, Sri Lanka
                </a>
              </li>
              <li>
                <a href="https://investsrilanka.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  BOI (Board of Investment)
                </a>
              </li>
              <li>
                <a href="https://idb.gov.lk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  IDB (Industrial Development Board)
                </a>
              </li>
              <li>
                <a href="https://dea.gov.lk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  Export Agriculture Dept
                </a>
              </li>
              <li>
                <a href="https://www.srilankabusiness.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  EDB (Export Development Board)
                </a>
              </li>
              <li>
                <a href="https://www.ncgil.lk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  NCGIL
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-5">
            <h4 className={`font-bold mb-6 uppercase text-xs tracking-widest ${textHead}`}>Make an Inquiry</h4>
            <div className={`p-6 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'}`}>
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Name" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`} />
                <input name="contact" value={formData.contact} onChange={handleChange} type="text" placeholder="Contact No" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`} />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`} />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" rows="2" className={`w-full bg-transparent border-b pb-2 focus:outline-none text-sm ${isDark ? 'border-zinc-700 text-white focus:border-white' : 'border-zinc-300 text-black focus:border-black'}`}></textarea>
                <button onClick={handleSubmit} className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                    {status || 'Submit Inquiry'}
                </button>
              </div>
            </div>
            <div className={`mt-6 flex items-center gap-4 text-sm ${textBody}`}>
              <Mail size={16} />
              <span>info@diademlk.com</span>
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

export default Footer;
