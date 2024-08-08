/* eslint-disable global-require */
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
    await connectToDatabase(); // Ensure database connection
    const url = new URL(req.url, process.env.SITE_URL);
    const category = url.searchParams.get('category');

    let blogs = [];
    if (category) {
      blogs = await Post.find({ category })
        .sort({ createdAt: -1 })
        .populate('author', 'name image id', User);
    } else {
      blogs = await Post.find()
        .sort({ createdAt: -1 })
        .populate('author', 'name image id', User);
    }

    return NextResponse.json({
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Ensure database connection

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;
    const published = formData.get('published') as any;
    const category = formData.get('category') as string;
    const shortContent = formData.get('short_content') as string;

    if (!title || !content || !file || !category) {
      return NextResponse.json(
        { message: 'Please enter title, content, and mainImage.' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    const authorId = JSON.parse(req.cookies.get('user')?.value ?? '').id;

    const res = await cloudinary.uploader.upload(fileUri, {
      folder: 'blog_images',
    });

    if (!res || !res.secure_url) {
      return NextResponse.json(
        { message: 'File could not upload, please try again later.' },
        { status: 400 }
      );
    }

    const blog = await Post.create({
      title,
      short_content: shortContent,
      content,
      published,
      category,
      image_url: res.secure_url,
      author: authorId,
    });

    if (blog) {
      await User.updateOne({ _id: authorId }, { $push: { posts: blog._id } });
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
