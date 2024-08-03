import type { Document, Types } from 'mongoose';

import type { IPost } from './IPost';

export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  posts?: Types.Array<IPost>;
}
