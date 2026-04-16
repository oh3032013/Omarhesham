
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Skills: React.FC = () => {
  const { t } = useTranslation();
  
  const skills = [
    { name: 'Unity 3D', level: 90, color: '#ffffff' },
    { name: 'C# / .NET', level: 85, color: '#9b4993' },
    { name: 'React.js', level: 80, color: '#61dafb' },
    { name: 'Node.js', level: 75, color: '#339933' },
    { name: 'Firebase', level: 85, color: '#ffca28' },
    { name: 'UI/UX Design', level: 70, color: '#f24e1e' },
  ];

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">{t('skillsTitle')}</h2>
        <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill, i) => (
          <div key={i} className="glass-card p-8 rounded-[30px] border-white/5 group hover:border-indigo-500/50 transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-xl tracking-tighter">{skill.name}</span>
              <span className="text-indigo-400 font-bold">{skill.level}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full gaming-gradient transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <div className="mt-4 flex gap-2">
                {[1,2,3,4,5].map(dot => (
                    <div key={dot} className={`w-2 h-2 rounded-full ${dot <= (skill.level/20) ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
