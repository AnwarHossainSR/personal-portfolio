import { getEnvSafely } from './config';

/**
 * For server-used only
 */
export const MONGODB_URI = getEnvSafely('MONGODB_URI');
export const ACCESS_TOKEN_SECRET = getEnvSafely('ACCESS_TOKEN_SECRET');
export const REFRESH_TOKEN_SECRET = getEnvSafely('REFRESH_TOKEN_SECRET');
export const NODE_ENV = getEnvSafely('NODE_ENV');
