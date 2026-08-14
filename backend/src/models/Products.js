import mongoose from 'mongoose';
import slugGenerator from '../utils/slugGenerator.js';

const productSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, 'Product heading is required'],
      unique: true,
      trim: true,
    },
    p_link: {
      type: String,
      unique: true,
      index: true,
    },
    meta_title: {
      type: String,
    },
    meta_keywords: {
      type: String,
    },
    meta_description: {
      type: String,
    },
    content: {
      type: String,
    },
    category_id: {
      type: String,
      index: true,
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

productSchema.pre('save', function () {
  if (!this.p_link) {
    this.p_link = slugGenerator(this.heading);
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
