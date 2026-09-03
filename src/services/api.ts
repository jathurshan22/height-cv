const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
// Accept both deployment styles:
//   https://host.example/api
//   https://host.example
// Every API method below uses paths without the /api prefix.
const API_BASE = `${rawApiUrl.replace(/\/+$/, '')}${/\/api$/i.test(rawApiUrl.replace(/\/+$/, '')) ? '' : '/api'}`;

// ================================
// TYPES
// ================================

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string | null;
}

export interface CV {
  _id: string;
  id?: string;
  title: string;
  template: string;
  status: 'draft' | 'published';
  updatedAt: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

export interface Template {
  _id: string;
  name: string;
  slug: string;
  preview?: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  usageCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Public-facing template metadata used by the builder, chooser and landing page
export interface TemplateMeta {
  id: string;
  slug?: string;
  name: string;
  description: string;
  accent: string;
  category?: string;
  isFeatured?: boolean;
}

export interface AuditLog {
  _id: string;
  action: string;
  targetType?: string;
  targetId?: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
  admin?: {
    name: string;
    email: string;
  };
}

export interface AdminStats {
  users: number;
  cvs: number;
  aiRequests: number;
  atsAnalyses: number;
  jobMatches: number;
  published: number;
  blocked: number;
  activeTemplates: number;
}

export interface Analytics {
  aiTotal: number;
  aiSuccess: number;
  aiErrors: number;

  aiByFeature: {
    _id: string;
    count: number;
  }[];

  avgATS: number;
  atsTotal: number;

  avgJobMatch: number;
  jobMatchesTotal: number;

  recentAI: {
    feature: string;
    model: string;
    status: 'success' | 'error';
    tokensUsed?: number;
    responseTime?: number;
    createdAt: string;
    user?: {
      name: string;
      email: string;
    };
  }[];
}

export interface SystemSettings {
  _id?: string;
  key?: string;
  appName: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  aiEnabled: boolean;
  defaultTemplate: string;
  maxCVs: number;
  maxAIRequests: number;
  announcement: string;
}

export interface Faq {
  _id: string;
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

export type TicketCategory =
  | 'account'
  | 'billing'
  | 'cv'
  | 'ai'
  | 'bug'
  | 'other';

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'resolved';

export interface SupportTicket {
  _id: string;
  id: string;
  subject: string;
  category: TicketCategory;
  message: string;
  status: TicketStatus;
  reply?: string;
  repliedAt?: string | null;
  name?: string;
  email?: string;
  user?: { id?: string; name?: string; email?: string };
  createdAt: string;
  updatedAt?: string;
}

export interface ApiMessage {
  message?: string;
  success?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JsonRecord {
  [key: string]: unknown;
}

// ================================
// TOKEN / SESSION
// ================================

export function getToken(): string {
  return localStorage.getItem('height-cv-token') || '';
}

export function clearSession(): void {
  localStorage.removeItem('height-cv-token');
  localStorage.removeItem('height-ai-user');
}

// ================================
// REQUEST HELPER
// ================================

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Unable to reach Height AI server. Please check your connection.'
    );
  }

  const data: unknown = await response.json().catch(() => ({}));

