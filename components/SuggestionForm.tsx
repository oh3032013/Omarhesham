
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

const SuggestionForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate network delay
    setTimeout(() => {
      storageService.addSuggestion(formData);
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300">الاسم</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            placeholder="مثال: أحمد محمد"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300">البريد الإلكتروني</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            placeholder="example@gmail.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-300">رسالتك / اقتراحك</label>
        <textarea 
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 transition-colors h-32"
          placeholder="اكتب ما يدور في خاطرك هنا..."
        />
      </div>
      
      <button 
        type="submit" 
        disabled={status !== 'idle'}
        className={`w-full gaming-gradient font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 ${status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {status === 'loading' ? 'جاري الإرسال...' : status === 'success' ? 'تم الإرسال بنجاح! شكراً لك' : 'إرسال الاقتراح'}
      </button>
    </form>
  );
};

export default SuggestionForm;
