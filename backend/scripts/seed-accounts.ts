import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';
import { Referral } from '../src/models/Referral';
import { User } from '../src/models/User';
import referralService from '../src/services/referral.service';

interface SeedUser {
  name: string;
  email: string;
  password: string;
  username: string;
}

const REFERRAL_CODE = 'USER-DBE2-BQPPH2';

const seedUsers: SeedUser[] = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    username: 'johndoe',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    username: 'janesmith',
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    password: 'password123',
    username: 'alicejohnson',
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    password: 'password123',
    username: 'bobwilson',
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    password: 'password123',
    username: 'caroldavis',
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

async function seedAccounts(): Promise<void> {
  try {
    await connectDB();

    // Find the referrer (user with the referral code)
    const referrer = await User.findOne({ referralCode: REFERRAL_CODE });
    if (!referrer) {
      logger.error(
        `Referrer with code ${REFERRAL_CODE} not found. Please create a user with this referral code first.`
      );
      await disconnectDB();
      process.exit(1);
    }

    logger.info(
      `Found referrer: ${referrer.name} (${referrer.email}) with referral code: ${REFERRAL_CODE}`
    );

    let createdCount = 0;
    let skippedCount = 0;

    for (const seedUser of seedUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email: seedUser.email }, { username: seedUser.username }],
        });

        if (existingUser) {
          logger.warn(
            `User with email ${seedUser.email} or username ${seedUser.username} already exists. Skipping...`
          );
          skippedCount++;
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(seedUser.password, 10);

        // Create user
        const newUser = await User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hashedPassword,
          username: seedUser.username,
          isActive: true,
          isEmailVerified: true, // Mark as verified for seed accounts
          role: 'user',
        });

        logger.info(`Created user: ${newUser.name} (${newUser.email})`);

        // Create referral record
        await Referral.create({
          referrer: referrer._id,
          referee: newUser._id,
          status: 'completed',
        });

        logger.info(
          `Created referral for ${newUser.name} with referrer ${referrer.name}`
        );
        createdCount++;
      } catch (error) {
        logger.error(
          `Failed to create user ${seedUser.email}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    logger.info(
      `\n========== SEED COMPLETE ==========\nCreated: ${createdCount} accounts\nSkipped: ${skippedCount} accounts\nReferral Code: ${REFERRAL_CODE}\n==================================`
    );

    // Trigger referral milestone rewards for the referrer
    try {
      await referralService.checkAndIssueRewards(referrer._id.toString());
      logger.info('Referral milestone rewards checked and issued if eligible.');
    } catch (rewardError) {
      logger.error(
        'Failed to check/issue referral rewards:',
        rewardError instanceof Error ? rewardError.message : rewardError
      );
    }

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
seedAccounts().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
