import { NextResponse, type NextRequest } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Extract user ID from the request URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user data from the database
    const user = await User.findOne({
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

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prepare response
    const response = NextResponse.json(
      {
        message: 'User found',
        user,
      },
      { status: 200 }
    );

    // Set user cookie
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
      { message: 'Internal Server Error', error },
      { status: 500 }
    );
  }
}
