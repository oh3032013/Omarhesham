
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { storageService } from '../services/storageService';

const Hero: React.FC = () => {
  const { t, lang } = useTranslation();
  const [data, setData] = useState(storageService.getData());

  useEffect(() => {
    const update = () => setData(storageService.getData());
    const cleanup = storageService.onUpdate(update);
    return cleanup;
  }, []);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { label: t('statsProjects'), value: data.projects.length + 5, suffix: '+' },
    { label: t('statsExperience'), value: 4, suffix: '' },
    { label: t('statsClients'), value: 50, suffix: '+' },
  ];
  
  return (
    <section className="relative overflow-hidden pt-12 pb-24 min-h-[90vh] flex items-center">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-600/10 blur-[120px] rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-right">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-48 h-48 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-white/5 p-2 shadow-2xl relative z-10">
              <img 
                src={data.settings?.profileImageUrl} 
                alt="Omar Hesham" 
                className="w-full h-full object-cover rounded-2xl bg-slate-800"
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 text-indigo-400 px-6 py-2 rounded-full font-bold text-sm tracking-wide animate-pulse">
              {t('heroWelcome')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black leading-tight">
              {lang === 'ar' ? 'أنا ' : "I'm "}<span className="text-transparent bg-clip-text gaming-gradient">{t('heroName')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl font-medium">
              {t('heroBio')}
            </p>
            
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5 my-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-right">
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}{stat.suffix}</div>
                  <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-5">
              <a href="https://www.youtube.com/@omarxgaming123" target="_blank" className="bg-red-600 hover:bg-red-700 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:-translate-y-2 shadow-xl shadow-red-600/30">
                <span>{t('heroYoutubeBtn')}</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <button 
                onClick={scrollToProjects}
                className="glass-card hover:bg-white/10 px-10 py-5 rounded-2xl font-bold border border-white/10 transition-all transform hover:-translate-y-2 shadow-xl"
              >
                {t('heroProjectsBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
