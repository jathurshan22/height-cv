import { api } from './api';

export const adminService = {
  // Dashboard
  stats: () => api.adminStats(),

  analytics: () => api.adminAnalytics(),

  // Users
  users: () => api.adminUsers(),

  updateUser: (
    id: string,
    payload: {
      status?: 'active' | 'blocked';
      role?: 'user' | 'admin';
    }
  ) => api.adminUpdateUser(id, payload),

  deleteUser: (id: string) =>
    api.adminDeleteUser(id),

  // CVs
  cvs: () => api.adminCVs(),

  deleteCV: (id: string) =>
    api.adminDeleteCV(id),

  // Templates
  templates: () =>
    api.adminTemplates(),

  createTemplate: (payload: {
    name: string;
    slug: string;
    preview?: string;
    category: string;
    isActive: boolean;
    isFeatured: boolean;
  }) =>
    api.adminCreateTemplate(payload),

  updateTemplate: (
    id: string,
    payload: {
      name?: string;
      slug?: string;
      preview?: string;
      category?: string;
      isActive?: boolean;
      isFeatured?: boolean;
    }
  ) =>
    api.adminUpdateTemplate(id, payload),

  deleteTemplate: (id: string) =>
    api.adminDeleteTemplate(id),

  // Logs
  logs: () =>
    api.adminLogs(),

  // Settings
  settings: () =>
    api.adminSettings(),

  updateSettings: (payload: {
    appName: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    aiEnabled: boolean;
    defaultTemplate: string;
    maxCVs: number;
    maxAIRequests: number;
    announcement: string;
  }) =>
    api.adminUpdateSettings(payload),
};