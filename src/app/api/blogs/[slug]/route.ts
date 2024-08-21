/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
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

    const blog = await Post.findOne({ _id: slug })
      .populate('author', 'name image id', User)
      .populate('category', 'name color', Category)
      // .populate('comments', 'comment updatedAt', Comment);
      .populate({
        path: 'comments',
        select: 'comment updatedAt',
        populate: {
          path: 'author',
          select: 'name image',
          model: 'User',
        },
      });
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

    const existingBlog = await Post.findById({ _id: slug });

    if (!existingBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    let res = null;

    if (file) {
      // If there is a new image, delete the old one
      if (existingBlog.image_url) {
        const publicId = existingBlog.image_url.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`blog_images/${publicId}`);
      }

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

export async function DELETE(req: NextRequest) {
  await connectToDatabase(); // Ensure database connection

  try {
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop() ?? '';
    if (!slug) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 });
    }

    const blog = await Post.findById({ _id: slug });
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    if (blog.image_url) {
      const publicId = blog.image_url.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`blog_images/${publicId}`);
    }

    await Post.deleteOne({ _id: slug });

    return NextResponse.json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
