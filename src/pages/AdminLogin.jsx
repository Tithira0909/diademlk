import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { RefreshCw } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaData, setCaptchaData] = useState({ image: '', token: '' });

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { loginWithCaptcha, verifyOtp, fetchCaptcha } = useData();
  const navigate = useNavigate();

  useEffect(() => {
      loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
      const data = await fetchCaptcha();
      if (data) setCaptchaData(data);
      setCaptchaValue('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaValue) {
        return setError('Please enter the captcha');
    }

    const result = await loginWithCaptcha(username, password, captchaValue, captchaData.token);

    if (result.success && result.requireOtp) {
        setStep(2);
        setSuccessMsg(result.message);
    } else {
        setError(result.message || 'Invalid credentials or captcha');
        loadCaptcha(); // Reload captcha on failure
    }
  };

  const handleOtpSubmit = async (e) => {
      e.preventDefault();
      setError('');

      const result = await verifyOtp(username, otp);
      if (result.success) {
          navigate('/admin/dashboard');
      } else {
          setError(result.message || 'Invalid OTP');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 font-body p-6">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <img src="/logo-white.png" alt="Diadem Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-artistic font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-zinc-500 text-sm">Sign in to manage the Diadem platform</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">{error}</div>}
        {successMsg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm text-center mb-6">{successMsg}</div>}

        {step === 1 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors"
                        placeholder="admin"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors"
                        placeholder="password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Security Verification</label>
                    <div className="flex gap-2 mb-2">
                        <div className="bg-zinc-800 rounded-lg overflow-hidden flex-grow flex items-center justify-center h-12" dangerouslySetInnerHTML={{ __html: captchaData.image }} />
                        <button type="button" onClick={loadCaptcha} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-3 rounded-lg transition-colors flex items-center justify-center">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={captchaValue}
                        onChange={(e) => setCaptchaValue(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors"
                        placeholder="Enter characters shown above"
                        required
                        autoComplete="off"
                    />
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-4">
                    Verify Identity
                </button>
            </form>
        ) : (
             <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">One-Time Password (OTP)</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-white transition-colors text-center text-xl tracking-widest font-mono"
                        placeholder="000000"
                        maxLength={6}
                        required
                    />
                    <p className="text-zinc-500 text-xs mt-2 text-center">Enter the 6-digit code sent to your registered email address.</p>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-4">
                    Sign In
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setSuccessMsg(''); loadCaptcha(); }} className="w-full text-zinc-500 text-sm hover:text-white transition-colors mt-2">
                    Back to Login
                </button>
             </form>
        )}

        <div className="mt-6 text-center text-xs text-zinc-600">
            Protected by Diadem Security Systems
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
