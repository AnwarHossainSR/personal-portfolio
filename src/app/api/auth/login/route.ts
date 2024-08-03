/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { createJwtToken } from '@/lib';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Please enter all fields',
        },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid Credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const jwtToken = await createJwtToken({ userId: user._id });

    // Create response and set cookies
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

    // Prepare user data for cookies
    const modifiedUser = {
      id: user._id,
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
