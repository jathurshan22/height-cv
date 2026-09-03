import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const { login, loginWithGoogle, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // The page the user was trying to open before being sent to login.
  const from = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('john.carter@email.com');
  const [password, setPassword] = useState('password123');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!email.includes('@')) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      toast('Welcome back!', 'success');
      const storedUser = JSON.parse(localStorage.getItem('height-ai-user') || 'null');
      if (storedUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // Go back to the page the user came from, else land on the dashboard.
        navigate(from || '/dashboard', { replace: true });
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Login failed', 'error');
    }
  };

  const onGoogle = async (credential: string) => {
    try {
      await loginWithGoogle(credential);
      toast('Signed in with Google', 'success');
      navigate(from || '/dashboard', { replace: true });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Google sign-in failed', 'error');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building your CV.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <div>
          <Input
            label="Password"
            name="password"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="mt-1 ml-2 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {show ? 'Hide' : 'Show'} password
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            Remember me
          </label>
          <a href="#" className="text-sm font-medium text-accent hover:text-accent-hover">Forgot password?</a>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
          Login
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">or continue with</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <GoogleSignInButton onCredential={onGoogle} disabled={loading} text="continue_with" />

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-accent hover:text-accent-hover">Register</Link>
      </p>
    </AuthLayout>
  );
}
