import mongoose from 'mongoose';

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  category: { type: String, default: 'General', index: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model('FaqItem', faqItemSchema);
