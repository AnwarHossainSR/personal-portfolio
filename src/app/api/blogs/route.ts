import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET() {
  return NextResponse.json({ message: 'Hello from the API!' });
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, mainImage } = await req.json();

    if (!title || !content || !mainImage) {
      return NextResponse.json(
        {
          message: 'Please enter title, content and mainImage.',
        },
        { status: 400 }
      );
    }

    // Save to database
    const authorId = JSON.parse(req.cookies.get('user')?.value ?? '').id;
    const blog = await prisma.post.create({
      data: {
        title,
        content,
        mainImage,
        author: { connect: { id: authorId } }, // Replace 'authorId' with the actual ID of the author
      },
    });

    return NextResponse.json({
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
