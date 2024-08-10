/* eslint-disable func-names */
import type { Document } from 'mongoose';
import { Schema, model, models } from 'mongoose';

import type { IUser } from './IUser';

export interface IPost extends Document {
  title: string;
  content: string;
  published: boolean;
  image_url?: string;
  category?: string;
  author: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
  short_content: string;
  comments: [];
}

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
