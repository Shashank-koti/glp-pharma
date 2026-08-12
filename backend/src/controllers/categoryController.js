import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';
import ApiFeatures from '../utils/ApiFeatures.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const features = new ApiFeatures(Category.find({ status: true }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query;
    const total = await Category.countDocuments({ status: true });

    return ResponseFormatter.successWithPagination(res, categories, {
      total,
      count: categories.length,
      page: parseInt(req.query.page) || 1,
    }, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get category details by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, status: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return ResponseFormatter.success(res, category, 'Category fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category slug
// @route   GET /api/categories/:slug/products
// @access  Public
export const getCategoryProducts = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, status: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const features = new ApiFeatures(
      Product.find({ category: category._id, isActive: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const total = await Product.countDocuments({ category: category._id, isActive: true });

    return ResponseFormatter.successWithPagination(res, products, {
      total,
      count: products.length,
      page: parseInt(req.query.page) || 1,
    }, 'Category products fetched successfully');
  } catch (error) {
    next(error);
  }
};
