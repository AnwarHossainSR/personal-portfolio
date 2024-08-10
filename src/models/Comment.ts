import { Schema, model, models } from 'mongoose';

import type { IComment } from './IComment';

const commentSchema = new Schema<IComment>({
  comment: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || model<IComment>('Comment', commentSchema);

export default Comment;
