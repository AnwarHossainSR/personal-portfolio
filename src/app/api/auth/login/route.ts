import bcrypt from 'bcrypt';
import { NextResponse, type NextRequest } from 'next/server';

import { createJwtToken, prisma } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Please enter all fields',
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid Credentials' },
        { status: 401 }
      );
    }

    const jwtToken = await createJwtToken({ userId: user.id });

    const response = NextResponse.json(
      {
        message: 'Authorized!',
      },
      { status: 200 }
    );

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    const modifiedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };

    response.cookies.set('user', JSON.stringify(modifiedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error,
      },
      { status: 500 }
    );
  }
}
