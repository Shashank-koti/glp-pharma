import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';
import ApiFeatures from '../utils/ApiFeatures.js';

// @desc    Get all products (with advanced search & filter)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const searchFields = ['name', 'casNumber', 'molecularFormula', 'tags', 'applications'];

    // Add default active filter
    if (!req.query.isActive) {
      req.query.isActive = 'true';
    }

    const features = new ApiFeatures(Product.find().populate('category', 'categoryName slug'), req.query)
      .search(searchFields)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;

    // For counting total, we need a separate query without pagination
    const countFeatures = new ApiFeatures(Product.find(), req.query)
      .search(searchFields)
      .filter();
    const total = await countFeatures.query.countDocuments();

    return ResponseFormatter.successWithPagination(res, products, {
      total,
      count: products.length,
      page: parseInt(req.query.page) || 1,
    }, 'Products fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      $or: [{ slug: req.params.slug }, { casNumber: req.params.slug }],
      isActive: true 
    }).populate('category', 'categoryName slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find reverse similar products (products that point to this product)
    if (product.casNumber) {
      // Regex matches casNumber exactly, followed by ( or end of string, to avoid partial matches
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reverseRegex = new RegExp('^' + escapeRegExp(product.casNumber) + '(?:\\(|$)', 'i');
      
      const reverseLinks = await Product.find({
        similarProducts: { $regex: reverseRegex },
        _id: { $ne: product._id },
        isActive: true
      }).select('casNumber');
      
      if (reverseLinks.length > 0) {
        const reverseCasNumbers = reverseLinks.map(p => p.casNumber);
        const currentSimilar = product.similarProducts || [];
        const allSimilar = Array.from(new Set([...currentSimilar, ...reverseCasNumbers]));
        
        // Convert to plain object to safely attach dynamic similar products
        const productObj = product.toObject();
        productObj.similarProducts = allSimilar;
        return ResponseFormatter.success(res, productObj, 'Product fetched successfully');
      }
    }

    return ResponseFormatter.success(res, product, 'Product fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/special/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'categoryName slug')
      .limit(limit)
      .sort('-createdAt');

    return ResponseFormatter.success(res, products, 'Featured products fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest products
// @route   GET /api/products/special/latest
// @access  Public
export const getLatestProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isActive: true })
      .populate('category', 'categoryName slug')
      .limit(limit)
      .sort('-createdAt');

    return ResponseFormatter.success(res, products, 'Latest products fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:slug/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const currentProduct = await Product.findOne({ slug: req.params.slug });

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category,
      isActive: true,
    })
      .populate('category', 'categoryName slug')
      .limit(limit)
      .sort('-createdAt');

    return ResponseFormatter.success(res, relatedProducts, 'Related products fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Increment product view count
// @route   POST /api/products/:slug/view
// @access  Public
export const incrementViewCount = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return ResponseFormatter.success(res, { viewsCount: product.viewsCount }, 'View count incremented');
  } catch (error) {
    next(error);
  }
};

// @desc    Get product filters options
// @route   GET /api/products/meta/filters
// @access  Public
export const getProductFilters = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: true }).select('categoryName slug');
    const productTypes = await Product.distinct('productType', { isActive: true });

    // Could also get distinct purities, applications if needed

    return ResponseFormatter.success(res, {
      categories,
      productTypes,
    }, 'Filters fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique product groups (subCategories) for a category
// @route   GET /api/products/groups/:categorySlug
// @access  Public
export const getProductGroupsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug, status: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { letter } = req.query;

    let matchQuery = { category: category._id, isActive: true, subCategory: { $exists: true, $ne: '' } };

    if (letter) {
      // Create a regex to match the starting letter (case-insensitive)
      matchQuery.subCategory = { $regex: new RegExp(`^${letter}`, 'i') };
    }

    // Using aggregation to get distinct subCategories and perhaps count them
    // Or we can just use distinct if we only need the names
    const groups = await Product.distinct('subCategory', matchQuery);

    // Sort alphabetically
    groups.sort((a, b) => a.localeCompare(b));

    return ResponseFormatter.success(res, groups, 'Product groups fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by subCategory (group)
// @route   GET /api/products/subcategory/:subCategory
// @access  Public
export const getProductsBySubCategory = async (req, res, next) => {
  try {
    const subCategoryName = req.params.subCategory;

    // Check if any product exists with this subCategory
    const groupExists = await Product.exists({ subCategory: subCategoryName, isActive: true });

    if (!groupExists) {
      return res.status(404).json({ success: false, message: 'Subcategory group not found' });
    }

    const features = new ApiFeatures(
      Product.find({ subCategory: subCategoryName, isActive: true }).populate('category', 'categoryName slug'),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const total = await Product.countDocuments({ subCategory: subCategoryName, isActive: true });

    return ResponseFormatter.successWithPagination(res, products, {
      total,
      count: products.length,
      page: parseInt(req.query.page) || 1,
    }, 'Products for subcategory fetched successfully');
  } catch (error) {
    next(error);
  }
};
