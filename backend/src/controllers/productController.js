import Product from '../models/products.js';
import Category from '../models/Category.js';
import SubProduct from '../models/SubProducts.js';
import ResponseFormatter from '../utils/ResponseFormatter.js';
import ApiFeatures from '../utils/ApiFeatures.js';

// @desc    Get all products (with advanced search & filter)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const searchFields = ['name', 'specifications.casNumber', 'specifications.catalogueNumber', 'specifications.iupacName', 'specifications.molecularFormula', 'tags', 'applications'];

    // Add default active filter
    if (!req.query.isActive) {
      req.query.isActive = 'true';
    }

    if (!req.query.limit) {
      req.query.limit = '1000';
    }

    const features = new ApiFeatures(SubProduct.find().populate('mainProduct', 'category_id'), req.query)
      .search(searchFields)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const subProducts = await features.query;

    // For counting total, we need a separate query without pagination
    const countFeatures = new ApiFeatures(SubProduct.find(), req.query)
      .search(searchFields)
      .filter();
    const total = await countFeatures.query.countDocuments();

    // Map categories to subproducts for frontend backward compatibility
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.categoryId] = {
        categoryName: c.categoryName,
        slug: c.slug,
        categoryId: c.categoryId
      };
    });

    const formattedProducts = subProducts.map(sp => {
      const formatted = sp.toObject();
      if (sp.mainProduct && categoryMap[sp.mainProduct.category_id]) {
        formatted.category = categoryMap[sp.mainProduct.category_id];
      }
      return formatted;
    });

    return ResponseFormatter.successWithPagination(res, formattedProducts, {
      total,
      count: formattedProducts.length,
      page: parseInt(req.query.page) || 1,
    }, 'Products fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product (impurity) by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const subProduct = await SubProduct.findOne({ 
      $or: [{ slug: req.params.slug }, { 'specifications.casNumber': req.params.slug }],
      isActive: true 
    }).populate('mainProduct');

    if (!subProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Format the response to be backward compatible with frontend
    const formattedSubProduct = subProduct.toObject();
    
    // Lift specifications up to the root level for easy frontend access
    if (formattedSubProduct.specifications) {
      Object.assign(formattedSubProduct, formattedSubProduct.specifications);
    }
    
    // Look up category for breadcrumbs
    if (subProduct.mainProduct) {
      const category = await Category.findOne({ categoryId: subProduct.mainProduct.category_id });
      if (category) {
        formattedSubProduct.category = {
          categoryName: category.categoryName,
          slug: category.slug,
          categoryId: category.categoryId
        };
      }
    }

    // Find reverse similar products logic can be adapted later if needed
    
    return ResponseFormatter.success(res, formattedSubProduct, 'Product fetched successfully');
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
    const subCategoryName = req.params.subCategory; // e.g. "nitroso-impurities"

    // 1. Look up the top-level Category
    const category = await Category.findOne({ slug: subCategoryName });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // 2. Fetch the APIs (Main Products) that belong to this category's ID
    const features = new ApiFeatures(
      Product.find({ category_id: category.categoryId, status: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    
    // 3. Attach the category object manually so the frontend code (like ProductsView.jsx) doesn't break
    const formattedProducts = products.map(p => {
      const prod = p.toObject();
      prod.category = {
        categoryName: category.categoryName,
        slug: category.slug,
        categoryId: category.categoryId
      };
      return prod;
    });

    const total = await Product.countDocuments({ category_id: category.categoryId, status: true });

    return ResponseFormatter.successWithPagination(res, formattedProducts, {
      total,
      count: formattedProducts.length,
      page: parseInt(req.query.page) || 1,
    }, 'Products for subcategory fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get subproducts (impurities) for a specific main product
// @route   GET /api/products/:slug/subproducts
// @access  Public
export const getProductSubProducts = async (req, res, next) => {
  try {
    // 1. Find the Main Product by slug
    const mainProduct = await Product.findOne({ p_link: req.params.slug, status: true });
    
    if (!mainProduct) {
      return res.status(404).json({ success: false, message: 'Main product not found' });
    }

    // 2. Fetch the SubProducts that belong to this Main Product
    // Default to a high limit if not paginating explicitly
    if (!req.query.limit) {
      req.query.limit = '1000';
    }

    const features = new ApiFeatures(
      SubProduct.find({ mainProduct: mainProduct._id, isActive: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const subProducts = await features.query;
    
    // We need to look up the top-level category so the frontend breadcrumbs work
    const category = await Category.findOne({ categoryId: mainProduct.category_id });

    const formattedSubProducts = subProducts.map(sp => {
      const formatted = sp.toObject();
      if (category) {
        formatted.category = {
          categoryName: category.categoryName,
          slug: category.slug,
          categoryId: category.categoryId
        };
      }
      return formatted;
    });

    const total = await SubProduct.countDocuments({ mainProduct: mainProduct._id, isActive: true });

    return ResponseFormatter.successWithPagination(res, formattedSubProducts, {
      total,
      count: formattedSubProducts.length,
      page: parseInt(req.query.page) || 1,
      mainProduct: {
        heading: mainProduct.heading,
        slug: mainProduct.p_link,
      },
      category: category ? {
        categoryName: category.categoryName,
        slug: category.slug,
      } : null
    }, 'SubProducts fetched successfully');
  } catch (error) {
    next(error);
  }
};
