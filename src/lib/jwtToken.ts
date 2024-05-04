import type { JWTPayload } from 'jose';
import { SignJWT, jwtVerify } from 'jose';

import { JWT_SECRET_KEY } from '@/env';

export const createJwtToken = async (payload: JWTPayload) => {
  const secret = new TextEncoder().encode(JWT_SECRET_KEY);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // Algorithm for token signing
    .setIssuedAt() // Set token issuance time
    .setExpirationTime('7d') // Set token expiration time
    .sign(secret);
};

export const tokenVerify = async (accessToken: string) => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const { payload } = await jwtVerify(accessToken, secret);

    return payload;
  } catch (error) {
    return null;
  }
};
