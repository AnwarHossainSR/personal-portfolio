import { getEnvSafely } from './config';

/**
 * For server-used only
 */
const MONGODB_URI = getEnvSafely('MONGODB_URI');
const ACCESS_TOKEN_SECRET = getEnvSafely('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = getEnvSafely('REFRESH_TOKEN_SECRET');
const NODE_ENV = getEnvSafely('NODE_ENV');
const NEXTAUTH_SECRET = getEnvSafely('NEXTAUTH_SECRET');

const env = {
  MONGODB_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  NODE_ENV,
  NEXTAUTH_SECRET,
};

export default env;
