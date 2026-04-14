import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';
import { Category } from '../src/models/Category';
import { Subcategory } from '../src/models/SubCategory';

dotenv.config();

interface SeedSubcategory {
  name: string;
  slug: string;
  category: string; // category name
  description: string;
  isPublished: boolean;
}

const seedSubcategories: SeedSubcategory[] = [
  // Electronics subcategories
  {
    name: 'Smartphones',
    slug: 'smartphones',
    category: 'Electronics',
    description: 'Mobile phones and smartphones from various brands',
    isPublished: true,
  },
  {
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    category: 'Electronics',
    description: 'Laptops, desktop computers, and computer components',
    isPublished: true,
  },
  {
    name: 'Headphones & Audio',
    slug: 'headphones-audio',
    category: 'Electronics',
    description: 'Headphones, speakers, and audio equipment',
    isPublished: true,
  },
  {
    name: 'Cameras',
    slug: 'cameras',
    category: 'Electronics',
    description: 'Digital cameras and photography equipment',
    isPublished: true,
  },

  // Fashion subcategories
  {
    name: "Men's Clothing",
    slug: 'mens-clothing',
    category: 'Fashion',
    description: 'Shirts, pants, jackets, and other mens apparel',
    isPublished: true,
  },
  {
    name: "Women's Clothing",
    slug: 'womens-clothing',
    category: 'Fashion',
    description: 'Dresses, tops, pants, and other womens apparel',
    isPublished: true,
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    category: 'Fashion',
    description: 'Footwear for men, women, and children',
    isPublished: true,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    category: 'Fashion',
    description: 'Bags, belts, scarves, hats, and other accessories',
    isPublished: true,
  },

  // Home & Garden subcategories
  {
    name: 'Furniture',
    slug: 'furniture',
    category: 'Home & Garden',
    description: 'Bedroom, living room, and kitchen furniture',
    isPublished: true,
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    category: 'Home & Garden',
    description: 'Wall art, mirrors, plants, and decorative items',
    isPublished: true,
  },
  {
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    category: 'Home & Garden',
    description: 'Kitchen appliances, cookware, and dining sets',
    isPublished: true,
  },

  // Sports & Outdoors subcategories
  {
    name: 'Fitness Equipment',
    slug: 'fitness-equipment',
    category: 'Sports & Outdoors',
    description: 'Dumbbells, treadmills, yoga mats, and fitness gear',
    isPublished: true,
  },
  {
    name: 'Outdoor Gear',
    slug: 'outdoor-gear',
    category: 'Sports & Outdoors',
    description: 'Camping equipment, hiking gear, and outdoor accessories',
    isPublished: true,
  },
  {
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    category: 'Sports & Outdoors',
    description: 'Balls, bats, rackets, and other sports equipment',
    isPublished: true,
  },

  // Books & Media subcategories
  {
    name: 'Fiction Books',
    slug: 'fiction-books',
    category: 'Books & Media',
    description: 'Novels, short stories, and fiction literature',
    isPublished: true,
  },
  {
    name: 'Non-Fiction Books',
    slug: 'non-fiction-books',
    category: 'Books & Media',
    description: 'Educational, self-help, and non-fiction books',
    isPublished: true,
  },

  // Beauty & Personal Care subcategories
  {
    name: 'Skincare',
    slug: 'skincare',
    category: 'Beauty & Personal Care',
    description: 'Face creams, serums, masks, and skincare products',
    isPublished: true,
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    category: 'Beauty & Personal Care',
    description: 'Foundation, lipstick, eyeshadow, and makeup products',
    isPublished: true,
  },

  // Toys & Games subcategories
  {
    name: 'Action Figures',
    slug: 'action-figures',
    category: 'Toys & Games',
    description: 'Action figures and collectible toys',
    isPublished: true,
  },
  {
    name: 'Video Games',
    slug: 'video-games',
    category: 'Toys & Games',
    description: 'Video games for various gaming platforms',
    isPublished: true,
  },

  // Automotive subcategories
  {
    name: 'Car Accessories',
    slug: 'car-accessories',
    category: 'Automotive',
    description: 'Seat covers, floor mats, and car accessories',
    isPublished: true,
  },
  {
    name: 'Car Care',
    slug: 'car-care',
    category: 'Automotive',
    description: 'Car cleaning and maintenance products',
    isPublished: true,
  },
];

async function connectDB(): Promise<void> {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/VendorEase';

    await mongoose.connect(mongoUri);
    logger.info(`MongoDB connected to: ${mongoUri}`);
  } catch (error) {
    logger.error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
}

async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error(
      `Failed to disconnect from MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
}

async function runSeedSubcategories(): Promise<void> {
  try {
    await connectDB();

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const seedSubcategory of seedSubcategories) {
      try {
        // Find the category by name
        const category = await Category.findOne({
          name: seedSubcategory.category,
        });

        if (!category) {
          logger.error(
            `Category "${seedSubcategory.category}" not found for subcategory "${seedSubcategory.name}". Please run seed-categories.ts first.`
          );
          errorCount++;
          continue;
        }

        // Check if subcategory already exists
        const existingSubcategory = await Subcategory.findOne({
          name: seedSubcategory.name,
          category: category._id,
        });

        if (existingSubcategory) {
          logger.warn(
            `Subcategory "${seedSubcategory.name}" already exists. Skipping...`
          );
          skippedCount++;
          continue;
        }

        // Create subcategory
        const newSubcategory = await Subcategory.create({
          name: seedSubcategory.name,
          slug: seedSubcategory.slug,
          category: category._id,
          description: seedSubcategory.description,
          isPublished: seedSubcategory.isPublished,
        });

        logger.info(
          `Created subcategory: ${newSubcategory.name} (under ${seedSubcategory.category})`
        );
        createdCount++;
      } catch (error) {
        logger.error(
          `Failed to create subcategory "${seedSubcategory.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        errorCount++;
      }
    }

    logger.info(
      `\n========== SUBCATEGORY SEED COMPLETE ==========\nCreated: ${createdCount} subcategories\nSkipped: ${skippedCount} subcategories\nErrors: ${errorCount}\n============================================`
    );

    await disconnectDB();
  } catch (error) {
    logger.error(
      `Seed script failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    await disconnectDB();
    process.exit(1);
  }
}

// Run the seed script
runSeedSubcategories().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
