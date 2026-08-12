import mongoose from 'mongoose';
import slugGenerator from '../utils/slugGenerator.js';

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function () {
  if (this.isModified('categoryName') || !this.slug) {
    this.slug = slugGenerator(this.categoryName);
  }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
