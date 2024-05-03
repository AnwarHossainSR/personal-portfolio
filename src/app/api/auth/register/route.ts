import bcrypt from 'bcrypt';

import { SALT_WORK_FACTOR } from '@/config';
import { prisma } from '@/lib';

export async function POST(req: Request) {
  try {
    // write registration logic here
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: 'Please Enter Name, Email & Password' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ message: 'User Already Exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    if (!user) {
      return Response.json({ message: 'Failed to Create User' });
    }

    return Response.json({ message: 'User Created Successfully' });
  } catch (error) {
    return Response.json({ message: 'Internal Server Error', error });
  }
}
