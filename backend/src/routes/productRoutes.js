import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getLatestProducts,
  getRelatedProducts,
  incrementViewCount,
  getProductFilters,
  getProductGroupsByCategory,
  getProductsBySubCategory,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/meta/filters', getProductFilters);
router.get('/groups/:categorySlug', getProductGroupsByCategory);
router.get('/subcategory/:subCategory', getProductsBySubCategory);
router.get('/special/featured', getFeaturedProducts);
router.get('/special/latest', getLatestProducts);

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);
router.post('/:slug/view', incrementViewCount);

export default router;
