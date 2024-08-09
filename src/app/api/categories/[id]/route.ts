/* eslint-disable no-console */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() ?? '';

    if (!id) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 });
    }

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Category fetched successfully',
      data: category,
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
    const id = url.pathname.split('/').pop() ?? '';

    if (!id) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;

    if (!name || !color) {
      return NextResponse.json(
        { message: 'Please enter title, content, and mainImage.' },
        { status: 400 }
      );
    }

    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        name,
        color,
      }
    );

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
