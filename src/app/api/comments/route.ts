import { NextResponse, type NextRequest } from 'next/server';

import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Ensure database connection

  try {
    const formData = await req.formData();
    const comment = formData.get('comment') as string;
    const postId = formData.get('postId') as string;

    if (!comment || !postId) {
      return NextResponse.json(
        { message: 'Please enter comment and post id.' },
        { status: 400 }
      );
    }

    // Use await to get the actual post document
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const newComment: any = {
      comment,
      postId: post._id,
    };
    const author = req.cookies.get('user')
      ? JSON.parse(req.cookies.get('user')?.value ?? '').id
      : null;
    if (author) newComment.author = author;
    const createPost = await Comment.create(newComment);

    if (!createPost) {
      return NextResponse.json(
        { message: 'Comment not created' },
        { status: 500 }
      );
    }

    post.comments.push(createPost._id); // Push the new comment to the post's comments array
    await post.save(); // Save the updated post document

    console.log('createPost', createPost);

    return NextResponse.json(
      { message: 'Comment created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('error', error);
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    );
  }
}
