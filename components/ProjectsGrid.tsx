
import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Project } from '../types';
import { useTranslation } from '../context/LanguageContext';

const { Link } = ReactRouterDOM as any;

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(projects.map(p => p.category))];
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, search, activeFilter]);

  return (
    <div className="space-y-12">
      {/* Search and Filter UI */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card p-6 rounded-3xl border-white/5 shadow-xl">
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeFilter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {cat === 'All' ? t('filterAll') : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-400 font-bold">{t('projectsEmpty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link 
              to={`/project/${project.id}`} 
              key={project.id} 
              className="glass-card rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={project.mediaUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4 bg-indigo-600/90 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">
                  {project.category}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1 relative">
                <div className="absolute -top-6 right-8 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors line-clamp-1 mt-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-tighter">
                  <span>{t('projectView')}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;
