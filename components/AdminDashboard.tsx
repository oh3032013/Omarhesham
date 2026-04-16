
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Project, Suggestion, AdminView, AppSettings, RoadmapStep } from '../types';
import { useTranslation } from '../context/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const [view, setView] = useState<AdminView>(AdminView.PROJECTS);
  const [data, setData] = useState(storageService.getData());
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingStep, setEditingStep] = useState<Partial<RoadmapStep> | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const load = () => setData(storageService.getData());
    load();
    return storageService.onUpdate(load);
  }, []);

  const handleProjectSave = async () => {
    if (!editingProject?.title || !editingProject?.mediaUrl) {
      alert(lang === 'ar' ? 'يرجى ملء العنوان ورفع صورة/فيديو' : 'Please fill title and upload media');
      return;
    }
    setSaveStatus('saving');
    try {
      if (editingProject.id) {
        await storageService.updateProject(editingProject as Project);
      } else {
        await storageService.addProject(editingProject as any);
      }
      setSaveStatus('saved');
      setTimeout(() => { setSaveStatus('idle'); setEditingProject(null); }, 1500);
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error.message);
      setTimeout(() => setSaveStatus('idle'), 5000);
      console.error("Save error:", error);
    }
  };

  const handleStepSave = async () => {
    if (!editingStep?.title || !editingStep?.date) return;
    setSaveStatus('saving');
    try {
      if (editingStep.id) {
        await storageService.updateRoadmapStep(editingStep as RoadmapStep);
      } else {
        await storageService.addRoadmapStep(editingStep as any);
      }
      setSaveStatus('saved');
      setTimeout(() => { setSaveStatus('idle'); setEditingStep(null); }, 1000);
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error.message);
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: string) => {
    setSaveStatus('saving');
    try {
      await storageService.updateSettings({ ...data.settings, [key]: value });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error.message);
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string, type: 'image' | 'video') => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(lang === 'ar' ? 'حجم الملف كبير جداً! الحد الأقصى 5 ميجا.' : 'File too large! Max 5MB.');
        return;
      }
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string, isVideo ? 'video' : 'image');
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      {/* Cloud Status Indicator */}
      <div className="mb-8 flex items-center gap-3 glass-card px-6 py-3 rounded-2xl w-fit border-white/5">
        <div className={`w-3 h-3 rounded-full ${storageService.isCloud() ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {storageService.isCloud() ? (lang === 'ar' ? 'متصل بالسحابة' : 'Cloud Connected') : (lang === 'ar' ? 'غير متصل بالسحابة (حفظ محلي فقط)' : 'Cloud Disconnected (Local Only)')}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-4">
          <div className="glass-card p-6 rounded-3xl shadow-xl sticky top-24 border-white/5">
            <h2 className="text-xl font-black text-indigo-400 mb-6 border-b border-white/10 pb-4">{t('adminSidebarTitle')}</h2>
            <div className="space-y-2">
              <button onClick={() => setView(AdminView.PROJECTS)} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${view === AdminView.PROJECTS ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5 text-slate-400'}`}>{t('adminManageProjects')}</button>
              <button onClick={() => setView(AdminView.ROADMAP)} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${view === AdminView.ROADMAP ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5 text-slate-400'}`}>{t('adminManageRoadmap')}</button>
              <button onClick={() => setView(AdminView.SUGGESTIONS)} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${view === AdminView.SUGGESTIONS ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5 text-slate-400'}`}>{t('adminIncomingSuggestions')}</button>
              <button onClick={() => setView(AdminView.SETTINGS)} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${view === AdminView.SETTINGS ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5 text-slate-400'}`}>{t('adminSettings')}</button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {view === AdminView.PROJECTS && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black">{t('adminManageProjects')}</h3>
                <button onClick={() => setEditingProject({ title: '', description: '', mediaUrl: '', mediaType: 'image', category: 'General', link: '' })} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-600/20 transition-all active:scale-95">
                  {t('adminAddProject')} +
                </button>
              </div>

              {editingProject && (
                <div className="glass-card p-8 rounded-[30px] border-indigo-500/40 border-2 animate-in slide-in-from-top-4 shadow-2xl">
                  <h4 className="text-xl font-bold mb-6 text-indigo-300">{editingProject.id ? t('adminEditProject') : t('adminNewProject')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminProjTitle')}</label>
                      <input className="w-full bg-slate-900/80 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminCategory')}</label>
                      <input className="w-full bg-slate-900/80 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminExternalLink')}</label>
                      <input className="w-full bg-slate-900/80 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" placeholder="https://..." value={editingProject.link || ''} onChange={e => setEditingProject({...editingProject, link: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminProjDesc')}</label>
                      <textarea className="w-full bg-slate-900/80 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 h-32" value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
                    </div>
                    
                    {/* Media Upload */}
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminMediaType')}</label>
                      <div className="flex gap-4 mb-4">
                         <button onClick={() => setEditingProject({...editingProject, mediaType: 'image'})} className={`flex-1 py-3 rounded-xl font-bold border ${editingProject.mediaType === 'image' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-white/5'}`}>صورة</button>
                         <button onClick={() => setEditingProject({...editingProject, mediaType: 'video'})} className={`flex-1 py-3 rounded-xl font-bold border ${editingProject.mediaType === 'video' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-white/5'}`}>فيديو</button>
                      </div>
                      <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl text-center bg-white/5">
                        {editingProject.mediaUrl ? (
                          <div className="relative inline-block group">
                            {editingProject.mediaType === 'image' ? (
                              <img src={editingProject.mediaUrl} className="max-h-48 rounded-xl shadow-lg" />
                            ) : (
                              <video src={editingProject.mediaUrl} className="max-h-48 rounded-xl shadow-lg" controls />
                            )}
                            <button onClick={() => setEditingProject({...editingProject, mediaUrl: ''})} className="absolute -top-2 -right-2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center shadow-xl">×</button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <div className="text-4xl mb-2">📁</div>
                            <p className="font-bold">{t('adminUploadImage')}</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, MP4 (Max 5MB)</p>
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={e => handleFileUpload(e, (b64, type) => setEditingProject({...editingProject, mediaUrl: b64, mediaType: type}))} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={handleProjectSave} className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-2xl font-black flex-1 shadow-xl shadow-indigo-600/30 transition-all active:scale-95">
                      {editingProject.id ? 'تحديث المشروع' : t('adminBtnSave')}
                    </button>
                    <button onClick={() => setEditingProject(null)} className="bg-slate-800 hover:bg-slate-700 px-10 py-4 rounded-2xl font-black transition-all">
                      {t('adminBtnClose')}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {data.projects.map(p => (
                  <div key={p.id} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-colors border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                        {p.mediaType === 'image' ? <img src={p.mediaUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🎥</div>}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg">{p.title}</span>
                        <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProject(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all">✎</button>
                      <button onClick={() => { if(confirm(t('confirmDelete'))) storageService.deleteProject(p.id); }} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === AdminView.ROADMAP && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black">{t('adminManageRoadmap')}</h3>
                <button onClick={() => setEditingStep({ title: '', date: '', icon: '📍', status: 'Pending' })} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-600/20">{t('roadmapAddStep')} +</button>
              </div>
              {editingStep && (
                <div className="glass-card p-8 rounded-[30px] border-indigo-500/40 border-2 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">{t('roadmapStepTitle')}</label>
                        <input className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" value={editingStep.title} onChange={e => setEditingStep({...editingStep, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">{t('roadmapStepDate')}</label>
                        <input className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" value={editingStep.date} onChange={e => setEditingStep({...editingStep, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">{t('roadmapStepIcon')}</label>
                        <input className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" placeholder="🚀" value={editingStep.icon} onChange={e => setEditingStep({...editingStep, icon: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">{t('roadmapStepStatus')}</label>
                        <select className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500" value={editingStep.status} onChange={e => setEditingStep({...editingStep, status: e.target.value as any})}>
                            <option value="Completed">{t('statusCompleted')}</option>
                            <option value="Active">{t('statusActive')}</option>
                            <option value="Pending">{t('statusPending')}</option>
                        </select>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={handleStepSave} className="bg-indigo-600 px-10 py-4 rounded-2xl font-black flex-1 shadow-xl shadow-indigo-600/30">{t('adminBtnSave')}</button>
                    <button onClick={() => setEditingStep(null)} className="bg-slate-800 px-10 py-4 rounded-2xl font-black">{t('adminBtnClose')}</button>
                  </div>
                </div>
              )}
              <div className="grid gap-4">
                {(data.roadmap || []).map(step => (
                  <div key={step.id} className="glass-card p-5 rounded-2xl flex items-center justify-between border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">{step.icon}</div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg">{step.title}</span>
                        <span className="text-xs text-slate-500 font-bold">{step.date} • {t(`status${step.status}` as any)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingStep(step)} className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all">✎</button>
                      <button onClick={() => { if(confirm(t('confirmDelete'))) storageService.deleteRoadmapStep(step.id); }} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === AdminView.SETTINGS && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-3xl font-black">{t('adminSettings')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[40px] text-center space-y-6 border-white/5 shadow-2xl">
                   <h4 className="font-black text-xl text-indigo-400">صورة البروفايل الشخصية</h4>
                   <div className="relative inline-block">
                     <img src={data.settings.profileImageUrl} className="w-48 h-48 rounded-[30px] mx-auto object-cover border-4 border-indigo-600 shadow-2xl" />
                     <div className="absolute -bottom-4 -right-4 bg-indigo-600 p-3 rounded-2xl shadow-xl">📸</div>
                   </div>
                   <label className="block bg-white/5 border border-white/10 hover:bg-indigo-600 p-5 rounded-2xl cursor-pointer font-black transition-all shadow-xl group">
                     <span className="group-hover:scale-110 inline-block transition-transform">{t('adminUploadImage')}</span>
                     <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, b64 => updateSetting('profileImageUrl', b64))} />
                   </label>
                </div>

                <div className="glass-card p-8 rounded-[40px] space-y-6 border-white/5 opacity-50 cursor-not-allowed">
                   <h4 className="font-black text-xl text-pink-400">إعدادات إضافية (قريباً)</h4>
                   <div className="space-y-4">
                      <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                      <div className="h-4 bg-white/5 rounded-full w-2/3"></div>
                   </div>
                   <p className="text-xs text-slate-500 font-bold">سيتم إضافة إمكانية تغيير اللوجو وخلفية الـ Hero قريباً.</p>
                </div>
              </div>
            </div>
          )}
          
          {view === AdminView.SUGGESTIONS && (
            <div className="space-y-6">
              <h3 className="text-3xl font-black">{t('adminIncomingSuggestions')}</h3>
              {data.suggestions.length === 0 ? (
                <div className="glass-card p-20 rounded-[40px] text-center border-dashed border-2 border-white/10 text-slate-500 font-bold">
                  لا توجد اقتراحات واردة بعد..
                </div>
              ) : (
                <div className="grid gap-6">
                  {data.suggestions.map(s => (
                    <div key={s.id} className="glass-card p-8 rounded-[30px] border border-white/5 hover:border-indigo-500/20 transition-all shadow-xl">
                       <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                         <div className="flex flex-col">
                            <span className="font-black text-xl text-white">{s.name}</span>
                            <span className="text-indigo-400 font-bold text-sm">{s.email}</span>
                         </div>
                         <span className="text-xs text-slate-500 font-bold bg-white/5 px-3 py-1 rounded-full h-fit">{new Date(s.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <p className="text-slate-300 leading-relaxed font-medium">{s.message}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Saving Toast */}
      {saveStatus !== 'idle' && (
        <div className="fixed bottom-10 left-10 z-[200] animate-in slide-in-from-bottom-10 duration-500">
           <div className={`px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 ${
             saveStatus === 'saving' ? 'bg-indigo-600 animate-pulse' : 
             saveStatus === 'error' ? 'bg-red-600' : 'bg-green-600'
           }`}>
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('adminAutoSaving')}
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>⚠️</span>
                  <div className="flex flex-col">
                    <span>{lang === 'ar' ? 'خطأ في المزامنة!' : 'Sync Error!'}</span>
                    <span className="text-[10px] opacity-70">{errorMessage}</span>
                  </div>
                </>
              ) : (
                <>
                  <span>✓</span>
                  {t('adminSaved')}
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
