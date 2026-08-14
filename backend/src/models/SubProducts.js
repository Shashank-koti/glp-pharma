import mongoose from 'mongoose';
import slugGenerator from '../utils/slugGenerator.js';

// Schema for Pricing Tiers
const pricingTierSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., "100 mg", "1 g", "1 kg"
  price: { type: Number, required: true },
  description: { type: String }, // e.g., "For initial testing"
  isBestValue: { type: Boolean, default: false },
});

// Schema for Technical Specifications
const specificationSchema = new mongoose.Schema({
  iupacName: { type: String, trim: true }, // For IUPAC Name
  catalogueNumber: { type: String, trim: true },
  casNumber: { type: String, trim: true, index: true },
  alternateCas: { type: [String], default: [] }, // Dedicated field for Alternate CAS
  molecularFormula: { type: String, trim: true },
  molecularWeight: { type: String, trim: true },
  purity: { type: String, trim: true, default: '>98%' },
  appearance: { type: String, trim: true },
  storage: { type: String, trim: true },
  shippingConditions: { type: String, trim: true },
  countryOfOrigin: { type: String, trim: true, default: 'India' },
}, { _id: false });

const subProductSchema = new mongoose.Schema(
  {
    // 1. Core Information
    name: { type: String, required: [true, 'SubProduct name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String }, // URL from Cloudinary
    description: { type: String },
    
    // 2. Reference to Main Product
    mainProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'Main product is required'] },
    productType: { type: String, trim: true },
    
    // 3. Technical Specifications (Nested)
    specifications: {
      type: specificationSchema,
      default: () => ({})
    },
    
    // 4. Pricing Tiers (Array)
    pricingTiers: [pricingTierSchema],
    
    // 5. Additional Details
    similarProducts: { type: [String], default: [] },
    applications: { type: [String] },
    tags: { type: [String], index: true },
    
    // 6. Status & Metrics
    availability: { type: String, trim: true, default: 'In Stock' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-generate slug before saving
subProductSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = slugGenerator(this.name);
  }
});

// Indexes for optimized searching
subProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  'specifications.casNumber': 'text', 
  tags: 'text' 
});
subProductSchema.index({ mainProduct: 1, productType: 1 });

const SubProduct = mongoose.model('SubProduct', subProductSchema);

export default SubProduct;