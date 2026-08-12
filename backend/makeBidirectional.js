import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import connectDB from './src/config/database.js';

const makeSimilarProductsBidirectional = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Making similar products bidirectional...');

    const products = await Product.find({ isActive: true });
    
    let updateCount = 0;

    // Build a map of casNumber to Product for quick lookup
    const productMap = {};
    products.forEach(p => {
      if (p.casNumber) {
        productMap[p.casNumber] = p;
      }
    });

    // Iterate through all products
    for (const p of products) {
      if (p.similarProducts && p.similarProducts.length > 0) {
        for (const sim of p.similarProducts) {
          // Extract CAS number from something like "1234-56-7(hydrate salt)"
          const targetCas = sim.split('(')[0].trim();
          
          // Find the target product
          const targetProduct = productMap[targetCas];
          
          if (targetProduct && targetProduct._id.toString() !== p._id.toString()) {
            // We need to add p.casNumber to targetProduct.similarProducts
            const currentSims = targetProduct.similarProducts || [];
            
            // Check if p.casNumber is already in there
            const alreadyHasIt = currentSims.some(s => s.split('(')[0].trim() === p.casNumber);
            
            if (!alreadyHasIt) {
              targetProduct.similarProducts = [...currentSims, p.casNumber];
              await targetProduct.save();
              updateCount++;
              console.log(`Added reverse link: ${targetProduct.casNumber} -> ${p.casNumber}`);
            }
          }
        }
      }
    }

    console.log(`Successfully updated ${updateCount} reverse links in the database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating reverse links:', error);
    process.exit(1);
  }
};

makeSimilarProductsBidirectional();
