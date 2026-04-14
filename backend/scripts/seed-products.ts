import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';
import { Category } from '../src/models/Category';
import { Product } from '../src/models/Product';
import { Subcategory } from '../src/models/SubCategory';
import { User } from '../src/models/User';

dotenv.config();

interface SeedProduct {
  name: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  category: string; // category name
  subcategory?: string; // subcategory name
  brand?: string;
  tags: string[];
  isPublished: boolean;
  visibility: 'public' | 'private' | 'archived';
  images?: {
    url: string;
    publicId: string;
    isThumbnail: boolean;
  }[];
  // optional flash sale configuration
  flashSale?: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
  };
  // simple flag for best seller products
  isBestSeller?: boolean;
}

const seedProducts: SeedProduct[] = [
  // Electronics - Smartphones
  {
    name: 'iPhone 15 Pro Max',
    description:
      'Latest Apple flagship smartphone with A17 Pro chip, titanium design, and advanced camera system',
    sku: 'APPLE-IP15PM-001',
    basePrice: 1950000,
    stock: 25,
    category: 'Electronics',
    subcategory: 'Smartphones',
    // example flash sale and best seller flag
    flashSale: {
      discountType: 'percentage',
      discountValue: 10,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      isActive: true,
    },
    isBestSeller: true,
    brand: 'Apple',
    tags: ['smartphone', 'ios', 'flagship', 'apple'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/iphone-15-1',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with Snapdragon 8 Gen 3, 200MP camera, and dynamic AMOLED display',
    sku: 'SAMSUNG-S24U-001',
    basePrice: 1850000,
    stock: 30,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    tags: ['smartphone', 'android', 'flagship', 'samsung'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1707028148873-104c8f537dbd?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/galaxy-s24-1',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Google Pixel 8 Pro',
    description:
      'Google flagship with Tensor G3, advanced AI features, and exceptional computational photography',
    sku: 'GOOGLE-P8P-001',
    basePrice: 1300000,
    stock: 20,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Google',
    tags: ['smartphone', 'android', 'pixel', 'google'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1696446702105-02fce270eb59?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/google-pixel-8-pro',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'OnePlus 12',
    description:
      'Fast and smooth Android experience with Snapdragon 8 Gen 3, 120Hz AMOLED display, and 100W charging',
    sku: 'ONEPLUS-12-001',
    basePrice: 1100000,
    stock: 40,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'OnePlus',
    tags: ['smartphone', 'android', 'gaming', 'oneplus'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1707297920786-81cf137d6e7f?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/oneplus-12',
        isThumbnail: true,
      },
    ],
  },

  // Electronics - Laptops
  {
    name: 'MacBook Pro 16" M3 Max',
    description:
      'Powerful laptop for professionals with M3 Max chip, 16" Liquid Retina XDR display, and exceptional battery life',
    sku: 'APPLE-MBP16M3-001',
    basePrice: 5600000,
    stock: 15,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Apple',
    tags: ['laptop', 'macbook', 'professional', 'apple'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/macbook-pro-16-m3-max',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Dell XPS 15',
    description:
      'Premium Windows laptop with Intel Core i9, RTX 4090, 15.6" OLED display, and sleek design',
    sku: 'DELL-XPS15-001',
    basePrice: 2500000,
    stock: 18,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Dell',
    tags: ['laptop', 'windows', 'gaming', 'professional'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/dell-xps-15',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description:
      'Business laptop with Intel vPro, 14" IPS display, excellent keyboard, and portability',
    sku: 'LENOVO-X1C-001',
    basePrice: 1950000,
    stock: 22,
    category: 'Electronics',
    subcategory: 'Laptops & Computers',
    brand: 'Lenovo',
    tags: ['laptop', 'business', 'windows', 'lenovo'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/lenovo-thinkpad-x1-carbon',
        isThumbnail: true,
      },
    ],
  },

  // Electronics - Headphones
  {
    name: 'Sony WH-1000XM5',
    description:
      'Premium noise-cancelling headphones with 30-hour battery life, industry-leading ANC, and premium sound',
    sku: 'SONY-WH1000XM5-001',
    basePrice: 480000,
    stock: 35,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Sony',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'premium'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/sony-wh-1000xm5',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description:
      'Premium in-ear headphones with ANC, spatial audio, seamless Apple integration, and 6-hour battery',
    sku: 'APPLE-AIRPODS2-001',
    basePrice: 350000,
    stock: 50,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Apple',
    tags: ['earbuds', 'wireless', 'airpods', 'apple'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/apple-airpods-pro-2nd-gen',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    description:
      'Bose premium headphones with industry-leading noise cancellation and immersive sound quality',
    sku: 'BOSE-QCU-001',
    basePrice: 550000,
    stock: 25,
    category: 'Electronics',
    subcategory: 'Headphones & Audio',
    brand: 'Bose',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'bose'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/bose-quietcomfort-ultra',
        isThumbnail: true,
      },
    ],
  },

  // Fashion - Men's Clothing
  {
    name: 'Premium Cotton T-Shirt',
    description:
      'Classic mens t-shirt made from 100% premium cotton with comfortable fit and durability',
    sku: 'FASHION-TSHIRT-001',
    basePrice: 15000,
    stock: 100,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    brand: 'ClassicWear',
    tags: ['clothing', 'tshirt', 'mens', 'casual'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/premium-cotton-tshirt',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Formal Business Shirt',
    description:
      'Professional formal shirt in white and blue, perfect for office and business meetings',
    sku: 'FASHION-FORMAL-001',
    basePrice: 25000,
    stock: 60,
    category: 'Fashion',
    subcategory: "Men's Clothing",
    brand: 'FormalWear',
    tags: ['clothing', 'formal', 'mens', 'business'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/formal-business-shirt',
        isThumbnail: true,
      },
    ],
  },

  // Fashion - Shoes
  {
    name: 'Running Athletic Shoes',
    description:
      'Lightweight running shoes with cushioned sole, breathable mesh, and excellent support',
    sku: 'FASHION-RUNNING-001',
    basePrice: 55000,
    stock: 80,
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'SportGear',
    tags: ['shoes', 'running', 'athletic', 'sports'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/running-athletic-shoes',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Casual Sneakers',
    description:
      'Trendy casual sneakers in multiple colors with comfortable padding and stylish design',
    sku: 'FASHION-SNEAKER-001',
    basePrice: 45000,
    stock: 90,
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'StreetStyle',
    tags: ['shoes', 'sneakers', 'casual', 'mens'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/casual-sneakers',
        isThumbnail: true,
      },
    ],
  },

  // Home & Garden - Furniture
  {
    name: 'Wooden Dining Table',
    description:
      'Elegant dining table made from solid wood, seats 6 people, with beautiful finish',
    sku: 'HOME-DINING-001',
    basePrice: 350000,
    stock: 12,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    brand: 'HomeDecor',
    tags: ['furniture', 'dining', 'wooden', 'home'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580974511812-4b71eceb14ba?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/wooden-dining-table',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Comfortable Office Chair',
    description:
      'Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back',
    sku: 'HOME-CHAIR-001',
    basePrice: 120000,
    stock: 40,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    brand: 'OfficeMax',
    tags: ['furniture', 'chair', 'office', 'ergonomic'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/comfortable-office-chair',
        isThumbnail: true,
      },
    ],
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat',
    description:
      'Premium non-slip yoga mat with extra cushioning for comfort during exercise',
    sku: 'SPORTS-YOGA-001',
    basePrice: 20000,
    stock: 150,
    category: 'Sports & Outdoors',
    subcategory: 'Fitness Equipment',
    brand: 'FitLife',
    tags: ['yoga', 'fitness', 'mat', 'exercise'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/yoga-mat',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Camping Tent',
    description:
      '4-person camping tent with waterproof material and easy setup for outdoor adventures',
    sku: 'SPORTS-TENT-001',
    basePrice: 85000,
    stock: 30,
    category: 'Sports & Outdoors',
    subcategory: 'Outdoor Gear',
    brand: 'OutdoorGear',
    tags: ['camping', 'tent', 'outdoor', 'adventure'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390224-ddc78d067cc3?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/camping-tent',
        isThumbnail: true,
      },
    ],
  },

  // Books & Media
  {
    name: 'The Art of Programming',
    description:
      'Comprehensive guide to programming concepts and best practices for developers',
    sku: 'BOOKS-PROG-001',
    basePrice: 18000,
    stock: 50,
    category: 'Books & Media',
    subcategory: 'Non-Fiction Books',
    brand: 'TechPress',
    tags: ['book', 'programming', 'education', 'technology'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/the-art-of-programming',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Fiction Adventure Novel',
    description:
      'Thrilling adventure novel with engaging characters and unexpected plot twists',
    sku: 'BOOKS-FICTION-001',
    basePrice: 10000,
    stock: 80,
    category: 'Books & Media',
    subcategory: 'Fiction Books',
    brand: 'NovelPress',
    tags: ['book', 'fiction', 'adventure', 'novel'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/fiction-adventure-novel',
        isThumbnail: true,
      },
    ],
  },

  // Beauty & Personal Care
  {
    name: 'Moisturizing Face Cream',
    description:
      'Hydrating face cream with natural ingredients for soft and glowing skin',
    sku: 'BEAUTY-CREAM-001',
    basePrice: 12000,
    stock: 200,
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    brand: 'BeautySpa',
    tags: ['skincare', 'cream', 'moisturizer', 'natural'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/moisturizing-face-cream',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Premium Makeup Set',
    description:
      'Complete makeup set with foundation, lipstick, eyeshadow, and brushes',
    sku: 'BEAUTY-MAKEUP-001',
    basePrice: 45000,
    stock: 75,
    category: 'Beauty & Personal Care',
    subcategory: 'Makeup',
    brand: 'GlamourPro',
    tags: ['makeup', 'cosmetics', 'beauty', 'set'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/premium-makeup-set',
        isThumbnail: true,
      },
    ],
  },

  // Toys & Games
  {
    name: 'Action Figure Collection',
    description:
      'Set of 5 detailed action figures with articulated joints and accessories',
    sku: 'TOYS-ACTION-001',
    basePrice: 35000,
    stock: 60,
    category: 'Toys & Games',
    subcategory: 'Action Figures',
    brand: 'ActionPlay',
    tags: ['toys', 'action-figures', 'collectibles', 'figurines'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608248593842-8021c6a8b13c?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/action-figure-collection',
        isThumbnail: true,
      },
    ],
  },
  {
    name: 'Latest AAA Video Game',
    description:
      'Epic adventure video game for PS5/Xbox Series X with stunning graphics and immersive gameplay',
    sku: 'GAMES-AAA-001',
    basePrice: 95000,
    stock: 45,
    category: 'Toys & Games',
    subcategory: 'Video Games',
    brand: 'GameStudio',
    tags: ['video-game', 'gaming', 'ps5', 'xbox'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/latest-aaa-video-game',
        isThumbnail: true,
      },
    ],
  },

  // Automotive
  {
    name: 'Car Seat Covers Set',
    description:
      'Premium car seat covers with cushioning for comfort and protection',
    sku: 'AUTO-SEAT-001',
    basePrice: 40000,
    stock: 55,
    category: 'Automotive',
    subcategory: 'Car Accessories',
    brand: 'AutoCare',
    tags: ['car-accessories', 'seat-covers', 'automotive'],
    isPublished: true,
    visibility: 'public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605335520979-11ba10dd06a2?auto=format&fit=crop&w=500&q=80',
        publicId: 'vendorease/products/car-seat-covers-set',
        isThumbnail: true,
      },
    ],
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

