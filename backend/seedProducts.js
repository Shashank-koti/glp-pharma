import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import connectDB from './src/config/database.js';

dotenv.config();

const dummyProducts = [
  // Group: Abacavir (API IMPURITIES AND REFERENCE STANDARDS)
  {
    name: 'Abacavir',
    categoryName: 'API IMPURITIES AND REFERENCE STANDARDS',
    subCategory: 'Abacavir',
    productType: 'API',
    casNumber: '136470-78-5',
    molecularFormula: 'C14H18N6O',
    molecularWeight: '286.33',
    purity: '99%',
    appearance: 'White to Off-White Solid',
    description: 'Abacavir is a nucleoside reverse transcriptase inhibitor (NRTI) used to treat HIV and AIDS.',
    applications: ['Antiviral', 'HIV Treatment'],
    storage: '2-8°C Refrigerator',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-A001',
    chemicalName: '{(1S,4R)-4-[2-amino-6-(cyclopropylamino)-9H-purin-9-yl]cyclopent-2-en-1-yl}methanol'
  },
  
  // Group: Aceclofenac
  {
    name: 'Aceclofenac',
    categoryName: 'API IMPURITIES AND REFERENCE STANDARDS',
    subCategory: 'Aceclofenac',
    productType: 'API',
    casNumber: '89796-99-6',
    molecularFormula: 'C16H13Cl2NO4',
    molecularWeight: '354.18',
    purity: '99.5%',
    appearance: 'White crystalline powder',
    description: 'Aceclofenac is a non-steroidal anti-inflammatory drug (NSAID) used for pain relief.',
    storage: 'Room Temperature',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-A002',
    chemicalName: '2-[2-[2-(2,6-dichlorophenyl)aminophenyl]acetyl]oxyacetic acid'
  },

  // Group: Catalysts
  {
    name: 'Palladium on Carbon',
    categoryName: 'CATALYSTS',
    subCategory: 'Catalysts',
    productType: 'Other',
    casNumber: '7440-05-3',
    molecularFormula: 'Pd',
    molecularWeight: '106.42',
    purity: '10%',
    appearance: 'Black powder',
    description: 'A widely used heterogeneous catalyst in organic chemistry.',
    storage: 'Room Temperature',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-C001',
    chemicalName: 'Palladium on Carbon'
  },
  {
    name: 'Platinum Oxide',
    categoryName: 'CATALYSTS',
    subCategory: 'Catalysts',
    productType: 'Other',
    casNumber: '1314-15-4',
    molecularFormula: 'PtO2',
    molecularWeight: '227.08',
    purity: '99%',
    appearance: 'Dark brown powder',
    description: 'Adams catalyst, used in hydrogenation reactions.',
    storage: 'Room Temperature',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-C002',
    chemicalName: 'Platinum(IV) oxide'
  },

  // Group: Nitroso Impurities
  {
    name: 'Vildagliptin N-Nitroso-L-Proline Methyl Ester',
    categoryName: 'NITROSO IMPURITIES',
    subCategory: 'Nitroso-Impurities',
    productType: 'Impurity',
    casNumber: '35909-01-4',
    molecularFormula: 'C6H10N2O3',
    molecularWeight: '158.16',
    purity: '98%',
    appearance: 'NA',
    description: 'Nitrosamine impurity reference standard for Vildagliptin.',
    storage: '2-8°C Refrigerator',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-V0718',
    chemicalName: '1-Nitroso-L-proline methyl ester'
  },
  {
    name: 'N-Nitrosodimethylamine (NDMA)',
    categoryName: 'NITROSO IMPURITIES',
    subCategory: 'Nitroso-Impurities',
    productType: 'Impurity',
    casNumber: '62-75-9',
    molecularFormula: 'C2H6N2O',
    molecularWeight: '74.08',
    purity: '99%',
    appearance: 'Yellow liquid',
    description: 'Nitrosamine impurity reference standard.',
    storage: '2-8°C Refrigerator',
    shippingConditions: 'Ambient',
    catalogueNumber: 'GL-N001',
    chemicalName: 'N,N-Dimethylnitrous amide'
  },
  
  // Group: Peptides
  {
    name: 'Glucagon-like peptide-1 (GLP-1)',
    categoryName: 'PEPTIDES',
    subCategory: 'Peptides',
    productType: 'API',
    casNumber: '89750-14-1',
    molecularFormula: 'C149H226N40O45',
    molecularWeight: '3297.6',
    purity: '95%',
    appearance: 'White powder',
    description: 'A neuropeptide and an incretin derived from the transcription product of the proglucagon gene.',
    storage: '-20°C',
    shippingConditions: 'Dry Ice',
    catalogueNumber: 'GL-P001',
    chemicalName: 'GLP-1 (7-36) amide'
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    // Clear existing dummy data to avoid unwanted duplicates
    await Product.deleteMany({});
    console.log('Cleared existing products...');

    // Fetch all categories to map them
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.categoryName] = cat._id;
    });

    // Insert the products
    for (let i = 0; i < dummyProducts.length; i++) {
      const prodData = { ...dummyProducts[i] };
      const catId = categoryMap[prodData.categoryName];
      
      if (!catId) {
        console.log(`Warning: Category ${prodData.categoryName} not found, skipping ${prodData.name}`);
        continue;
      }
      
      prodData.category = catId;
      delete prodData.categoryName; // Remove the temporary key

      await Product.create(prodData);
      console.log(`Created product: ${prodData.name} in category ${dummyProducts[i].categoryName}`);
    }

    console.log('Dummy products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
