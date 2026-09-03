import mongoose from 'mongoose';
import dns from 'node:dns';

// Force Node to use Google DNS for SRV lookups (fixes querySrv ECONNREFUSED
// when the system/ISP DNS does not resolve mongodb+srv records).
dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
}