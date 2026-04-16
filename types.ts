
export interface Project {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  link?: string;
  category: string;
  createdAt: number;
}

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  date: string;
  icon: string;
  status: 'Completed' | 'Active' | 'Pending';
}

export interface AppSettings {
  profileImageUrl: string;
  logoUrl?: string;
  heroBgUrl?: string;
}

export interface AppData {
  projects: Project[];
  suggestions: Suggestion[];
  settings: AppSettings;
  roadmap: RoadmapStep[];
}

export enum AdminView {
  PROJECTS = 'PROJECTS',
  SUGGESTIONS = 'SUGGESTIONS',
  SETTINGS = 'SETTINGS',
  ROADMAP = 'ROADMAP'
}

export type Language = 'ar' | 'en';
