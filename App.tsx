
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { storageService } from './services/storageService';
import { Project } from './types';
import { LanguageProvider, useTranslation } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsGrid from './components/ProjectsGrid';
import SuggestionForm from './components/SuggestionForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import AIAssistant from './components/AIAssistant';
import Roadmap from './components/Roadmap';
import IdeaGenerator from './components/IdeaGenerator';

const { HashRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM as any;

const AchievementToast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
      <div className="glass-card px-6 py-3 rounded-full border-green-500/50 flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-lg">🏆</div>
        <div>
          <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">إنجاز جديد!</p>
          <p className="text-sm font-black">{message}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRtl } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const load = () => {
      const data = storageService.getData();
      const found = data.projects.find(p => p.id === id);
      if (found) setProject(found);
    };
    load();
    return storageService.onUpdate(load);
  }, [id]);

  if (!project) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">{t('projectsEmpty')}</h2>
      <Link to="/" className="text-indigo-400 mt-4 inline-block">{t('projectBack')}</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <svg className={`w-5 h-5 transition-transform group-hover:${isRtl ? 'translate-x-1' : '-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M13 5l7 7-7 7M5 12h14" : "M11 19l-7-7 7-7M19 12H5"} />
        </svg>
        {t('projectBack')}
      </button>

      <div className="glass-card rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
        <div className="relative h-[400px] md:h-[600px]">
          {project.mediaType === 'image' ? (
            <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <video src={project.mediaUrl} className="w-full h-full object-cover" controls autoPlay muted loop />
          )}
          <div className="absolute top-8 left-8">
            <span className="bg-indigo-600 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-8 md:p-16 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className="text-4xl md:text-6xl font-black text-white">
              {project.title}
            </h1>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[20px] font-black transition-all shadow-xl shadow-indigo-600/30 text-center transform hover:-translate-y-1 active:scale-95"
              >
                {t('projectVisit')}
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{t('projectCategory')}</p>
              <p className="font-black text-xl text-indigo-400">{project.category}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{t('projectDate')}</p>
              <p className="font-black text-xl">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-xl leading-relaxed whitespace-pre-wrap font-medium">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const update = () => setProjects(storageService.getData().projects);
    update();
    return storageService.onUpdate(update);
  }, []);

  return (
    <div className="space-y-32 pb-32">
      <Hero />
      
      {/* New Interactive Sections */}
      <IdeaGenerator />
      <Roadmap />

      <section id="projects" className="container mx-auto px-4 scroll-mt-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black">{t('projectsTitle')}</h2>
          <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <ProjectsGrid projects={projects} />
      </section>

      <section id="suggestions" className="container mx-auto px-4 max-w-5xl scroll-mt-24">
        <div className="glass-card rounded-[40px] p-8 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">{t('suggestionsTitle')}</h2>
            <p className="text-slate-400 text-center mb-16 text-lg max-w-2xl mx-auto">{t('suggestionsSubtitle')}</p>
            <SuggestionForm />
          </div>
        </div>
      </section>
    </div>
  );
};

const Layout: React.FC<{ isAdmin: boolean; setIsAdmin: (v: boolean) => void }> = ({ isAdmin, setIsAdmin }) => {
  const { t, lang } = useTranslation();
  const [achievement, setAchievement] = useState({ show: false, msg: '' });

  useEffect(() => {
    // Welcome Achievement
    const timer = setTimeout(() => {
        setAchievement({ show: true, msg: lang === 'ar' ? 'مرحباً بك في عالمنا!' : 'Welcome to our world!' });
        setTimeout(() => setAchievement({ show: false, msg: '' }), 5000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <div className="min-h-screen selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      <Navbar isAdmin={isAdmin} />
      
      <AchievementToast show={achievement.show} message={achievement.msg} />

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard /> : <Login onLogin={() => setIsAdmin(true)} />} 
          />
        </Routes>
      </main>

      <AIAssistant />
      
      <footer className="bg-slate-900 border-t border-white/5 py-20 text-center relative">
        <div className="container mx-auto px-4">
          <div className="text-3xl font-black mb-10 tracking-tighter">OmarX <span className="text-indigo-400">Gaming</span></div>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a href="https://www.youtube.com/@omarxgaming123" target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all font-bold uppercase tracking-widest text-sm group">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
               YouTube
            </a>
            <a href="https://web.facebook.com/omar1elshekhaby" target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all font-bold uppercase tracking-widest text-sm group">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               Facebook
            </a>
          </div>
          <div className="w-16 h-1 bg-white/5 mx-auto mb-8 rounded-full"></div>
          
          <div className="flex items-center justify-center gap-4">
            <p className="text-slate-600 font-bold text-sm">{t('footerRights', { year: new Date().getFullYear() })}</p>
            <Link to="/login" className="text-slate-800 hover:text-indigo-400 transition-colors p-2" title="Admin Login">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = storageService.init(() => {
      setIsLoaded(true);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-black tracking-widest animate-pulse">OMARX GAMING</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <HashRouter>
        <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
