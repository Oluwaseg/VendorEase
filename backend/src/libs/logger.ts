import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import crypto from 'crypto';
import { createLogger, format, transports } from 'winston';

const logtailTransports: any[] = [];

// Only initialize Logtail in production
if (process.env.NODE_ENV === 'production' && process.env.LOGTAIL_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
  logtailTransports.push(new LogtailTransport(logtail));
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, requestId, ...meta }) => {
      const id = requestId || 'unknown';
      return `[${timestamp}] [${id}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [new transports.Console(), ...logtailTransports],
});

// Audit logger for admin actions
const auditLogger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/audit.log' }),
    new transports.Console(),
    ...logtailTransports,
  ],
});

export const generateRequestId = (): string => {
  return crypto.randomBytes(8).toString('hex');
};

export const logAudit = (action: string, userId: string, details: any) => {
  auditLogger.info('AUDIT', {
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
  });
};

export default logger;
