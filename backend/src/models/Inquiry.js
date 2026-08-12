import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },
    role: {
      type: String,
      trim: true,
    },
    productInterested: {
      type: String,
      trim: true,
    },
    quantity: {
      type: String,
    },
    items: [
      {
        productId: { type: String },
        name: { type: String },
        cas: { type: String },
        quantity: { type: Number },
        unit: { type: String },
      }
    ],
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    inquiryType: {
      type: String,
      enum: ['Product Inquiry', 'Quote Request', 'General Inquiry', 'quick'],
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true, // createdTime and updatedAt
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
