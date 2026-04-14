# Email Service Setup

## Overview
The email service uses Nodemailer with Handlebars templates. In development, it's configured to use MailHog for testing emails locally.

## Development Setup (MailHog)

1. **Install MailHog** (if not already installed):
   ```bash
   # macOS
   brew install mailhog
   
   # Linux
   # Download from https://github.com/mailhog/MailHog/releases
   # Or use Docker:
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

2. **Start MailHog**:
   ```bash
   mailhog
   # Or if using Docker:
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

3. **Access MailHog UI**: Open http://localhost:8025 in your browser to view sent emails

4. **Environment Variables** (`.env`):
   ```env
   NODE_ENV=development
   MAILHOG_HOST=localhost
   MAILHOG_PORT=1025
   EMAIL_FROM=VendorEase <noreply@yourdomain.com>
   FRONTEND_URL=http://localhost:3000
   ```

## Production Setup (SMTP)

For production, configure SMTP settings:

```env
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=VendorEase <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

## Email Templates

Templates are located in `src/templates/`:
- `email-verification.hbs` - Email verification template
- `password-reset.hbs` - Password reset template

Templates use Handlebars syntax and support variables like `{{name}}`, `{{verificationUrl}}`, etc.

## Usage

The email service is automatically used by the auth service:
- Registration: Sends verification email
- Password Reset: Sends reset link email

No manual calls needed - it's integrated into the auth flow.
