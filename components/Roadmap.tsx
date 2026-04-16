
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { storageService } from '../services/storageService';
import { RoadmapStep } from '../types';

const Roadmap: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const [steps, setSteps] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    const load = () => {
      setSteps(storageService.getData().roadmap || []);
    };
    load();
    return storageService.onUpdate(load);
  }, []);

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-4">{t('roadmapTitle')}</h2>
        <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className={`absolute ${isRtl ? 'right-1/2' : 'left-1/2'} top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2`}></div>
        
        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={step.id} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1">
                <div className={`glass-card p-6 rounded-3xl border-white/5 hover:border-indigo-500/50 transition-colors shadow-xl ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{step.date}</span>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <div className="mt-2 inline-flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${step.status === 'Completed' ? 'bg-green-500' : step.status === 'Active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`}></span>
                       <span className="text-[10px] font-bold text-slate-500">{t(`status${step.status}` as any)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 w-12 h-12 bg-slate-900 rounded-2xl border-2 border-indigo-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] transform hover:scale-110 transition-transform">
                {step.icon || '📍'}
              </div>
              
              <div className="flex-1 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
