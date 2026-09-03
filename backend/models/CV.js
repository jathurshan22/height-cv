import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'Untitled CV' },
  template: { type: String, default: 'professional' },
  personalInfo: {
    fullName: { type: String, default: '' },
    professionalTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  summary: { type: String, default: '' },
  workExperience: { type: [mongoose.Schema.Types.Mixed], default: [] },
  education: { type: [mongoose.Schema.Types.Mixed], default: [] },
  skills: { type: [String], default: [] },
  projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
  certifications: { type: [mongoose.Schema.Types.Mixed], default: [] },
  languages: { type: [mongoose.Schema.Types.Mixed], default: [] },
  achievements: { type: [mongoose.Schema.Types.Mixed], default: [] },
  references: { type: [mongoose.Schema.Types.Mixed], default: [] },
  atsScore: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  lastAutosavedAt: { type: Date, default: null }
}, { timestamps: true, minimize: false });

export default mongoose.model('CV', cvSchema);
