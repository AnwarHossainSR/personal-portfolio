import type { Document } from 'mongoose';

import type { IPost } from './IPost';
import type { IUser } from './IUser';

export interface IComment extends Document {
  name: string;
  color: string;
  comment: string;
  author: IUser['_id'];
  postId: IPost['_id'];
  createdAt: Date;
  updatedAt: Date;
}
