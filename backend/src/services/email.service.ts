import Queue from 'bull';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import { Resend } from 'resend';
import logger from '../libs/logger';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

class EmailService {
  private transporter: Transporter | null = null;
  private resendClient: Resend | null = null;
  private emailQueue: Queue.Queue | null = null;
  private useQueue = false;
  private useResend = false;

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // MailHog configuration for development
      this.transporter = nodemailer.createTransport({
        host: process.env.MAILHOG_HOST || 'localhost',
        port: Number(process.env.MAILHOG_PORT || 1025),
        secure: false,
      } as SMTPTransport.Options);
    } else if (process.env.RESEND_API_KEY) {
      this.resendClient = new Resend(process.env.RESEND_API_KEY);
      this.useResend = true;
    } else {
      logger.error(
        'No email provider configured. In production set RESEND_API_KEY, or run in development with MailHog.'
      );
    }

    // Initialize email queue only if Redis is configured
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.emailQueue = new Queue('email', { redis: redisUrl });
        this.useQueue = true;

        // Process email jobs
        this.emailQueue.process(async (job) => {
          const { to, subject, html } = job.data;
          await this.sendEmailDirect(to, subject, html);
        });

        // Handle job failures
        this.emailQueue.on('failed', (job, err) => {
          logger.error(`Email job failed: ${err.message}`, { jobId: job.id });
        });

        logger.info('Email queueing enabled with Redis');
      } catch (error) {
        logger.warn(
          'Failed to initialize Redis queue, falling back to synchronous sending',
          error
        );
        this.useQueue = false;
      }
    } else {
      logger.info('Redis not configured, emails will be sent synchronously');
    }

    if (this.transporter) {
      this.transporter.verify((error) => {
        if (error) {
          logger.error(`Email service connection error: ${error.message}`);
        } else {
          logger.info(`Email service ready (MailHog)`);
        }
      });
    } else if (this.useResend) {
      logger.info('Email service ready (Resend)');
    } else {
      logger.error('Email service disabled: no provider configured');
    }
  }

  private async sendEmailDirect(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    try {
      if (this.useResend && this.resendClient) {
        await this.resendClient.emails.send({
          from: process.env.EMAIL_FROM || 'VendorEase <noreply@yourdomain.com>',
          to,
          subject,
          html,
        });
      } else if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || 'VendorEase <noreply@yourdomain.com>',
          to,
          subject,
          html,
        });
      } else {
        throw new Error('No email provider configured');
      }

      logger.info(`Email sent to ${to}`);
    } catch (error: any) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(
      __dirname,
      '../templates',
      `${templateName}.hbs`
    );

    try {
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      logger.error(`Failed to load email template: ${templateName}`);
      throw new Error(`Email template not found: ${templateName}`);
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { to, subject, template, context } = options;

      // Load and compile template
      const templateContent = this.loadTemplate(template);
      const compiledTemplate = handlebars.compile(templateContent);
      const html = compiledTemplate(context);

      if (this.useQueue && this.emailQueue) {
        // Add to queue instead of sending directly
        await this.emailQueue.add(
          {
            to,
            subject,
            html,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
          }
        );

        logger.info(`Email queued for ${to}`);
      } else {
        // Send synchronously as fallback
        await this.sendEmailDirect(to, subject, html);
      }
    } catch (error: any) {
      logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      context: {
        name,
        verificationUrl,
        token,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        name,
        resetUrl,
        token,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async sendReferralRewardEmail(options: {
    email: string;
    name: string;
    couponCode: string;
    discountPercent: number;
    expiresAt: Date;
    referralCount: number;
  }): Promise<void> {
    const {
      email,
      name,
      couponCode,
      discountPercent,
      expiresAt,
      referralCount,
    } = options;

    await this.sendEmail({
      to: email,
      subject: 'You earned a referral coupon',
      template: 'referral-reward',
      context: {
        name,
        couponCode,
        discountPercent,
        referralCount,
        expiresAt: expiresAt.toDateString(),
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async sendReferralInviteEmail(options: {
    to: string;
    fromName: string;
    referralLink: string;
    referralCode: string;
  }): Promise<void> {
    const { to, fromName, referralLink, referralCode } = options;

    await this.sendEmail({
      to,
      subject: `${fromName} invited you to VendorEase`,
      template: 'referral-invite',
      context: {
        fromName,
        referralLink,
        referralCode,
        currentYear: new Date().getFullYear(),
      },
    });
  }

  async close(): Promise<void> {
    if (this.emailQueue) {
      await this.emailQueue.close();
    }
  }
}

export default new EmailService();
