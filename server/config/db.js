import mongoose from 'mongoose';
import { memoryStore } from './memoryStore.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resumeai', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    memoryStore.setConnected(true);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log(`⚡ Running seamlessly with local memory fallback store.`);
    mongoose.set('bufferCommands', false);
    memoryStore.setConnected(false);
    return false;
  }
};
