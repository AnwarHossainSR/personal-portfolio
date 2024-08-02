import bcrypt from 'bcrypt';
import { NextResponse, type NextRequest } from 'next/server';

import { SALT_WORK_FACTOR } from '@/config';
import { prisma } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    // write registration logic here
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        message: 'Please Enter Name, Email & Password',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User Already Exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // password
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Failed to Create User' });
    }

    return NextResponse.json({ message: 'User Created Successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error });
  }
}
