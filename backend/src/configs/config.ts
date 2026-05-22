import logger from '../libs/logger';

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_NAME: string;
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  EMAIL_FROM: string;
  RESEND_API_KEY?: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  PAYSTACK_PUBLIC_KEY: string;
  PAYSTACK_SECRET_KEY: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'FRONTEND_URL',
  'EMAIL_FROM',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'PAYSTACK_PUBLIC_KEY',
  'PAYSTACK_SECRET_KEY',
];

export const validateConfig = (): Config => {
  const config: Partial<Config> = {};

  // Validate required env vars
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value) {
      logger.error(`Missing required environment variable: ${varName}`);
      process.exit(1);
    }
    (config as any)[varName] = value;
  }

  // Set defaults for optional vars
  config.NODE_ENV = process.env.NODE_ENV || 'development';
  config.PORT = parseInt(process.env.PORT || '3000', 10);
  config.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  config.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';
  config.CORS_ORIGIN =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000';
  config.RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (config.NODE_ENV !== 'development' && !config.RESEND_API_KEY) {
    logger.error('RESEND_API_KEY is required in production');
    process.exit(1);
  }

  logger.info('Configuration validated successfully');
  return config as Config;
};

export const config = validateConfig();
