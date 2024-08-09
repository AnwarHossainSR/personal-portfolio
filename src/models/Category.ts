import { Schema, model, models } from 'mongoose';

import type { ICategory } from './ICategory';

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Category =
  models.Category || model<ICategory>('Category', categorySchema);

export default Category;
