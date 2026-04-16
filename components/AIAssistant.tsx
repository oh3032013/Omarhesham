
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from '../context/LanguageContext';

const AIAssistant: React.FC = () => {
  const { t, lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") {
        console.error("GEMINI_API_KEY is missing! Make sure to set it in your environment or .env file before building.");
        setMessages(prev => [...prev, { role: 'bot', text: "Configuration Error: API Key is missing. Please check the console for instructions. 🛠️" }]);
        setIsTyping(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are OX-Bot, the official AI assistant for Omar Hesham (OmarX Gaming). 
          Omar is a YouTuber (OmarX Gaming), game developer (Unity, C#), and web developer. 
          Be friendly, energetic, and professional. Use emojis. Keep answers concise. 
          Respond in the same language as the user (${lang}). 
          Tell them to check his YouTube channel if they ask for his social media.`,
        }
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I missed that. Can you repeat?" }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal lost! 📡 Try again in a bit." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="glass-card w-[350px] h-[500px] rounded-[30px] flex flex-col shadow-2xl border-indigo-500/30 overflow-hidden animate-in zoom-in duration-300">
          <div className="gaming-gradient p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">🤖</div>
              <span className="font-black text-sm tracking-tight">{t('aiChatTitle')}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none text-xs text-slate-300 max-w-[80%]">
              {t('chatGreeting')}
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tl-none' : 'bg-white/5 text-slate-300 rounded-tr-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-indigo-400 animate-pulse">OX-Bot is thinking...</div>}
          </div>

          <div className="p-4 bg-slate-900 border-t border-white/5 flex gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-indigo-500"
              placeholder={t('aiChatPlaceholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-indigo-600 p-2 rounded-xl">
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-110 transition-all transform hover:rotate-12 group"
        >
          <div className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">AI</div>
          <svg className="w-8 h-8 text-white group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
