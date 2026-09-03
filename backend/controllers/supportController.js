import FaqItem from '../models/FaqItem.js';
import SupportTicket from '../models/SupportTicket.js';
import AuditLog from '../models/AuditLog.js';

const mapTicket = (t) => ({
  id: t._id,
  _id: t._id,
  subject: t.subject,
  category: t.category,
  message: t.message,
  status: t.status,
  reply: t.reply,
  repliedAt: t.repliedAt,
  name: t.name,
  email: t.email,
  user: t.user && t.user.name ? { id: t.user._id, name: t.user.name, email: t.user.email } : undefined,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt
});

const mapFaq = (f) => ({
  id: f._id,
  _id: f._id,
  question: f.question,
  answer: f.answer,
  category: f.category,
  order: f.order
});

// ---- FAQs (read for any signed-in user) ----
export async function listFaqs(req, res) {
  const faqs = await FaqItem.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ faqs: faqs.map(mapFaq) });
}

// ---- Tickets (user) ----
export async function createTicket(req, res) {
  const { subject, category, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }
  const ticket = await SupportTicket.create({
    user: req.user._id,
    name: req.user.name,
    email: req.user.email,
    subject,
    category: category || 'other',
    message
  });
  res.status(201).json({ ticket: mapTicket(ticket) });
}

export async function myTickets(req, res) {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ tickets: tickets.map(mapTicket) });
}

// ---- Tickets (admin) ----
export async function allTickets(req, res) {
  const tickets = await SupportTicket.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ tickets: tickets.map(mapTicket) });
}

export async function updateTicket(req, res) {
  const { status, reply } = req.body;
  const update = {};
  if (status) update.status = status;
  if (typeof reply === 'string') { update.reply = reply; update.repliedAt = new Date(); }
  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate('user', 'name email');
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  await AuditLog.create({ admin: req.user._id, action: 'support.update', targetType: 'SupportTicket', targetId: String(ticket._id), description: `Updated support ticket "${ticket.subject}"` }).catch(() => {});
  res.json({ ticket: mapTicket(ticket) });
}
