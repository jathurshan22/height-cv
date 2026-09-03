import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Activity,
  BarChart3,
  Ban,
  Bot,
  CheckCircle2,
  Clock3,
  Crown,
  FileText,
  LayoutTemplate,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Search,
  ScrollText,
  Settings,
  ShieldCheck,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  X,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Select } from '../components/ui/Select';
import { adminService } from '../services/adminService';

import {
  type AdminStats,
  type Analytics,
  type AuditLog,
  type CV,
  type SystemSettings,
  type Template,
  type User,
} from '../services/api';

import { useToast } from '../context/ToastContext';

type Tab =
  | 'overview'
  | 'users'
  | 'cvs'
  | 'templates'
  | 'analytics'
  | 'logs'
  | 'settings';

const emptyStats: AdminStats = {
  users: 0,
  cvs: 0,
  aiRequests: 0,
  atsAnalyses: 0,
  jobMatches: 0,
  published: 0,
  blocked: 0,
  activeTemplates: 0,
};


function getCVStatus(cv: CV): string {
  const value = (cv as unknown as { status?: unknown }).status;
  return typeof value === 'string' ? value : 'draft';
}

function getCVTemplate(cv: CV): string {
  const value = (cv as unknown as { template?: unknown }).template;
  return typeof value === 'string' ? value : '';
}

function getCVOwner(cv: CV): { name: string; email: string } {
  const owner = (cv as unknown as {
    user?: unknown;
  }).user;

  if (owner && typeof owner === 'object') {
    const value = owner as { name?: unknown; email?: unknown };
    return {
      name: typeof value.name === 'string' ? value.name : 'Unknown user',
      email: typeof value.email === 'string' ? value.email : '—',
    };
  }

  return { name: 'Unknown user', email: '—' };
}

const emptySettings: SystemSettings = {
  appName: 'Height AI',
  maintenanceMode: false,
  registrationEnabled: true,
  aiEnabled: true,
  defaultTemplate: 'minimal',
  maxCVs: 20,
  maxAIRequests: 100,
  announcement: '',
};

