import bcrypt from 'bcrypt';

import { prisma } from '@/lib';
import { createAccessToken, createRefreshToken } from '@/lib/jwtToken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ message: 'Please Enter Email & Password' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ message: 'User not found', status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ message: 'Invalid Credentials', status: 401 });
    }

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    return Response.json({
      status: 200,
      message: 'Login Successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return Response.json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
}