  // Session expired
  if (response.status === 401) {
    clearSession();

    window.dispatchEvent(
      new CustomEvent('height-ai:session-expired')
    );
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}

// ================================
// API
// ================================

export const api = {
  // --------------------------------
  // AUTH
  // --------------------------------

  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: {
    email: string;
    password: string;
  }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  googleLogin: (credential: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  me: async () => {
    const response = await request<{ user: User }>('/auth/me');
    return response;
  },

  logout: () => {
    clearSession();
    return Promise.resolve();
  },

  // --------------------------------
  // USER
  // --------------------------------

  updateProfile: (payload: {
    name: string;
    email: string;
  }) =>
    request<{ user: User; message?: string }>(
      '/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),

  updatePreferences: (payload: JsonRecord) =>
    request<ApiMessage>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) =>
    request<ApiMessage>('/users/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  updateAvatar: (avatar: string) =>
    request<{
      user: User;
      message?: string;
    }>('/users/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar }),
    }),

  deleteAccount: () =>
    request<ApiMessage>('/users/account', {
      method: 'DELETE',
    }),

  // --------------------------------
  // CV
  // --------------------------------

  listCVs: () =>
    request<{ cvs: CV[] }>('/cvs'),

  getCV: (id: string) =>
    request<{ cv: CV }>(`/cvs/${id}`),

  createCV: (payload: JsonRecord = {}) =>
    request<{ cv: CV }>('/cvs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCV: (
    id: string,
    payload: JsonRecord
  ) =>
    request<{ cv: CV }>(`/cvs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteCV: (id: string) =>
    request<ApiMessage>(`/cvs/${id}`, {
      method: 'DELETE',
    }),

  // --------------------------------
  // AI
  // --------------------------------

  ats: (cv: CV | JsonRecord, jobDescription = '') =>
    request<JsonRecord>('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({ cv, jobDescription }),
    }),

  improve: (
    target: string,
    input: string
  ) =>
    request<JsonRecord>('/ai/improve', {
      method: 'POST',
      body: JSON.stringify({
        target,
        input,
      }),
    }),

  jobMatch: (
    cv: CV | JsonRecord,
    jobDescription: string
  ) =>
    request<JsonRecord>('/jobs/match', {
      method: 'POST',
      body: JSON.stringify({
        cv,
        jobDescription,
      }),
    }),

  // --------------------------------
  // TEMPLATES (public)
  // --------------------------------

  // Admin-selected templates for Guest Home, logged-in Home and Create CV
  listFeaturedTemplates: () =>
    request<{ templates: TemplateMeta[] }>('/templates/featured'),

  // Every active template added by admin for Dashboard -> Templates
  listAllTemplates: () =>
    request<{ templates: TemplateMeta[] }>('/templates/all'),

  // Backward-compatible alias: featured templates
  listTemplates: () =>
    request<{ templates: TemplateMeta[] }>('/templates/featured'),

  homeStats: () =>
    request<{
      stats: {
        users: number;
        cvs: number;
        atsScore: number | null;
        totalTemplates: number;
      };
    }>('/home/stats'),

  // --------------------------------
  // SUPPORT
  // --------------------------------

  listFaqs: () =>
    request<{ faqs: Faq[] }>('/support/faqs'),

  myTickets: () =>
    request<{ tickets: SupportTicket[] }>(
      '/support/tickets'
    ),

  createTicket: (payload: {
    subject: string;
    category: TicketCategory;
    message: string;
  }) =>
    request<{ ticket: SupportTicket }>(
      '/support/tickets',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  adminTickets: () =>
    request<{ tickets: SupportTicket[] }>(
      '/support/admin/tickets'
    ),

  adminUpdateTicket: (
    id: string,
    payload: {
      status?: TicketStatus;
      reply?: string;
    }
  ) =>
    request<{ ticket: SupportTicket }>(
      `/support/admin/tickets/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),

  // --------------------------------
  // ADMIN DASHBOARD
  // --------------------------------

  adminStats: () =>
    request<{ stats: AdminStats }>(
      '/admin/stats'
    ),

  adminAnalytics: () =>
    request<{ analytics: Analytics }>(
      '/admin/analytics'
    ),

  // --------------------------------
  // ADMIN USERS
  // --------------------------------

  adminUsers: () =>
    request<{ users: User[] }>(
      '/admin/users'
    ),

  adminUpdateUser: (
    id: string,
    payload: {
      status?: UserStatus;
      role?: UserRole;
    }
  ) =>
    request<{
      user?: User;
      message?: string;
    }>(
      `/admin/users/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),

  adminDeleteUser: (id: string) =>
    request<ApiMessage>(
      `/admin/users/${id}`,
      {
        method: 'DELETE',
      }
    ),

  // --------------------------------
  // ADMIN CVS
  // --------------------------------

  adminCVs: () =>
    request<{ cvs: CV[] }>(
      '/admin/cvs'
    ),

  adminDeleteCV: (id: string) =>
    request<ApiMessage>(
      `/admin/cvs/${id}`,
      {
        method: 'DELETE',
      }
    ),

  // --------------------------------
  // ADMIN TEMPLATES
  // --------------------------------

  adminTemplates: () =>
    request<{ templates: Template[] }>(
      '/admin/templates'
    ),

  adminCreateTemplate: (
    payload: {
      name: string;
      slug: string;
      preview?: string;
      category: string;
      isActive: boolean;
      isFeatured: boolean;
    }
  ) =>
    request<{ template: Template }>(
      '/admin/templates',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  adminUpdateTemplate: (
    id: string,
    payload: Partial<{
      name: string;
      slug: string;
      preview: string;
      category: string;
      isActive: boolean;
      isFeatured: boolean;
    }>
  ) =>
    request<{ template: Template }>(
      `/admin/templates/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),

  adminDeleteTemplate: (id: string) =>
    request<ApiMessage>(
      `/admin/templates/${id}`,
      {
        method: 'DELETE',
      }
    ),

  // --------------------------------
  // ADMIN LOGS
  // --------------------------------

  adminLogs: () =>
    request<{ logs: AuditLog[] }>(
      '/admin/logs'
    ),

  // --------------------------------
  // ADMIN SETTINGS
  // --------------------------------

  adminSettings: () =>
    request<{ settings: SystemSettings }>(
      '/admin/settings'
    ),

  adminUpdateSettings: (
    payload: SystemSettings
  ) =>
    request<{
      settings?: SystemSettings;
      message?: string;
    }>(
      '/admin/settings',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),
};