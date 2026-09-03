export type ID = string;

export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface WorkExperience {
  id: ID;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: ID;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: ID;
  name: string;
  link: string;
  description: string;
  technologies: string;
}

export interface Certification {
  id: ID;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: ID;
  name: string;
  proficiency: string;
}

export interface Achievement {
  id: ID;
  title: string;
  description: string;
}

export interface Reference {
  id: ID;
  name: string;
  relationship: string;
  contact: string;
}

export interface CVData {
  id: ID;
  title: string;
  template: string;
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  references: Reference[];
  updatedAt: string;
  atsScore: number;
  status?: 'draft' | 'published';
  lastAutosavedAt?: string | null;
}

export interface ATSBreakdown {
  formatting: number;
  keywords: number;
  skills: number;
  experience: number;
  education: number;
  sections: number;
}

export interface ATSAnalysis {
  score: number;
  breakdown: ATSBreakdown;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: string[];
  analysisMode?: 'ai' | 'local-fallback';
}

export interface JobMatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  recommendations: string[];
  analysisMode?: 'ai' | 'local-fallback';
  experienceMatch?: number;
  educationMatch?: number;
  projectMatch?: number;
  responsibilityMatch?: number;
  matchedResponsibilities?: string[];
  missingResponsibilities?: string[];
}

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'blocked';
  preferences?: { theme?: 'light' | 'dark' | 'system'; defaultTemplate?: string; language?: string };
}


export interface AdminStats { users:number; cvs:number; blocked:number; published:number; drafts:number; aiRequests:number; atsAnalyses:number; jobMatches:number; activeTemplates:number; }
export interface AdminUser { id:string; name:string; email:string; avatar?:string; role:'user'|'admin'; status:'active'|'blocked'; createdAt:string; lastLogin?:string|null; }
export interface AdminCV { _id:string; title:string; template:string; status:'draft'|'published'; updatedAt:string; user?:{name:string;email:string}; }
