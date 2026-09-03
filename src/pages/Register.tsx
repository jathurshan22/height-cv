import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Register() {
  const { register, loginWithGoogle, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // Preserve the page the user was heading to (if they came via a gated button).
  const from = (location.state as { from?: string } | null)?.from;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name) e.name = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!email.includes('@')) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await register(name, email, password);
      toast('Account created. Welcome to Height CV!', 'success');
      navigate(from || '/dashboard', { replace: true });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Registration failed', 'error');
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
    <AuthLayout title="Create your account" subtitle="Start building ATS-friendly CVs in minutes.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          placeholder="John Carter"
          icon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
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
            autoComplete="new-password"
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
        <Input
          label="Confirm Password"
          name="confirm"
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">or sign up with</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <GoogleSignInButton onCredential={onGoogle} disabled={loading} text="signup_with" />

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent hover:text-accent-hover">Login</Link>
      </p>
    </AuthLayout>
  );
}
