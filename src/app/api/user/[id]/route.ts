import { NextResponse, type NextRequest } from 'next/server';

import { prisma } from '@/lib';

export async function GET(req: NextRequest, context: any) {
  try {
    const { id } = context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return NextResponse.json(
        {
          message: 'User not found',
        },
        { status: 404 }
      );

    const response = NextResponse.json(
      {
        message: 'User found',
        user,
      },
      { status: 200 }
    );

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
