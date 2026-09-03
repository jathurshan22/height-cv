import type { User } from '../types';
import { api } from './api';

function saveSession(result: any): User {
  localStorage.setItem('height-cv-token', result.token);
  return result.user as User;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (!email.includes('@')) throw new Error('Please enter a valid email address.');
    return saveSession(await api.login({ email, password }));
  },
  async register(name: string, email: string, password: string): Promise<User> {
    if (!name.trim()) throw new Error('Full name is required.');
    if (!email.includes('@')) throw new Error('Please enter a valid email address.');
    return saveSession(await api.register({ name, email, password }));
  },
  async loginWithGoogle(credential: string): Promise<User> {
    if (!credential) throw new Error('Google sign-in did not return a credential.');
    return saveSession(await api.googleLogin(credential));
  },
  async me(): Promise<User> {
    const result = await api.me();
    return result.user as User;
  },
  async logout(): Promise<void> {
    api.logout();
  },
};