export function AdminDashboard() {
  const toast = useToast();

  const [tab, setTab] =
    useState<Tab>('overview');

  const [stats, setStats] =
    useState<AdminStats>(emptyStats);

  const [users, setUsers] =
    useState<User[]>([]);

  const [cvs, setCVs] =
    useState<CV[]>([]);

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [settings, setSettings] =
    useState<SystemSettings>(emptySettings);

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [cvStatusFilter, setCvStatusFilter] =
    useState<'all' | 'draft' | 'published'>('all');

  const [logActionFilter, setLogActionFilter] =
    useState('all');

  const [logTargetFilter, setLogTargetFilter] =
    useState('all');

  const [logAdminFilter, setLogAdminFilter] =
    useState('all');

  const [templateModal, setTemplateModal] =
    useState(false);

  const [editingTemplate, setEditingTemplate] =
    useState<Template | null>(null);

  const [templateForm, setTemplateForm] =
    useState({
      name: '',
      slug: '',
      preview: '',
      category: 'professional',
      isActive: true,
      isFeatured: false,
    });

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [
        statsResponse,
        usersResponse,
        cvsResponse,
        templatesResponse,
        logsResponse,
        settingsResponse,
        analyticsResponse,
      ] = await Promise.all([
        adminService.stats(),
        adminService.users(),
        adminService.cvs(),
        adminService.templates(),
        adminService.logs(),
        adminService.settings(),
        adminService.analytics(),
      ]);

      setStats(
        statsResponse.stats || emptyStats
      );

      setUsers(
        usersResponse.users || []
      );

      setCVs(
        cvsResponse.cvs || []
      );

      setTemplates(
        templatesResponse.templates || []
      );

      setLogs(
        logsResponse.logs || []
      );

      setSettings({
        ...emptySettings,
        ...(settingsResponse.settings || {}),
      });

      setAnalytics(
        analyticsResponse.analytics || null
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Unable to load admin data',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const userFiltered = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [users, search]
  );

  const cvFiltered = useMemo(
    () =>
      cvs.filter((cv) => {
        const matchesSearch = `${cv.title} ${
          cv.user?.name || ''
        } ${cv.user?.email || ''} ${
          getCVTemplate(cv)
        }`
          .toLowerCase()
          .includes(search.toLowerCase());

        const status = getCVStatus(cv).toLowerCase();

        const matchesStatus =
          cvStatusFilter === 'all' ||
          status === cvStatusFilter;

        return matchesSearch && matchesStatus;
      }),
    [cvs, search, cvStatusFilter]
  );

  const templateFiltered = useMemo(
    () =>
      templates.filter((template) =>
        `${template.name} ${template.slug} ${template.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [templates, search]
  );

  const updateUser = async (
    id: string,
    payload: {
      status?: 'active' | 'blocked';
      role?: 'user' | 'admin';
    }
  ) => {
    try {
      await adminService.updateUser(
        id,
        payload
      );

      await load();

      toast(
        'User updated successfully',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'User update failed',
        'error'
      );
    }
  };

  const deleteUser = async (
    id: string
  ) => {
    if (
      !confirm(
        'Delete this user and all their CVs?'
      )
    ) {
      return;
    }

    try {
      await adminService.deleteUser(id);

      await load();

      toast(
        'User deleted successfully',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'User deletion failed',
        'error'
      );
    }
  };

  const deleteCV = async (
    id: string
  ) => {
    if (
      !confirm(
        'Delete this CV permanently?'
      )
    ) {
      return;
    }

    try {
      await adminService.deleteCV(id);

      await load();

      toast(
        'CV deleted successfully',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'CV deletion failed',
        'error'
      );
    }
  };

  const openCreateTemplate = () => {
    setEditingTemplate(null);

    setTemplateForm({
      name: '',
      slug: '',
      preview: '',
      category: 'professional',
      isActive: true,
      isFeatured: false,
    });

    setTemplateModal(true);
  };

  const openEditTemplate = (
    template: Template
  ) => {
    setEditingTemplate(template);

    setTemplateForm({
      name: template.name,
      slug: template.slug,
      preview: template.preview || '',
      category: template.category,
      isActive: template.isActive,
      isFeatured: template.isFeatured,
    });

    setTemplateModal(true);
  };

  const saveTemplate = async () => {
    if (
      !templateForm.name.trim() ||
      !templateForm.slug.trim()
    ) {
      toast(
        'Template name and slug are required',
        'error'
      );

      return;
    }

    try {
      if (editingTemplate) {
        await adminService.updateTemplate(
          editingTemplate._id,
          templateForm
        );
      } else {
        await adminService.createTemplate(
          templateForm
        );
      }

      setTemplateModal(false);

      await load();

      toast(
        editingTemplate
          ? 'Template updated'
          : 'Template created',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Template save failed',
        'error'
      );
    }
  };

  const deleteTemplate = async (
    id: string
  ) => {
    if (
      !confirm(
        'Delete this template?'
      )
    ) {
      return;
    }

    try {
      await adminService.deleteTemplate(id);

      await load();

      toast(
        'Template deleted',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Template delete failed',
        'error'
      );
    }
  };

  const saveSettings = async () => {
    try {
      await adminService.updateSettings(
        settings
      );

      await load();

      toast(
        'System settings saved',
        'success'
      );
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Settings update failed',
        'error'
      );
    }
  };

  const tabs: {
    id: Tab;
    label: string;
    icon: typeof Users;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: ShieldCheck,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
    },
    {
      id: 'cvs',
      label: 'CV Management',
      icon: FileText,
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: LayoutTemplate,
    },
    {
      id: 'analytics',
      label: 'AI & Analytics',
      icon: BarChart3,
    },
    {
      id: 'logs',
      label: 'Audit Logs',
      icon: ScrollText,
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
    },
  ];

  const cards = [
    ['Users', stats.users, Users],
    ['CVs', stats.cvs, FileText],
    [
      'AI Requests',
      stats.aiRequests,
      Bot,
    ],
    [
      'ATS Analyses',
      stats.atsAnalyses,
      ShieldCheck,
    ],
    [
      'Job Matches',
      stats.jobMatches,
      Crown,
    ],
    [
      'Published CVs',
      stats.published,
      CheckCircle2,
    ],
    [
      'Blocked Users',
      stats.blocked,
      Ban,
    ],
    [
      'Active Templates',
      stats.activeTemplates,
      Palette,
    ],
  ] as const;

  const logActions = useMemo(
    () =>
      Array.from(
        new Set(logs.map((log) => log.action).filter(Boolean))
      ).sort(),
    [logs]
  );

  const logTargets = useMemo(
    () =>
      Array.from(
        new Set(logs.map((log) => log.targetType).filter(Boolean))
      ).sort(),
    [logs]
  );

  const logAdmins = useMemo(
    () =>
      Array.from(
        new Set(
          logs
            .map((log) => log.admin?.email || log.admin?.name)
            .filter(Boolean)
        )
      ).sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const adminValue = log.admin?.email || log.admin?.name || '';

      const matchesSearch =
        !query ||
        [
          log.action,
          log.targetType,
          log.targetId,
          log.description,
          log.ipAddress,
          log.admin?.name,
          log.admin?.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesAction =
        logActionFilter === 'all' ||
        log.action === logActionFilter;

      const matchesTarget =
        logTargetFilter === 'all' ||
        log.targetType === logTargetFilter;

      const matchesAdmin =
        logAdminFilter === 'all' ||
        adminValue === logAdminFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesTarget &&
        matchesAdmin
      );
    });
  }, [
    logs,
    search,
    logActionFilter,
    logTargetFilter,
    logAdminFilter,
  ]);

  return (
    <DashboardLayout
      title="Admin Control Center"
      subtitle="Manage users, CVs, AI, analytics and platform settings"
      actions={
        <button
          onClick={() => void load()}
          className="rounded-xl border border-line bg-surface p-2 text-ink-soft hover:bg-surface-subtle"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      }
    >
      <div className="space-y-6">

        {/* TABS */}

        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-line bg-surface p-2 shadow-sm">
          {tabs.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setSearch('');
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  tab === id
                    ? 'bg-ink text-white'
                    : 'text-ink-soft hover:bg-surface-subtle'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center text-ink-muted">
            Loading admin data...
          </div>
        ) : (
          <>
            {/* OVERVIEW */}

            {tab === 'overview' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {cards.map(
                    ([
                      label,
                      value,
                      Icon,
                    ]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
                      >
                        <Icon className="h-5 w-5 text-accent" />

                        <p className="mt-4 text-sm text-ink-muted">
                          {label}
                        </p>

                        <p className="text-3xl font-extrabold text-ink">
                          {value}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">

                  <div className="rounded-2xl border border-line bg-surface p-6">
                    <h2 className="font-bold text-ink">
                      System health
                    </h2>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />

                      <span className="font-semibold text-ink">
                        Online
                      </span>

                      <span className="text-sm text-ink-muted">
                        API + database
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-surface p-6">
                    <h2 className="font-bold text-ink">
                      ATS average
                    </h2>

                    <p className="mt-3 text-3xl font-extrabold text-ink">
                      {analytics?.avgATS ?? 0}%
                    </p>

                    <p className="text-sm text-ink-muted">
                      {analytics?.atsTotal ?? 0}{' '}
                      analyses
                    </p>
                  </div>

                  <div className="rounded-2xl border border-line bg-surface p-6">
                    <h2 className="font-bold text-ink">
                      Job match average
                    </h2>

                    <p className="mt-3 text-3xl font-extrabold text-ink">
                      {analytics?.avgJobMatch ?? 0}%
                    </p>

                    <p className="text-sm text-ink-muted">
                      {analytics?.jobMatchesTotal ?? 0}{' '}
                      matches
                    </p>
                  </div>

                </div>

                {settings.announcement && (
                  <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm text-ink">
                    <b>Announcement:</b>{' '}
                    {settings.announcement}
                  </div>
                )}
              </>
            )}

            {/* USERS */}

            {tab === 'users' && (
              <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">

                <div className="border-b border-line p-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />

                    <input
                      className="input pl-9"
                      placeholder="Search users..."
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-subtle text-xs uppercase text-ink-muted">
                      <tr>
                        <th className="p-4">
                          User
                        </th>

                        <th className="p-4">
                          Role
                        </th>

                        <th className="p-4">
                          Status
                        </th>

                        <th className="p-4">
                          Joined
                        </th>

                        <th className="p-4">
                          Last Login
                        </th>

                        <th className="p-4">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {userFiltered.map(
                        (user) => (
                          <tr
                            key={user.id}
                            className="border-t border-line"
                          >
                            <td className="p-4">
                              <b className="text-ink">
                                {user.name}
                              </b>

                              <div className="text-xs text-ink-muted">
                                {user.email}
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="inline-flex rounded-lg border border-line bg-surface p-0.5 text-xs">
                                {(['user', 'admin'] as const).map(
                                  (role) => {
                                    const active =
                                      user.role === role;
                                    return (
                                      <button
                                        key={role}
                                        type="button"
                                        onClick={() =>
                                          void updateUser(
                                            user.id,
                                            { role },
                                          )
                                        }
                                        className={`rounded-md px-2.5 py-1 font-semibold capitalize transition ${
                                          active
                                            ? 'bg-accent-soft text-accent'
                                            : 'text-ink-muted hover:text-ink'
                                        }`}
                                      >
                                        {role}
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </td>

                            <td className="p-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  user.status ===
                                  'blocked'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>

                            <td className="p-4 text-xs text-ink-muted">
                              {new Date(
                                user.createdAt
                              ).toLocaleDateString()}
                            </td>

                            <td className="p-4 text-xs text-ink-muted">
                              {user.lastLogin
                                ? new Date(
                                    user.lastLogin
                                  ).toLocaleString()
                                : 'Never'}
                            </td>

                            <td className="p-4">
                              <div className="flex gap-2">
                                {user.status ===
                                'blocked' ? (
                                  <button
                                    title="Unblock"
                                    onClick={() =>
                                      void updateUser(
                                        user.id,
                                        {
                                          status:
                                            'active',
                                        }
                                      )
                                    }
                                    className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    title="Block"
                                    onClick={() =>
                                      void updateUser(
                                        user.id,
                                        {
                                          status:
                                            'blocked',
                                        }
                                      )
                                    }
                                    className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                                  >
                                    <Ban className="h-4 w-4" />
                                  </button>
                                )}

                                <button
                                  title="Delete"
                                  onClick={() =>
                                    void deleteUser(
                                      user.id
                                    )
                                  }
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* CVS */}

            {tab === 'cvs' && (
              <div className="space-y-5">

                {/* CV summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="Total CVs"
                    value={cvs.length}
                  />
                  <Metric
                    label="Published"
                    value={
                      cvs.filter(
                        (cv) =>
                          getCVStatus(cv).toLowerCase() ===
                          'published'
                      ).length
                    }
                  />
                  <Metric
                    label="Drafts"
                    value={
                      cvs.filter(
                        (cv) =>
                          getCVStatus(cv).toLowerCase() ===
                          'draft'
                      ).length
                    }
                  />
                  <Metric
                    label="Visible results"
                    value={cvFiltered.length}
                  />
                </div>

                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">

                  {/* Search / filters */}
                  <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full max-w-xl">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />

                      <input
                        className="input pl-9"
                        placeholder="Search CV title, owner, email or template..."
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Select
                        className="min-w-[160px]"
                        ariaLabel="Filter by status"
                        value={cvStatusFilter}
                        onChange={(v) =>
                          setCvStatusFilter(
                            v as 'all' | 'draft' | 'published',
                          )
                        }
                        options={[
                          { value: 'all', label: 'All statuses' },
                          { value: 'published', label: 'Published' },
                          { value: 'draft', label: 'Draft' },
                        ]}
                      />

                      <button
                        onClick={() => {
                          setSearch('');
                          setCvStatusFilter('all');
                        }}
                        className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-bold text-ink-soft hover:bg-surface-subtle"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {cvFiltered.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="mx-auto h-10 w-10 text-ink-muted" />
                      <h3 className="mt-4 font-bold text-ink">
                        No CVs found
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Try changing the search or status filter.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-surface-subtle text-xs uppercase text-ink-muted">
                          <tr>
                            <th className="p-4">CV</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Template</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Updated</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cvFiltered.map((cv) => {
                            const status = getCVStatus(cv).toLowerCase();

                            return (
                              <tr
                                key={cv._id}
                                className="border-t border-line transition hover:bg-surface-subtle/60"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                                      <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="max-w-[260px] truncate font-bold text-ink">
                                        {cv.title || 'Untitled CV'}
                                      </p>

                                      <p className="text-xs text-ink-muted">
                                        ID: {cv._id}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4">
                                  <div className="flex items-center gap-3">                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                                      {String(getCVOwner(cv).name || 'U')
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="max-w-[190px] truncate font-semibold text-ink">
                                        {getCVOwner(cv).name}
                                      </p>

                                      <p className="max-w-[220px] truncate text-xs text-ink-muted">
                                        {getCVOwner(cv).email}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4">
                                  <span className="rounded-lg bg-surface-subtle px-2.5 py-1 text-xs font-bold text-ink-soft">
                                    {getCVTemplate(cv) || 'Default'}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                                      status === 'published'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        status === 'published'
                                          ? 'bg-emerald-500'
                                          : 'bg-amber-500'
                                      }`}
                                    />
                                    {status === 'published'
                                      ? 'Published'
                                      : 'Draft'}
                                  </span>
                                </td>

                                <td className="p-4">
                                <div className="flex items-center gap-2 text-xs text-ink-muted">
  <Clock3 className="h-4 w-4" />
  {cv.updatedAt
    ? new Date(cv.updatedAt).toLocaleString()
    : '—'}
</div>
                                </td>

                                <td className="p-4">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      title="Delete CV"
                                      onClick={() =>
                                        void deleteCV(cv._id)
                                      }
                                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* TEMPLATES */}

            {tab === 'templates' && (
              <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />

                    <input
                      className="input pl-9"
                      placeholder="Search templates..."
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <button
                    onClick={
                      openCreateTemplate
                    }
                    className="btn-accent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Template
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {templateFiltered.map(
                    (template) => (
                      <div
                        key={
                          template._id
                        }
                        className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <h3 className="font-bold text-ink">
                              {
                                template.name
                              }
                            </h3>

                            <p className="text-xs text-ink-muted">
                              {
                                template.category
                              }{' '}
                              ·{' '}
                              {
                                template.usageCount
                              }{' '}
                              uses
                            </p>
                          </div>

                          <button
                            title="Toggle active"
                            onClick={() =>
                              void adminService
                                .updateTemplate(
                                  template._id,
                                  {
                                    isActive:
                                      !template.isActive,
                                  }
                                )
                                .then(
                                  () =>
                                    void load()
                                )
                            }
                          >
                            {template.isActive ? (
                              <ToggleRight className="h-7 w-7 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="h-7 w-7 text-ink-muted" />
                            )}
                          </button>
                        </div>

                        {template.preview && (
                          <img
                            src={
                              template.preview
                            }
                            alt=""
                            className="mt-4 h-28 w-full rounded-xl border border-line object-cover"
                          />
                        )}

                        {template.isFeatured && (
                          <span className="mt-4 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                            Shown on Home + Create CV
                          </span>
                        )}

                        <div className="mt-5 flex gap-2">
                          <button
                            onClick={() =>
                              openEditTemplate(
                                template
                              )
                            }
                            className="btn flex-1"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              void deleteTemplate(
                                template._id
                              )
                            }
                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* ANALYTICS */}

            {tab === 'analytics' && (
              <div className="space-y-4">

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric
                    label="AI success"
                    value={
                      analytics?.aiSuccess ??
                      0
                    }
                  />

                  <Metric
                    label="AI errors"
                    value={
                      analytics?.aiErrors ??
                      0
                    }
                  />

                  <Metric
                    label="ATS analyses"
                    value={
                      analytics?.atsTotal ??
                      0
                    }
                  />

                  <Metric
                    label="Job matches"
                    value={
                      analytics?.jobMatchesTotal ??
                      0
                    }
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">

                  <section className="rounded-2xl border border-line bg-surface p-6">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-accent" />

                      <h2 className="font-bold text-ink">
                        AI usage by feature
                      </h2>
                    </div>

                    <div className="mt-5 space-y-3">
                      {analytics?.aiByFeature?.map(
                        (item) => (
                          <div
                            key={
                              item._id
                            }
                            className="flex items-center justify-between rounded-xl bg-surface-subtle p-3"
                          >
                            <span className="text-sm font-semibold text-ink">
                              {
                                item._id
                              }
                            </span>

                            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
                              {
                                item.count
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-line bg-surface p-6">
                    <h2 className="font-bold text-ink">
                      Recent AI activity
                    </h2>

                    <div className="mt-5 space-y-3">
                      {analytics?.recentAI?.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={`${item.createdAt}-${index}`}
                            className="rounded-xl bg-surface-subtle p-3"
                          >
                            <div className="flex justify-between gap-3">
                              <b className="text-sm text-ink">
                                {
                                  item.feature
                                }
                              </b>

                              <span className="text-xs text-ink-muted">
                                {new Date(
                                  item.createdAt
                                ).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-xs text-ink-muted">
                              {
                                item
                                  .user
                                  ?.email
                              }{' '}
                              ·{' '}
                              {
                                item.model
                              }{' '}
                              ·{' '}
                              {
                                item.status
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </section>

                </div>
              </div>
            )}

            {/* LOGS */}

            {tab === 'logs' && (
              <div className="space-y-5">

                {/* Log overview */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric
                    label="Total Logs"
                    value={logs.length}
                  />

                  <Metric
                    label="Showing"
                    value={filteredLogs.length}
                  />

                  <Metric
                    label="Actions"
                    value={logActions.length}
                  />

                  <Metric
                    label="Admins"
                    value={logAdmins.length}
                  />
                </div>

                <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">

                  {/* Toolbar */}
                  <div className="border-b border-line p-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />

                          <input
                            className="input pl-9"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(event) =>
                              setSearch(event.target.value)
                            }
                          />
                        </div>

                        <Select
                          className="min-w-[150px]"
                          ariaLabel="Filter by action"
                          value={logActionFilter}
                          onChange={setLogActionFilter}
                          options={[
                            { value: 'all', label: 'All actions' },
                            ...logActions.map((action) => ({
                              value: action,
                              label: action.replace(/_/g, ' '),
                            })),
                          ]}
                        />

                        <Select
                          className="min-w-[150px]"
                          ariaLabel="Filter by target"
                          value={logTargetFilter}
                          onChange={setLogTargetFilter}
                          options={[
                            { value: 'all', label: 'All targets' },
                            ...logTargets
                              .filter((t): t is string => Boolean(t))
                              .map((target) => ({
                                value: target,
                                label: target,
                              })),
                          ]}
                        />

                        <Select
                          className="min-w-[150px]"
                          ariaLabel="Filter by admin"
                          value={logAdminFilter}
                          onChange={setLogAdminFilter}
                          options={[
                            { value: 'all', label: 'All admins' },
                            ...logAdmins
                              .filter((a): a is string => Boolean(a))
                              .map((admin) => ({
                                value: admin,
                                label: admin,
                              })),
                          ]}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            setLogActionFilter('all');
                            setLogTargetFilter('all');
                            setLogAdminFilter('all');
                          }}
                          className="btn"
                        >
                          Reset
                        </button>

                        <button
                          type="button"
                          onClick={() => void load()}
                          className="btn-accent"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto lg:block">
                    {filteredLogs.length === 0 ? (
                      <div className="p-14 text-center">
                        <ScrollText className="mx-auto h-10 w-10 text-ink-muted" />

                        <h3 className="mt-4 font-bold text-ink">
                          No audit logs found
                        </h3>

                        <p className="mt-1 text-sm text-ink-muted">
                          Try changing your search or filters.
                        </p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-line bg-surface-subtle">
                          <tr>
                            <th className="p-4 font-bold text-ink-muted">
                              Action
                            </th>

                            <th className="p-4 font-bold text-ink-muted">
                              Target
                            </th>

                            <th className="p-4 font-bold text-ink-muted">
                              Description
                            </th>

                            <th className="p-4 font-bold text-ink-muted">
                              Admin
                            </th>

                            <th className="p-4 font-bold text-ink-muted">
                              IP Address
                            </th>

                            <th className="p-4 font-bold text-ink-muted">
                              Date
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-line">
                          {filteredLogs.map((log) => {
                            const action = log.action || 'unknown';
                            const isDanger =
                              action.includes('delete') ||
                              action.includes('block');

                            const isSuccess =
                              action.includes('create') ||
                              action.includes('update') ||
                              action.includes('unblock');

                            return (
                              <tr
                                key={log._id}
                                className="transition hover:bg-surface-subtle"
                              >
                                <td className="p-4">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                                      isDanger
                                        ? 'bg-red-100 text-red-700'
                                        : isSuccess
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-accent-soft text-accent'
                                    }`}
                                  >
                                    {action.replace(/_/g, ' ')}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <div>
                                    <p className="font-semibold text-ink">
                                      {log.targetType || '—'}
                                    </p>

                                    <p className="mt-1 max-w-[180px] truncate text-xs text-ink-muted">
                                      {log.targetId || '—'}
                                    </p>
                                  </div>
                                </td>

                                <td className="max-w-[320px] p-4">
                                  <p className="line-clamp-2 text-sm text-ink-soft">
                                    {log.description || '—'}
                                  </p>
                                </td>

                                <td className="p-4">
                                  <p className="font-semibold text-ink">
                                    {log.admin?.name || 'Unknown'}
                                  </p>

                                  <p className="mt-1 text-xs text-ink-muted">
                                    {log.admin?.email || '—'}
                                  </p>
                                </td>

                                <td className="p-4 font-mono text-xs text-ink-muted">
                                  {log.ipAddress || '—'}
                                </td>

                                <td className="whitespace-nowrap p-4 text-xs text-ink-muted">
                                  {log.createdAt
                                    ? new Date(
                                        log.createdAt
                                      ).toLocaleString()
                                    : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-line lg:hidden">
                    {filteredLogs.length === 0 ? (
                      <div className="p-12 text-center">
                        <ScrollText className="mx-auto h-10 w-10 text-ink-muted" />

                        <h3 className="mt-4 font-bold text-ink">
                          No audit logs found
                        </h3>
                      </div>
                    ) : (
                      filteredLogs.map((log) => {
                        const action = log.action || 'unknown';
                        const isDanger =
                          action.includes('delete') ||
                          action.includes('block');

                        return (
                          <article
                            key={log._id}
                            className="p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                                  isDanger
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-accent-soft text-accent'
                                }`}
                              >
                                {action.replace(/_/g, ' ')}
                              </span>

                              <span className="text-right text-[11px] text-ink-muted">
                                {log.createdAt
                                  ? new Date(
                                      log.createdAt
                                    ).toLocaleString()
                                  : '—'}
                              </span>
                            </div>

                            <p className="mt-3 text-sm text-ink-soft">
                              {log.description || 'No description'}
                            </p>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded-xl bg-surface-subtle p-3">
                                <p className="text-ink-muted">
                                  Admin
                                </p>
                                <p className="mt-1 truncate font-bold text-ink">
                                  {log.admin?.name || 'Unknown'}
                                </p>
                              </div>

                              <div className="rounded-xl bg-surface-subtle p-3">
                                <p className="text-ink-muted">
                                  Target
                                </p>
                                <p className="mt-1 truncate font-bold text-ink">
                                  {log.targetType || '—'}
                                </p>
                              </div>

                              <div className="rounded-xl bg-surface-subtle p-3">
                                <p className="text-ink-muted">
                                  Target ID
                                </p>
                                <p className="mt-1 truncate font-mono text-ink">
                                  {log.targetId || '—'}
                                </p>
                              </div>

                              <div className="rounded-xl bg-surface-subtle p-3">
                                <p className="text-ink-muted">
                                  IP Address
                                </p>
                                <p className="mt-1 truncate font-mono text-ink">
                                  {log.ipAddress || '—'}
                                </p>
                              </div>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* SETTINGS */}

            {tab === 'settings' && (
              <section className="max-w-4xl rounded-2xl border border-line bg-surface p-6 shadow-sm">

                <div className="space-y-5">

                  <label className="block">
                    <span className="label">
                      Application name
                    </span>

                    <input
                      className="input"
                      value={
                        settings.appName
                      }
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          appName:
                            event.target
                              .value,
                        })
                      }
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">

                    {[
                      [
                        'maintenanceMode',
                        'Maintenance mode',
                      ],
                      [
                        'registrationEnabled',
                        'Registration enabled',
                      ],
                      [
                        'aiEnabled',
                        'AI features enabled',
                      ],
                    ].map(
                      ([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center justify-between rounded-xl bg-surface-subtle p-4"
                        >
                          <span className="text-sm font-semibold text-ink">
                            {label}
                          </span>

                          <input
                            type="checkbox"
                            checked={Boolean(
                              settings[
                                key as keyof SystemSettings
                              ]
                            )}
                            onChange={(
                              event
                            ) =>
                              setSettings({
                                ...settings,
                                [key]:
                                  event
                                    .target
                                    .checked,
                              })
                            }
                            className="h-5 w-5 accent-indigo-600"
                          />
                        </label>
                      )
                    )}

                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">

                    <label>
                      <span className="label">
                        Default template
                      </span>

                      <input
                        className="input"
                        value={
                          settings.defaultTemplate
                        }
                        onChange={(
                          event
                        ) =>
                          setSettings({
                            ...settings,
                            defaultTemplate:
                              event
                                .target
                                .value,
                          })
                        }
                      />
                    </label>

                    <label>
                      <span className="label">
                        Max CVs / user
                      </span>

                      <input
                        type="number"
                        min="1"
                        className="input"
                        value={
                          settings.maxCVs
                        }
                        onChange={(
                          event
                        ) =>
                          setSettings({
                            ...settings,
                            maxCVs:
                              Number(
                                event
                                  .target
                                  .value
                              ),
                          })
                        }
                      />
                    </label>

                    <label>
                      <span className="label">
                        Max AI requests
                      </span>

                      <input
                        type="number"
                        min="1"
                        className="input"
                        value={
                          settings.maxAIRequests
                        }
                        onChange={(
                          event
                        ) =>
                          setSettings({
                            ...settings,
                            maxAIRequests:
                              Number(
                                event
                                  .target
                                  .value
                              ),
                          })
                        }
                      />
                    </label>

                  </div>

                  <label className="block">
                    <span className="label">
                      Announcement
                    </span>

                    <textarea
                      className="input min-h-28"
                      value={
                        settings.announcement
                      }
                      onChange={(
                        event
                      ) =>
                        setSettings({
                          ...settings,
                          announcement:
                            event
                              .target
                              .value,
                        })
                      }
                    />
                  </label>

                  <button
                    onClick={() =>
                      void saveSettings()
                    }
                    className="btn-accent"
                  >
                    <Save className="h-4 w-4" />
                    Save System Settings
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* TEMPLATE MODAL */}

      {templateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-extrabold text-ink">
                  {editingTemplate
                    ? 'Edit template'
                    : 'Add template'}
                </h2>

                <p className="text-sm text-ink-muted">
                  Control which CV templates users can access and choose up to 6 to show on the Home page.
                </p>
              </div>

              <button
                onClick={() =>
                  setTemplateModal(
                    false
                  )
                }
                className="rounded-lg p-2 text-ink-muted hover:bg-surface-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">

              <label>
                <span className="label">
                  Name
                </span>

                <input
                  className="input"
                  value={
                    templateForm.name
                  }
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      name:
                        event.target
                          .value,
                    })
                  }
                />
              </label>

              <label>
                <span className="label">
                  Slug
                </span>

                <input
                  className="input"
                  value={
                    templateForm.slug
                  }
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      slug:
                        event.target
                          .value,
                    })
                  }
                />
              </label>

              <label>
                <span className="label">
                  Category
                </span>

                <input
                  className="input"
                  value={
                    templateForm.category
                  }
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      category:
                        event.target
                          .value,
                    })
                  }
                />
              </label>

              <label>
                <span className="label">
                  Preview URL
                </span>

                <input
                  className="input"
                  value={
                    templateForm.preview
                  }
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      preview:
                        event.target
                          .value,
                    })
                  }
                />
              </label>

              <div className="flex gap-3">

                <label className="flex flex-1 items-center justify-between rounded-xl bg-surface-subtle p-3 text-sm font-semibold text-ink">
                  Active

                  <input
                    type="checkbox"
                    checked={
                      templateForm.isActive
                    }
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        isActive:
                          event.target
                            .checked,
                      })
                    }
                  />
                </label>

                <label className="flex flex-1 items-center justify-between rounded-xl bg-surface-subtle p-3 text-sm font-semibold text-ink">
                  Show on Home (max 6)

                  <input
                    type="checkbox"
                    checked={
                      templateForm.isFeatured
                    }
                    onChange={(event) =>
                      setTemplateForm({
                        ...templateForm,
                        isFeatured:
                          event.target
                            .checked,
                      })
                    }
                  />
                </label>

              </div>

              <button
                onClick={() =>
                  void saveTemplate()
                }
                className="btn-accent w-full"
              >
                <Save className="h-4 w-4" />
                Save Template
              </button>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm text-ink-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-ink">
        {value}
      </p>
    </div>
  );
}