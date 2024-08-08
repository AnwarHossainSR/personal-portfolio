/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop() ?? '';

    if (!slug) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 });
    }

    const blog = await Post.findOne({ _id: slug }).populate(
      'author',
      'name image id',
      User
    );

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Blog fetched successfully',
      data: blog,
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // Write update logic here
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop() ?? '';

    if (!slug) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;
    const published = formData.get('published') as any;
    const category = formData.get('category') as string;
    const shortContent = formData.get('short_content') as string;

    if (!title || !content || !category) {
      return NextResponse.json(
        { message: 'Please enter title, content, and mainImage.' },
        { status: 400 }
      );
    }

    let res = null;

    if (file) {
      const fileBuffer = await file.arrayBuffer();
      const mimeType = file.type;
      const base64Data = Buffer.from(fileBuffer).toString('base64');
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      res = await cloudinary.uploader.upload(fileUri, {
        folder: 'blog_images',
      });
    }

    const authorId = JSON.parse(req.cookies.get('user')?.value ?? '').id;
    const data: any = {
      title,
      content,
      author: authorId,
      published,
      category,
      short_content: shortContent,
    };

    if (file !== null && res !== null) data.image_url = res.secure_url;

    const blog = await Post.findOneAndUpdate({ _id: slug }, data, {
      new: true,
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
