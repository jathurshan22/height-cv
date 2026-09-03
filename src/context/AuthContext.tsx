import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  loginWithGoogle: (credential: string) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthState | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Load logged-in user
   */
  useEffect(() => {
    const expire = () => {
      localStorage.removeItem(
        'height-cv-token'
      );

      localStorage.removeItem(
        'height-ai-user'
      );

      setUser(null);
    };

    const handleUserUpdated = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<
          Partial<User>
        >;

      const updatedUser =
        customEvent.detail;

      if (!updatedUser) {
        return;
      }

      setUser((currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        const mergedUser = {
          ...currentUser,
          ...updatedUser,
        };

        localStorage.setItem(
          'height-ai-user',
          JSON.stringify(mergedUser)
        );

        return mergedUser;
      });
    };

    window.addEventListener(
      'height-ai:session-expired',
      expire
    );

    window.addEventListener(
      'height-ai:user-updated',
      handleUserUpdated
    );

    const token =
      localStorage.getItem(
        'height-cv-token'
      );

    if (!token) {
      setLoading(false);
      return () => {
        window.removeEventListener(
          'height-ai:session-expired',
          expire
        );

        window.removeEventListener(
          'height-ai:user-updated',
          handleUserUpdated
        );
      };
    }

    authService
      .me()
      .then((currentUser) => {
        setUser(currentUser);

        localStorage.setItem(
          'height-ai-user',
          JSON.stringify(currentUser)
        );
      })
      .catch(() => {
        localStorage.removeItem(
          'height-cv-token'
        );

        localStorage.removeItem(
          'height-ai-user'
        );

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      window.removeEventListener(
        'height-ai:session-expired',
        expire
      );

      window.removeEventListener(
        'height-ai:user-updated',
        handleUserUpdated
      );
    };
  }, []);

  /*
   * Login
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ) => {
      setLoading(true);

      try {
        const loggedUser =
          await authService.login(
            email,
            password
          );

        setUser(loggedUser);

        localStorage.setItem(
          'height-ai-user',
          JSON.stringify(loggedUser)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * Register
   */
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ) => {
      setLoading(true);

      try {
        const registeredUser =
          await authService.register(
            name,
            email,
            password
          );

        setUser(registeredUser);

        localStorage.setItem(
          'height-ai-user',
          JSON.stringify(registeredUser)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * Google Login
   */
  const loginWithGoogle =
    useCallback(async (credential: string) => {
      setLoading(true);

      try {
        const googleUser =
          await authService.loginWithGoogle(credential);

        setUser(googleUser);

        localStorage.setItem(
          'height-ai-user',
          JSON.stringify(googleUser)
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /*
   * Logout
   */
  const logout = useCallback(
    async () => {
      await authService.logout();

      setUser(null);

      localStorage.removeItem(
        'height-ai-user'
      );
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}