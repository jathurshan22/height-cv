import { useEffect, useRef } from 'react';
import { getGoogleClientId, loadGoogleIdentityScript, type GoogleCredentialResponse } from '../services/googleAuth';

// Google Identity Services expects initialize() to be called once per page.
// React StrictMode can mount effects twice during development, so keep the
// initialization state outside the component and only initialize a client ID once.
let initializedClientId = ''; 

interface Props {
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

export function GoogleSignInButton({ onCredential, disabled = false, text = 'continue_with' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;
    const clientId = getGoogleClientId();
    if (!clientId || !containerRef.current || disabled) return;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google?.accounts?.id) return;
        containerRef.current.innerHTML = '';
        if (initializedClientId !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: GoogleCredentialResponse) => callbackRef.current(response.credential),
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          initializedClientId = clientId;
        }
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.max(280, Math.min(520, containerRef.current.clientWidth || 400)),
        });
      })
      .catch(() => {
        // The parent action handles the user-facing error state.
      });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [disabled, text]);

  if (!getGoogleClientId()) {
    return (
      <div className="rounded-xl border border-line bg-surface-soft px-4 py-3 text-center text-sm text-ink-muted">
        Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to .env.
      </div>
    );
  }

  return <div ref={containerRef} className="flex min-h-11 w-full justify-center overflow-hidden" aria-label="Continue with Google" />;
}
