import bcrypt from 'bcrypt';
import { NextResponse, type NextRequest } from 'next/server';

import { prisma } from '@/lib';
import { createAccessToken, createRefreshToken } from '@/lib/jwtToken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        message: 'Please enter all fields',
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found', status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid Credentials', status: 401 });
    }

    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });

    return NextResponse.json({
      status: 200,
      message: 'Login Successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
}
