import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import connectDB from './src/config/database.js';

dotenv.config();

const categories = [
  { categoryName: 'API IMPURITIES AND REFERENCE STANDARDS', displayOrder: 1 },
  { categoryName: 'APIS AND INTERMEDIATES', displayOrder: 2 },
  { categoryName: 'CATALYSTS', displayOrder: 3 },
  { categoryName: 'NITROSO IMPURITIES', displayOrder: 4 },
  { categoryName: 'PEPTIDES', displayOrder: 5 },
  { categoryName: 'ISOTOPE LABELLED COMPOUNDS', displayOrder: 6 },
  { categoryName: 'FINE CHEMICALS', displayOrder: 7 },
  { categoryName: 'AGRO CHEMICALS', displayOrder: 8 },
];

const seedCategories = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    for (const cat of categories) {
      // Find or create
      const existing = await Category.findOne({ categoryName: cat.categoryName });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.categoryName}`);
      } else {
        existing.displayOrder = cat.displayOrder;
        await existing.save();
        console.log(`Updated category: ${cat.categoryName}`);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCategories();
