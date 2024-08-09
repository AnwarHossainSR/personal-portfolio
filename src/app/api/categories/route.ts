/* eslint-disable global-require */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  await connectToDatabase(); // Ensure database connection

  try {
    const categories = await Category.find().lean();
    return NextResponse.json({
      message: 'Categories fetched successfully',
      data: categories,
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
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;

    if (!name || !color) {
      return NextResponse.json(
        { message: 'Please enter name and color.' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      color,
    });

    return NextResponse.json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    // Send only the error message in the response
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase(); // Ensure database connection

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const id = formData.get('id') as string;

    if (!name || !color || !id) {
      return NextResponse.json(
        { message: 'Please enter name and color.' },
        { status: 400 }
      );
    }

    const blog = await Category.findOneAndUpdate(
      { _id: id },
      {
        name,
        color,
      }
    );

    return NextResponse.json({
      message: 'Category updated successfully',
      data: blog,
    });
  } catch (error) {
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
    const id = url.pathname.split('/').pop() ?? '';

    if (!id) {
      return NextResponse.json(
        { message: 'Please enter name and color.' },
        { status: 400 }
      );
    }

    const blog = await Category.findOneAndDelete({ _id: id });

    return NextResponse.json({
      message: 'Category deleted successfully',
      data: blog,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
