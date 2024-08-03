// lib/mongoose.ts
import mongoose from 'mongoose';

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  const dbUri = process.env.MONGODB_URI || '';
  await mongoose.connect(dbUri);

  isConnected = true;
};

export { connectToDatabase, mongoose };
