
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { storageService } from '../services/storageService';

const { Link, useNavigate, useLocation } = ReactRouterDOM as any;

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  const { t, lang, setLang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = storageService.getData();
    if (data.settings?.logoUrl) setLogo(data.settings.logoUrl);
  }, []);

  const navLinks = [
    { name: t('navHome'), hash: '#' },
    { name: t('navProjects'), hash: '#projects' },
    { name: t('navSuggestions'), hash: '#suggestions' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      if (hash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (hash === '#') {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" onClick={(e: React.MouseEvent) => handleNavClick(e as any, '#')} className="flex items-center gap-3 group">
          {logo ? (
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg group-hover:scale-110 transition-transform" />
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">OX</div>
          )}
          <span className="text-xl font-bold tracking-tight">OmarX <span className="text-indigo-400">Gaming</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <a key={link.name} href={link.hash} onClick={(e) => handleNavClick(e, link.hash)} className="text-slate-300 hover:text-indigo-400 font-medium transition-colors cursor-pointer">{link.name}</a>
            ))}
          </div>
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-xs font-bold bg-white/5 px-3 py-1 rounded-md hover:bg-white/10 transition-colors uppercase">{lang === 'ar' ? 'English' : 'عربي'}</button>
          {isAdmin && <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-full font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20">{t('navAdmin')}</Link>}
        </div>

        <div className="flex items-center gap-2 md:hidden">
           <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors">{lang === 'ar' ? 'EN' : 'AR'}</button>
           <button className="text-slate-300 p-2" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-card border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a key={link.name} href={link.hash} onClick={(e) => handleNavClick(e, link.hash)} className="block text-lg text-slate-300 hover:text-indigo-400">{link.name}</a>
            ))}
            {isAdmin && <Link to="/admin" className="block bg-indigo-600 text-center py-3 rounded-xl font-bold" onClick={() => setIsOpen(false)}>{t('navAdmin')}</Link>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
