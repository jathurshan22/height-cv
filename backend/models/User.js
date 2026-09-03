import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },
  googleId: { type: String, default: '', index: true, sparse: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active', index: true },
  lastLogin: { type: Date, default: null },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    defaultTemplate: { type: String, default: 'minimal' },
    language: { type: String, default: 'English' }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
