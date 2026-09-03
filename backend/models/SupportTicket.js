import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, enum: ['account', 'billing', 'cv', 'ai', 'bug', 'other'], default: 'other', index: true },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open', index: true },
  reply: { type: String, default: '' },
  repliedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('SupportTicket', supportTicketSchema);
