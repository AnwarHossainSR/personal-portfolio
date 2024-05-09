import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

import { prisma } from '@/lib';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url, 'http://localhost:3000');
    let category = null;
    if (url.searchParams.get('category')) {
      category = url.searchParams.get('category');
    }

    let blogs = [];
    if (category) {
      blogs = await prisma.post.findMany({
        where: { category },
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, id: true } } },
      });
    } else {
      blogs = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, id: true } } },
      });
    }
    return NextResponse.json({
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;

    if (!title || !content || !file) {
      return NextResponse.json(
        {
          message: 'Please enter title, content and mainImage.',
        },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');

    // this will be used to upload the file
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    const authorId = JSON.parse(req.cookies.get('user')?.value ?? '').id;

    const res = await cloudinary.uploader.upload(fileUri, {
      folder: 'blog_images',
    });

    let blog = null;

    if (res.success && res.result) {
      blog = await prisma.post.create({
        data: {
          title,
          content,
          image_url: res.result.secure_url,
          author: { connect: { id: authorId } },
        },
      });
    }

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
