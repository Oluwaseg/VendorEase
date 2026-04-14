import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../src/libs/logger';

dotenv.config();

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

async function dropDatabase(): Promise<void> {
  try {
    await connectDB();

    const dbName = mongoose.connection.name || 'VendorEase';

    logger.warn(`WARNING: About to drop database: ${dbName}`);
    logger.warn('This action cannot be undone!');

    // Drop the database
    await mongoose.connection.dropDatabase();

    logger.info(
      `\n========== DATABASE DROPPED ==========\nDatabase: ${dbName}\nStatus: Successfully dropped\n======================================`
    );

    await disconnectDB();
  } catch (error) {
    logger.error(
      `Failed to drop database: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    await disconnectDB();
    process.exit(1);
  }
}

// Run the drop database script
dropDatabase().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
