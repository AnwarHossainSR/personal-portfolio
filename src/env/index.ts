import { getEnvSafely } from './config';

/**
 * For server-used only
 */
export const MONGODB_URI = getEnvSafely('MONGODB_URI');
export const JWT_SECRET_KEY = getEnvSafely('JWT_SECRET_KEY');
export const NODE_ENV = getEnvSafely('NODE_ENV');
export const SITE_URL = getEnvSafely('SITE_URL');
