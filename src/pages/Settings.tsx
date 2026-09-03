import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  User,
  Palette,
  Shield,
  Camera,
  Trash2,
  Save,
  LockKeyhole,
  Check,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTemplates } from '../hooks/useTemplates';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function Settings() {
  const { user, logout } = useAuth();
  const { templates } = useTemplates('all');

  const {
    theme: appTheme,
    setTheme: setAppTheme,
  } = useTheme();

  const toast = useToast();
  const navigate = useNavigate();

  const fileRef =
    useRef<HTMLInputElement>(null);

  const [name, setName] = useState(
    user?.name || ''
  );

  const [email, setEmail] = useState(
    user?.email || ''
  );

  // Theme is controlled only by ThemeContext so the top-right global
  // toggle and this Settings page can never fight over the same value.
  const theme: Theme = appTheme;

  const [defaultTemplate, setDefaultTemplate] =
    useState(
      user?.preferences?.defaultTemplate ||
        'minimal'
    );

  const [language, setLanguage] =
    useState(
      user?.preferences?.language ||
        'English'
    );

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [avatar, setAvatar] =
    useState(user?.avatar || '');

  const [busy, setBusy] =
    useState(false);

  /*
   * Sync user data from AuthContext
   */
  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatar || '');

    setDefaultTemplate(
      user?.preferences?.defaultTemplate ||
        'minimal'
    );

    setLanguage(
      user?.preferences?.language ||
        'English'
    );
  }, [user, appTheme]);

  const initials = (name || 'User')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  /*
   * Save profile
   */
  const saveProfile = async () => {
    try {
      setBusy(true);

      await userService.updateProfile(
        name.trim(),
        email.trim()
      );

      toast(
        'Profile updated successfully',
        'success'
      );
    } catch (error: unknown) {
      toast(
        getErrorMessage(error),
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  /*
   * Save preferences
   */
  const savePrefs = async () => {
    try {
      setBusy(true);

      await userService.updatePreferences({
        theme,
        defaultTemplate,
        language,
      });

      localStorage.setItem(
        'height-cv-preferences',
        JSON.stringify({
          theme,
          defaultTemplate,
          language,
        })
      );

      toast(
        'Preferences saved successfully',
        'success'
      );
    } catch (error: unknown) {
      toast(
        getErrorMessage(error),
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  /*
   * Change password
   */
  const changePassword = async () => {
    if (!currentPassword) {
      toast(
        'Enter your current password',
        'error'
      );
      return;
    }

    if (newPassword.length < 6) {
      toast(
        'New password must be at least 6 characters',
        'error'
      );
      return;
    }

    try {
      setBusy(true);

      await userService.changePassword(
        currentPassword,
        newPassword
      );

      setCurrentPassword('');
      setNewPassword('');

      toast(
        'Password changed successfully',
        'success'
      );
    } catch (error: unknown) {
      toast(
        getErrorMessage(error),
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  /*
   * Profile photo upload
   *
   * Photo is converted to Base64 and stored
   * in MongoDB through /users/avatar.
   */
  const pickPhoto = (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast(
        'Please select an image file',
        'error'
      );

      return;
    }

    if (file.size > 1.8 * 1024 * 1024) {
      toast(
        'Image must be smaller than 1.8 MB',
        'error'
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const image = String(
          reader.result || ''
        );

        if (!image.startsWith('data:image/')) {
          toast(
            'Invalid image file',
            'error'
          );

          return;
        }

        setBusy(true);

        /*
         * Save permanently in MongoDB
         */
        await userService.updateAvatar(
          image
        );

        /*
         * Show immediately in Settings
         */
        setAvatar(image);

        /*
         * Notify other components.
         * AuthContext can listen to this event
         * and update the current user.
         */
        window.dispatchEvent(
  new CustomEvent('height-ai:user-updated', {
    detail: {
      ...user,
      avatar: image,
    },
  })
);

        toast(
          'Profile photo updated successfully',
          'success'
        );
      } catch (error: unknown) {
        toast(
          getErrorMessage(error),
          'error'
        );
      } finally {
        setBusy(false);
      }
    };

    reader.onerror = () => {
      toast(
        'Unable to read image',
        'error'
      );
    };

    reader.readAsDataURL(file);
  };

  /*
   * Delete account
   */
  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Delete your account and all CVs permanently?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);

      await userService.deleteAccount();

      await logout();

      navigate('/');
    } catch (error: unknown) {
      toast(
        getErrorMessage(error),
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account, preferences and security"
    >
      <div className="mx-auto max-w-[1200px] space-y-6">

        {/* PROFILE HEADER */}

        <section className="rounded-[28px] border border-line bg-surface p-7 shadow-sm">
          <div className="flex items-center gap-5">

            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-xl font-extrabold text-white">

              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}

            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink">
                Personalize your experience
              </h1>

              <p className="mt-1 text-sm text-ink-muted">
                Update your profile, CV preferences
                and account security.
              </p>
            </div>

          </div>
        </section>

        {/* PROFILE + PREFERENCES */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* PROFILE */}

          <section className="rounded-[24px] border border-line bg-surface p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-indigo-600" />

              <div>
                <h2 className="font-bold text-ink">
                  Profile
                </h2>

                <p className="text-xs text-ink-muted">
                  Your personal information
                </p>
              </div>
            </div>

            {/* PHOTO */}

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-surface-subtle p-4">

              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-lg font-bold text-white">

                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}

              </div>

              <div className="flex-1">
                <p className="font-bold text-ink">
                  {name || 'Your Name'}
                </p>

                <p className="text-xs text-ink-muted">
                  {email || 'your@email.com'}
                </p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(event) => {
                  void pickPhoto(
                    event.target.files?.[0]
                  );

                  /*
                   * Allows selecting the same photo
                   * again after changing it.
                   */
                  event.currentTarget.value = '';
                }}
              />

              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  fileRef.current?.click()
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
                title="Upload profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>

            </div>

            <div className="mt-5 space-y-4">

              <Input
                label="Full Name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

            </div>

            <Button
              variant="accent"
              className="mt-5"
              disabled={busy}
              onClick={() =>
                void saveProfile()
              }
            >
              <Save className="h-4 w-4" />
              Save Profile
            </Button>

          </section>

          {/* PREFERENCES */}

          <section className="rounded-[24px] border border-line bg-surface p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <Palette className="h-5 w-5 text-indigo-600" />

              <div>
                <h2 className="font-bold text-ink">
                  Preferences
                </h2>

                <p className="text-xs text-ink-muted">
                  Customize your workspace
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              {/* THEME */}

              <div className="block text-sm font-semibold text-ink">
                Theme

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([
                    { value: 'light', label: 'Light', Icon: Sun },
                    { value: 'dark', label: 'Dark', Icon: Moon },
                    { value: 'system', label: 'System', Icon: Monitor },
                  ] as const).map(({ value, label, Icon }) => {
                    const active = theme === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAppTheme(value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                          active
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line bg-surface text-ink-soft hover:bg-surface-subtle'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TEMPLATE */}

              <div className="block text-sm font-semibold text-ink">
                Default CV template

                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {templates.map((template) => {
                    const active =
                      defaultTemplate === template.id;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() =>
                          setDefaultTemplate(template.id)
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                          active
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line bg-surface text-ink-soft hover:bg-surface-subtle'
                        }`}
                      >
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{
                            backgroundColor: template.accent,
                          }}
                        />
                        <span className="truncate">
                          {template.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LANGUAGE */}

              <div className="block text-sm font-semibold text-ink">
                Language

                <Select
                  className="mt-2"
                  ariaLabel="Language"
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Spanish', label: 'Spanish' },
                    { value: 'French', label: 'French' },
                    { value: 'German', label: 'German' },
                  ]}
                />
              </div>

            </div>

            <Button
              variant="accent"
              className="mt-5"
              disabled={busy}
              onClick={() =>
                void savePrefs()
              }
            >
              <Check className="h-4 w-4" />
              Save Preferences
            </Button>

          </section>
        </div>

        {/* SECURITY */}

        <section className="rounded-[24px] border border-line bg-surface p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <LockKeyhole className="h-5 w-5 text-indigo-600" />

            <div>
              <h2 className="font-bold text-ink">
                Security
              </h2>

              <p className="text-xs text-ink-muted">
                Change your account password
              </p>
            </div>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
            />

          </div>

          <Button
            variant="accent"
            className="mt-5"
            disabled={busy}
            onClick={() =>
              void changePassword()
            }
          >
            <Shield className="h-4 w-4" />
            Change Password
          </Button>

        </section>

        {/* DANGER ZONE */}

        <section className="rounded-[24px] border border-red-200 bg-red-50/50 p-6 dark:border-red-900 dark:bg-red-950/20">

          <div className="flex items-start gap-3">

            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />

            <div className="flex-1">

              <h2 className="font-bold text-red-700">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-red-600/80">
                Delete your account and all saved
                CVs permanently.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                void deleteAccount()
              }
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}