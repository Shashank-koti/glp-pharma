import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import connectDB from './src/config/database.js';

const makeAllVisible = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Assigning similar products to ALL products...');

    const products = await Product.find({ isActive: true });
    
    let updateCount = 0;

    // Helper to get random item
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (const p of products) {
      if (!p.similarProducts || p.similarProducts.length === 0) {
        // Pick a random product that is not the same
        let randomSimilarProd;
        do {
          randomSimilarProd = randomItem(products);
        } while (randomSimilarProd._id.toString() === p._id.toString() || !randomSimilarProd.casNumber);

        const suffixes = ['(hydrate salt)', '(freebase)', '(isomer)', '(racemic mixture)', ''];
        const suffix = randomItem(suffixes);
        
        p.similarProducts = [`${randomSimilarProd.casNumber}${suffix}`];
        await p.save();
        updateCount++;
      }
    }

    console.log(`Assigned similar products to ${updateCount} remaining products.`);

    // Now run bidirectional logic on everything again to ensure consistency
    console.log('Running bidirectional synchronization...');
    let reverseCount = 0;
    
    // Refresh products list after modifications
    const updatedProducts = await Product.find({ isActive: true });
    const productMap = {};
    updatedProducts.forEach(prod => {
      if (prod.casNumber) {
        productMap[prod.casNumber] = prod;
      }
    });

    for (const p of updatedProducts) {
      if (p.similarProducts && p.similarProducts.length > 0) {
        for (const sim of p.similarProducts) {
          const targetCas = sim.split('(')[0].trim();
          const targetProduct = productMap[targetCas];
          
          if (targetProduct && targetProduct._id.toString() !== p._id.toString()) {
            const currentSims = targetProduct.similarProducts || [];
            const alreadyHasIt = currentSims.some(s => s.split('(')[0].trim() === p.casNumber);
            
            if (!alreadyHasIt) {
              targetProduct.similarProducts = [...currentSims, p.casNumber];
              await targetProduct.save();
              reverseCount++;
            }
          }
        }
      }
    }

    console.log(`Added ${reverseCount} new reverse links.`);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAllVisible();