async function seedProductsData(): Promise<void> {
  try {
    await connectDB();

    // Get a default user (admin) who will be the creator
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      logger.error('No admin user found. Please create an admin user first.');
      await disconnectDB();
      process.exit(1);
    }

    logger.info(`Using admin user: ${adminUser.name} (${adminUser.email})`);

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const seedProduct of seedProducts) {
      try {
        // Check if product already exists by SKU
        const existingProduct = await Product.findOne({ sku: seedProduct.sku });

        if (existingProduct) {
          logger.warn(
            `Product with SKU "${seedProduct.sku}" already exists. Skipping...`
          );
          skippedCount++;
          continue;
        }

        // Find category
        const category = await Category.findOne({
          name: seedProduct.category,
        });

        if (!category) {
          logger.error(
            `Category "${seedProduct.category}" not found for product "${seedProduct.name}"`
          );
          errorCount++;
          continue;
        }

        // Find subcategory if provided
        let subcategoryId: mongoose.Types.ObjectId | undefined;
        if (seedProduct.subcategory) {
          const subcategory = await Subcategory.findOne({
            name: seedProduct.subcategory,
          });

          if (!subcategory) {
            logger.error(
              `Subcategory "${seedProduct.subcategory}" not found for product "${seedProduct.name}"`
            );
            errorCount++;
            continue;
          }

          subcategoryId = subcategory._id;
        }

        // Create product (include optional flashSale and best‑seller flags)
        const newProduct = await Product.create({
          name: seedProduct.name,
          description: seedProduct.description,
          sku: seedProduct.sku,
          basePrice: seedProduct.basePrice,
          stock: seedProduct.stock,
          category: category._id,
          subcategory: subcategoryId,
          brand: seedProduct.brand,
          tags: seedProduct.tags,
          isPublished: seedProduct.isPublished,
          visibility: seedProduct.visibility,
          images: seedProduct.images || [],
          // pass through extra fields if provided
          flashSale: seedProduct.flashSale,
          isBestSeller: seedProduct.isBestSeller,
          createdBy: adminUser._id,
        });

        logger.info(`Created product: ${newProduct.name} (${newProduct.sku})`);
        createdCount++;
      } catch (error) {
        logger.error(
          `Failed to create product "${seedProduct.name}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        errorCount++;
      }
    }

    logger.info(
      `\n========== PRODUCT SEED COMPLETE ==========\nCreated: ${createdCount} products\nSkipped: ${skippedCount} products\nErrors: ${errorCount}\nTotal: ${seedProducts.length}\n=========================================`
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
seedProductsData().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
