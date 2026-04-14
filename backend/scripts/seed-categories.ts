import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';
import { Category } from '../src/models/Category';

dotenv.config();

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  isPublished: boolean;
}

const seedCategories: SeedCategory[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets including smartphones, laptops, and accessories',
    isPublished: true,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and fashion accessories for men, women, and kids',
    isPublished: true,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home furniture, decor, and garden equipment',
    isPublished: true,
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment, outdoor gear, and fitness products',
    isPublished: true,
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, ebooks, movies, and digital media',
    isPublished: true,
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Cosmetics, skincare, and personal care products',
    isPublished: true,
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Toys, board games, video games, and entertainment products',
    isPublished: true,
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car accessories, parts, and automotive products',
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

async function seedCategoriesFromData(): Promise<void> {
  try {
    await connectDB();

    let createdCount = 0;
    let skippedCount = 0;

    for (const seedCategory of seedCategories) {
      try {
        // Check if category already exists
        const existingCategory = await Category.findOne({
          $or: [{ name: seedCategory.name }, { slug: seedCategory.slug }],
        });

        if (existingCategory) {
          logger.warn(
            `Category "${seedCategory.name}" already exists. Skipping...`
          );
          skippedCount++;
          continue;
        }

        // Create category
        const newCategory = await Category.create(seedCategory);

        logger.info(`Created category: ${newCategory.name}`);
        createdCount++;
      } catch (error) {
        logger.error(
          `Failed to create category "${seedCategory.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    logger.info(
      `\n========== CATEGORY SEED COMPLETE ==========\nCreated: ${createdCount} categories\nSkipped: ${skippedCount} categories\n==========================================`
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
seedCategoriesFromData().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
