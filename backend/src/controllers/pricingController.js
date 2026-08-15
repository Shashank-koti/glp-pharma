import PricingRequest from '../models/PricingRequest.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';

// @desc    Submit a new pricing or checkout request
// @route   POST /api/pricing
// @access  Public
export const submitPricingRequest = async (req, res, next) => {
  try {
    const {
      customerName,
      companyName,
      email,
      phone,
      country,
      message,
      role,
      poNumber,
      items,
    } = req.body;

    const pricingReq = await PricingRequest.create({
      customerName,
      companyName,
      email,
      phone,
      country,
      message,
      role,
      poNumber,
      items,
      requestType: 'Pricing Request',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return ResponseFormatter.success(res, pricingReq, 'Pricing request submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};
