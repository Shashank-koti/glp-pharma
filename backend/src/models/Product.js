import mongoose from 'mongoose';
import slugGenerator from '../utils/slugGenerator.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    subCategory: {
      type: String,
      trim: true,
      index: true,
    },
    productType: {
      type: String,
      trim: true,
    },
    casNumber: {
      type: String,
      trim: true,
      index: true,
    },
    molecularFormula: {
      type: String,
      trim: true,
    },
    molecularWeight: {
      type: String,
      trim: true,
    },
    purity: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    applications: {
      type: [String],
    },
    catalogueNumber: {
      type: String,
      trim: true,
    },
    chemicalName: {
      type: String,
      trim: true,
    },
    appearance: {
      type: String,
      trim: true,
    },
    storage: {
      type: String,
      trim: true,
    },
    shippingConditions: {
      type: String,
      trim: true,
    },
    storageConditions: {
      type: String,
    },
    similarProducts: {
      type: [String],
      default: [],
    },
    image: {
      type: String, // URL from Cloudinary
    },
    countryOfOrigin: {
      type: String,
      trim: true,
      default: 'India',
    },
    availability: {
      type: String,
      trim: true,
      default: 'In Stock',
    },
    tags: {
      type: [String],
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-generate slug before saving
productSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugGenerator(this.name);
  }
});

// Indexes for optimized searching
productSchema.index({ name: 'text', description: 'text', casNumber: 'text', tags: 'text' });
productSchema.index({ category: 1, productType: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;