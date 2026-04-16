
import { AppData, Project, Suggestion, AppSettings, RoadmapStep } from '../types';
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";

const STORAGE_KEY = 'omarx_gaming_data_v2';

const firebaseConfig = {
  apiKey: "AIzaSyDeVdb13xjQDWEXNbJvglrtb6qCbO7nX54",
  authDomain: "omarxgaming-de7c4.firebaseapp.com",
  projectId: "omarxgaming-de7c4",
  storageBucket: "omarxgaming-de7c4.firebasestorage.app",
  messagingSenderId: "562801643710",
  appId: "1:562801643710:web:a98980de6c116ff3d38eef"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let firebaseReady = false;
let cloudUnsubscribe: (() => void) | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  firebaseReady = true;
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
}

const initialData: AppData = {
  projects: [
    {
      id: '1',
      title: 'مشروع تطوير لعبة RPG',
      description: 'لعبة مغامرات ثنائية الأبعاد تعتمد على قصة ملحمية.',
      mediaUrl: 'https://picsum.photos/800/450?random=1',
      mediaType: 'image',
      category: 'Games',
      createdAt: Date.now(),
      link: 'https://www.youtube.com/@omarxgaming123'
    }
  ],
  suggestions: [],
  settings: {
    profileImageUrl: 'https://picsum.photos/400/400?random=10',
    logoUrl: '',
    heroBgUrl: ''
  },
  roadmap: [
    { id: 'r1', title: 'بداية رحلة اليوتيوب', date: '2021', icon: '🚀', status: 'Completed' },
    { id: 'r2', title: 'إطلاق أول لعبة متكاملة', date: '2022', icon: '🎮', status: 'Completed' },
    { id: 'r3', title: 'بناء هذا الموقع المتطور', date: '2023-2024', icon: '💻', status: 'Active' },
    { id: 'r4', title: 'مشروع اللعبة الكبرى القادم', date: 'قريباً', icon: '🔥', status: 'Pending' },
  ]
};

let currentData: AppData = initialData;

export const storageService = {
  isCloud: () => firebaseReady && db !== null,

  getData: (): AppData => {
    return currentData;
  },

  init: (callback: (data: AppData) => void) => {
    // Load from local storage first for speed
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentData = JSON.parse(saved);
      callback(currentData);
    } else {
      callback(initialData);
    }

    if (!storageService.isCloud()) return;

    // Setup the single cloud listener if not already active
    if (!cloudUnsubscribe) {
      try {
        const docRef = doc(db!, "app", "main_data");
        cloudUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const newData = docSnap.data() as AppData;
            if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
              currentData = newData;
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
              window.dispatchEvent(new Event('storage_updated'));
              callback(newData);
            }
          } else {
            setDoc(docRef, initialData).catch(console.error);
          }
        }, (error) => {
          console.error("Cloud sync error:", error);
        });
      } catch (e) {
        console.error("Failed to start cloud listener:", e);
      }
    }

    return cloudUnsubscribe;
  },

  saveData: async (data: AppData): Promise<void> => {
    // Update local state first
    currentData = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_updated'));

    if (storageService.isCloud()) {
      try {
        const cleanData = JSON.parse(JSON.stringify(data));
        const docRef = doc(db!, "app", "main_data");
        await setDoc(docRef, cleanData);
        console.log("Cloud Save Success");
      } catch (error: any) {
        console.error("Cloud Save Error:", error.message);
        // Throw error so the UI knows the cloud sync failed
        throw new Error(error.message);
      }
    } else {
      console.warn("Firebase not initialized, saving locally only.");
      throw new Error("Firebase not connected");
    }
  },

  onUpdate: (callback: () => void) => {
    const handler = () => callback();
    window.addEventListener('storage_updated', handler);
    return () => window.removeEventListener('storage_updated', handler);
  },

  addProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<void> => {
    const data = storageService.getData();
    const newProject: Project = { ...project, id: crypto.randomUUID(), createdAt: Date.now() };
    data.projects.unshift(newProject);
    await storageService.saveData(data);
  },

  updateProject: async (project: Project): Promise<void> => {
    const data = storageService.getData();
    const index = data.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      data.projects[index] = project;
      await storageService.saveData(data);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    const data = storageService.getData();
    data.projects = data.projects.filter(p => p.id !== id);
    await storageService.saveData(data);
  },

  addRoadmapStep: async (step: Omit<RoadmapStep, 'id'>): Promise<void> => {
    const data = storageService.getData();
    const newStep: RoadmapStep = { ...step, id: crypto.randomUUID() };
    if (!data.roadmap) data.roadmap = [];
    data.roadmap.push(newStep);
    await storageService.saveData(data);
  },

  updateRoadmapStep: async (step: RoadmapStep): Promise<void> => {
    const data = storageService.getData();
    const index = data.roadmap.findIndex(s => s.id === step.id);
    if (index !== -1) {
      data.roadmap[index] = step;
      await storageService.saveData(data);
    }
  },

  deleteRoadmapStep: async (id: string): Promise<void> => {
    const data = storageService.getData();
    data.roadmap = (data.roadmap || []).filter(s => s.id !== id);
    await storageService.saveData(data);
  },

  addSuggestion: async (suggestion: Omit<Suggestion, 'id' | 'createdAt'>): Promise<void> => {
    const data = storageService.getData();
    const newSuggestion: Suggestion = { ...suggestion, id: crypto.randomUUID(), createdAt: Date.now() };
    data.suggestions.unshift(newSuggestion);
    await storageService.saveData(data);
  },

  updateSettings: async (settings: AppSettings): Promise<void> => {
    const data = storageService.getData();
    data.settings = settings;
    await storageService.saveData(data);
  }
};
