import mongoose from 'mongoose';
import logger from '../libs/logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/VendorEase';

    await mongoose.connect(mongoUri);

    logger.info(`MongoDB connected to: ${mongoUri}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost');
    });

    mongoose.connection.on('error', (error) => {
      logger.error(`MongoDB connection error: ${error.message}`);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
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
};

export { connectDB, disconnectDB };
