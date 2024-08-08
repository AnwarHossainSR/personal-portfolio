import type { Document } from 'mongoose';

import type { IUser } from './IUser';

export interface IPost extends Document {
  title: string;
  content: string;
  published: boolean;
  image_url?: string;
  category?: string;
  author: IUser['_id'];
  short_content: string;
  createdAt: Date;
  updatedAt: Date;
}
