import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import logger from '../libs/logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    // Configure transporter based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // MailHog configuration for development
      this.transporter = nodemailer.createTransport(
        {
          host: process.env.MAILHOG_HOST || 'localhost',
          port: Number(process.env.MAILHOG_PORT || 1025),
          secure: false,
        } as SMTPTransport.Options
      );
      
    } else {
      // Production SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        logger.error(`Email service connection error: ${error.message}`);
      } else {
        logger.info(
          `Email service ready (${isDevelopment ? 'MailHog' : 'SMTP'})`
        );
      }
    });
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

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'VendorEase <noreply@yourdomain.com>',
        to,
        subject,
        html,
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      logger.error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
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
}

export default new EmailService();
