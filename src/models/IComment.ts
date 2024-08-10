import type { Document } from 'mongoose';

import type { IUser } from './IUser';

export interface IComment extends Document {
  name: string;
  color: string;
  comment: string;
  author: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}
