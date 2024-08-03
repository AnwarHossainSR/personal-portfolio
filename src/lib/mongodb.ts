import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'your_mongodb_connection_string_here';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cachedClient: mongoose.Mongoose | null = null;
let cachedDbUrl: string | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDbUrl === MONGODB_URI) {
    return cachedClient;
  }

  if (!cachedClient) {
    cachedClient = await mongoose.connect(MONGODB_URI);
    cachedDbUrl = MONGODB_URI;
  }

  return cachedClient;
}
