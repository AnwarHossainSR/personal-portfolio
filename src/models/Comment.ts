import { Schema, model, models } from 'mongoose';

import type { IComment } from './IComment';

const commentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      unique: true,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = models.Comment || model<IComment>('Comment', commentSchema);

export default Comment;
