
import React, { useState } from 'react';
// Fix: Use namespace import to resolve "no exported member" errors in some environments
import * as ReactRouterDOM from 'react-router-dom';

// Fix: Destructure from namespace to bypass potential named export resolution issues
const { useNavigate } = ReactRouterDOM as any;

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated admin password to @Ms152025
    if (password === '@Ms152025') {
      onLogin();
      navigate('/admin');
    } else {
      setError('كلمة المرور غير صحيحة!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <div className="glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">تسجيل دخول المشرف</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">كلمة المرور</label>
            <input 
              type="password"
              autoFocus
              className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-colors text-right"
              placeholder="أدخل كلمة المرور..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            دخول
          </button>
          <p className="text-center text-xs text-slate-500">ملاحظة: كلمة المرور تم تحديثها من قبل المالك.</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
