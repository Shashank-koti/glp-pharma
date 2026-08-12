import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import connectDB from './src/config/database.js';

dotenv.config();

const categoriesToSeed = [
  "API IMPURITIES AND REFERENCE STANDARDS",
  "APIS AND INTERMEDIATES",
  "CATALYSTS",
  "NITROSO IMPURITIES",
  "PEPTIDES",
  "ISOTOPE LABELLED COMPOUNDS",
  "FINE CHEMICALS",
  "AGRO CHEMICALS"
];

const generateProductsForCategory = (categoryName) => {
  const products = [];
  const prefix = categoryName.split(' ')[0]; // E.g., API, CATALYSTS, PEPTIDES
  
  // We'll create 3 main groups for each category to test grouping
  const groups = [`${prefix} Alpha`, `${prefix} Beta`, `${prefix} Gamma`];
  
  groups.forEach(groupName => {
    // 1 Main product
    products.push({
      name: groupName,
      subCategory: groupName,
      productType: 'API',
      casNumber: `1000-${Math.floor(Math.random() * 900) + 100}-0`,
      molecularFormula: 'C10H12N2O',
      molecularWeight: '176.22',
      purity: '99%',
      description: `Primary product for ${groupName} under ${categoryName}`,
      applications: ['R&D', 'Manufacturing'],
      storageConditions: 'Store at Room Temperature',
      tags: [prefix.toLowerCase(), 'main']
    });

    // 3 Impurities for this group
    for (let i = 1; i <= 3; i++) {
      const letters = ['A', 'B', 'C'];
      products.push({
        name: `${groupName} Impurity ${letters[i-1]}`,
        subCategory: groupName,
        productType: 'Impurity',
        casNumber: `1000-${Math.floor(Math.random() * 900) + 100}-${i}`,
        molecularFormula: `C10H1${2-i}N2O`,
        molecularWeight: (176.22 - i).toFixed(2),
        purity: '95%',
        description: `Impurity ${letters[i-1]} of ${groupName}`,
        applications: ['Reference Standard', 'Analysis'],
        storageConditions: 'Store at 2-8°C',
        tags: [prefix.toLowerCase(), 'impurity']
      });
    }
  });

  // Total = 3 groups * 4 products = 12 products per category (meets the >10 requirement)
  return products;
}

const seedAll = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    for (const catName of categoriesToSeed) {
      console.log(`\n--- Seeding for ${catName} ---`);
      
      // Find or create category
      let category = await Category.findOne({ categoryName: catName });
      if (!category) {
        console.log(`Category not found, creating ${catName}...`);
        category = await Category.create({ 
          categoryName: catName,
          displayOrder: categoriesToSeed.indexOf(catName) + 1
        });
      }

      const generatedProducts = generateProductsForCategory(catName);

      for (const prodData of generatedProducts) {
        const fullProdData = { ...prodData, category: category._id };
        const existingProduct = await Product.findOne({ name: prodData.name, category: category._id });
        
        if (!existingProduct) {
          await Product.create(fullProdData);
          console.log(`Created: ${prodData.name}`);
        } else {
          console.log(`Exists: ${prodData.name}`);
        }
      }
    }

    console.log('\nAll categories seeded successfully with dummy products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedAll();
