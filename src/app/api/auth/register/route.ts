import { NextResponse, type NextRequest } from 'next/server';

import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User'; // Import your User model

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    // Write registration logic here
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        message: 'Please Enter Name, Email & Password',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User Already Exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the model's pre-save hook
      isAdmin: true,
    });

    if (!user) {
      return NextResponse.json({ message: 'Failed to Create User' });
    }

    return NextResponse.json({ message: 'User Created Successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error });
  }
}
