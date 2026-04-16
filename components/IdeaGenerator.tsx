
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from '../context/LanguageContext';

const IdeaGenerator: React.FC = () => {
  const { t, lang } = useTranslation();
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateIdea = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") {
        setIdea(lang === 'ar' ? "خطأ: مفتاح الـ API مفقود. تأكد من إعداده قبل الرفع." : "Error: API Key is missing. Check configuration.");
        setIsLoading(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me a unique and short game idea (title, genre, and 1-sentence hook). Keep it creative.",
        config: {
            systemInstruction: `You are a creative game design consultant. Provide ideas in ${lang === 'ar' ? 'Arabic' : 'English'}. Keep it under 50 words.`
        }
      });
      setIdea(response.text || "Try again for a better roll! 🎲");
    } catch (err) {
      setIdea("Failed to connect to the brain hive. 🧠");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="glass-card rounded-[40px] p-8 md:p-16 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px]"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-right">
            <h2 className="text-4xl md:text-5xl font-black">{t('ideaGenTitle')}</h2>
            <p className="text-slate-400 text-lg">{t('ideaGenDesc')}</p>
            <button 
              onClick={generateIdea}
              disabled={isLoading}
              className={`bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 active:scale-95 ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
            >
              {isLoading ? '🎲 Thinking...' : t('ideaGenBtn')}
            </button>
          </div>

          <div className="flex-1 w-full min-h-[200px] bg-slate-900/50 rounded-[30px] border border-white/5 p-8 flex items-center justify-center text-center">
            {idea ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <p className="text-xl md:text-2xl font-bold text-indigo-400 leading-relaxed italic">
                  "{idea}"
                </p>
              </div>
            ) : (
              <div className="text-slate-600 font-bold uppercase tracking-widest">
                {lang === 'ar' ? 'اضغط لتوليد الفكرة' : 'Click to generate'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdeaGenerator;
