import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import SystemSettings from '../models/SystemSettings.js';

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar || undefined, role: user.role || 'user' };
}

export async function register(req, res) {
  const config = await SystemSettings.findOne({key:'global'});
  if (config && !config.registrationEnabled) return res.status(403).json({message:'Registration is currently disabled.'});
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  const normalized = email.trim().toLowerCase();
  if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'An account with this email already exists' });
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalized, password: hash, role: process.env.ADMIN_EMAIL && normalized === process.env.ADMIN_EMAIL.trim().toLowerCase() ? 'admin' : 'user' });
  res.status(201).json({ user: publicUser(user), token: signToken(user._id) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  if (user.status === 'blocked') return res.status(403).json({ message: 'This account has been blocked. Please contact support.' });
  user.lastLogin = new Date(); await user.save();
  res.json({ user: publicUser(user), token: signToken(user._id) });
}

export async function me(req, res) { res.json({ user: publicUser(req.user) }); }
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body || {};
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

    if (!clientId) {
      return res.status(503).json({
        message: 'Google sign-in is not configured on the server. Add GOOGLE_CLIENT_ID to backend/.env.',
      });
    }

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ message: 'Google credential is required.' });
    }

    // Google Identity Services returns a signed ID token. Google validates the
    // token and returns its verified claims through tokeninfo; we additionally
    // enforce the audience and email verification before creating a session.
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!googleResponse.ok) {
      return res.status(401).json({ message: 'Invalid Google sign-in credential.' });
    }

    const claims = await googleResponse.json();
    const audience = String(claims.aud || '');
    const email = String(claims.email || '').trim().toLowerCase();
    const googleId = String(claims.sub || '').trim();

    if (audience !== clientId) {
      return res.status(401).json({ message: 'Google sign-in audience mismatch.' });
    }

    if (claims.email_verified !== 'true' || !email || !googleId) {
      return res.status(401).json({ message: 'Your Google account email could not be verified.' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user?.status === 'blocked') {
      return res.status(403).json({ message: 'This account has been blocked. Please contact support.' });
    }

    const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.trim().toLowerCase();

    if (!user) {
      user = await User.create({
        name: String(claims.name || claims.given_name || 'Google User').trim().slice(0, 100),
        email,
        avatar: String(claims.picture || ''),
        googleId,
        role: isAdmin ? 'admin' : 'user',
        lastLogin: new Date(),
      });
    } else {
      // Link Google to an existing email/password account instead of creating
      // a duplicate account when the email address is the same.
      user.googleId = googleId;
      if (!user.avatar && claims.picture) user.avatar = String(claims.picture);
      if (isAdmin) user.role = 'admin';
      user.lastLogin = new Date();
      await user.save();
    }

    return res.json({ user: publicUser(user), token: signToken(user._id) });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Google sign-in could not be completed. Please try again.' });
  }
}
