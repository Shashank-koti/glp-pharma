import Inquiry from '../models/Inquiry.js';
import ContactMessage from '../models/ContactMessage.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

// @desc    Submit a new product inquiry or quote request
// @route   POST /api/inquiries
// @access  Public
export const submitInquiry = async (req, res, next) => {
  try {
    const {
      customerName,
      companyName,
      email,
      phone,
      country,
      productInterested,
      quantity,
      message,
      inquiryType,
      role,
      items,
    } = req.body;

    const inquiry = await Inquiry.create({
      customerName,
      companyName,
      email,
      phone,
      country,
      productInterested,
      quantity,
      message,
      inquiryType,
      role,
      items,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return ResponseFormatter.success(res, inquiry, 'Inquiry submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit general contact form
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return ResponseFormatter.success(res, contactMessage, 'Contact message submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get company contact information
// @route   GET /api/contact/info
// @access  Public
export const getContactInfo = async (req, res, next) => {
  try {
    // Usually this would come from a settings collection, but for now we'll return hardcoded
    const info = {
      address: '123 Pharma Street, Healthcare City, Country',
      phone: '+1 234 567 8900',
      email: 'info@glppharma.com',
      googleMapLink: 'https://maps.google.com/...',
    };

    return ResponseFormatter.success(res, info, 'Contact info fetched successfully');
  } catch (error) {
    next(error);
  }
};
