/* eslint-disable func-names */
import { Schema, model, models } from 'mongoose';

import type { IPost } from './IPost';

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  short_content: {
    type: String,
    required: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  image_url: {
    type: String,
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

postSchema.pre<IPost>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Post = models.Post || model<IPost>('Post', postSchema);

export default Post;
