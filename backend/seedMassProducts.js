import dotenv from 'dotenv';
dotenv.config();

import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import connectDB from './src/config/database.js';
import slugGenerator from './src/utils/slugGenerator.js';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Helper to get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate 15 subCategories per alphabet letter to test the frontend sorting
const generateMassProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to database for mass seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products...');

    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log('No categories found. Please run seedCategories.js first.');
      process.exit(1);
    }

    let productCount = 1;
    const generatedProducts = [];

    // For every category
    for (const category of categories) {
      // Pick 5 random letters for subCategories in this category
      for (let i = 0; i < 5; i++) {
        const letter = randomItem(alphabet);
        // Create 2 unique subcategory groups for this letter
        for (let j = 1; j <= 2; j++) {
          const subCategory = `${letter}-Group-${category.categoryName.split(' ')[0]}-${j}`;
          
          // Inside each subcategory, create 3 products
          for (let k = 1; k <= 3; k++) {
            const product = {
              name: `${subCategory} Product ${k} - ${Math.floor(Math.random() * 10000)}`,
              slug: slugGenerator(`${subCategory} Product ${k}-${Math.floor(Math.random() * 10000)}`),
              category: category._id,
              subCategory: subCategory,
              productType: k % 2 === 0 ? 'API' : 'Impurity',
              casNumber: `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`,
              molecularFormula: `C${Math.floor(Math.random() * 20)}H${Math.floor(Math.random() * 30)}N${Math.floor(Math.random() * 5)}O`,
              molecularWeight: (100 + Math.random() * 400).toFixed(2),
              purity: '>98%',
              appearance: 'White Powder',
              description: `This is a highly pure dummy reference standard for ${subCategory}.`,
              applications: ['Research', 'Lab Testing'],
              storage: '2-8°C Refrigerator',
              shippingConditions: 'Ambient',
              catalogueNumber: `GLP-${productCount.toString().padStart(4, '0')}`,
              chemicalName: `Chemical Name for ${productCount}`,
              isActive: true,
              isFeatured: productCount % 10 === 0,
              viewsCount: Math.floor(Math.random() * 100)
            };
            generatedProducts.push(product);
            productCount++;
          }
        }
      }
    }

    // Assign similar products to ~30% of the generated products
    generatedProducts.forEach((prod) => {
      if (Math.random() < 0.3) {
        let randomSimilarProd = randomItem(generatedProducts);
        // Ensure it doesn't link to itself
        while (randomSimilarProd.casNumber === prod.casNumber) {
          randomSimilarProd = randomItem(generatedProducts);
        }
        const suffixes = ['(hydrate salt)', '(freebase)', '(isomer)', '(racemic mixture)', ''];
        const suffix = randomItem(suffixes);
        prod.similarProducts = [`${randomSimilarProd.casNumber}${suffix}`];
      }
    });

    await Product.insertMany(generatedProducts);
    console.log(`Successfully generated and seeded ${generatedProducts.length} dummy products!`);
    
    // Also log how they are distributed
    console.log(`Total Categories populated: ${categories.length}`);
    console.log(`Testing frontend alphabet filter is now fully supported!`);

    process.exit(0);
  } catch (error) {
    console.error('Error mass seeding products:', error);
    process.exit(1);
  }
};

generateMassProducts();
