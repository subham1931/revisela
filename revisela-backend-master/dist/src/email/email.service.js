"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPassword = this.configService.get('SMTP_PASSWORD');
        if (smtpUser && smtpPassword) {
            this.transporter = nodemailer.createTransport({
                host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
                port: this.configService.get('SMTP_PORT', 587),
                secure: false,
                auth: {
                    user: smtpUser,
                    pass: smtpPassword,
                },
            });
        }
        else {
            this.logger.warn('SMTP credentials not configured. Email functionality will be disabled.');
            this.transporter = null;
        }
    }
    async sendInvitationEmail(to, resourceType, resourceName, shareLink, inviterName, inviterEmail) {
        if (!this.transporter) {
            this.logger.warn(`Email not sent to ${to} because SMTP is not configured. Would send invitation for ${resourceType}: ${resourceName}`);
            return;
        }
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:4000');
        const dashboardUrl = `${frontendUrl}/dashboard`;
        const resourceTypeLabel = resourceType === 'quiz' ? 'quiz' : 'folder';
        const mailOptions = {
            from: `"${inviterName}" <${this.configService.get('SMTP_FROM', inviterEmail)}>`,
            to,
            subject: `${inviterName} has shared a ${resourceTypeLabel} with you on Revisela`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sharing Notification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #0890A8; margin-top: 0;">You've been shared a resource!</h2>
              <p>
                <strong>${inviterName}</strong> (${inviterEmail}) has shared a ${resourceTypeLabel} with you on Revisela.
              </p>
              <p style="margin: 20px 0;">
                <strong>${resourceTypeLabel.charAt(0).toUpperCase() + resourceTypeLabel.slice(1)}:</strong> ${resourceName}
              </p>
              <div style="background-color: #0890A8; color: white; padding: 15px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; font-size: 16px; font-weight: bold;">
                  Log in to your dashboard to access this shared ${resourceTypeLabel}
                </p>
              </div>
              <p style="color: #666; font-size: 14px;">
                The shared ${resourceTypeLabel} will appear in your dashboard once you log in. No action is required from you at this time.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This sharing notification was sent by ${inviterName}. If you weren't expecting this email, you can safely ignore it.
              </p>
            </div>
          </body>
        </html>
      `,
            text: `
        You've been shared a resource!
        
        ${inviterName} (${inviterEmail}) has shared a ${resourceTypeLabel} with you on Revisela.
        
        ${resourceTypeLabel.charAt(0).toUpperCase() + resourceTypeLabel.slice(1)}: ${resourceName}
        
        Log in to your dashboard to access this shared ${resourceTypeLabel}. The shared resource will appear in your dashboard once you log in.
        
        This sharing notification was sent by ${inviterName}. If you weren't expecting this email, you can safely ignore it.
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Invitation email sent to ${to} for ${resourceType}: ${resourceName}`);
        }
        catch (error) {
            this.logger.error(`Failed to send invitation email to ${to}:`, error);
        }
    }
    async testEmail(to) {
        if (!this.transporter) {
            this.logger.warn('Email not sent because SMTP is not configured.');
            throw new Error('SMTP is not configured. Please set up SMTP credentials in environment variables.');
        }
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@revisela.com'),
            to,
            subject: 'Test Email from Revisela',
            text: 'This is a test email from Revisela backend.',
            html: '<p>This is a test email from Revisela backend.</p>',
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Test email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send test email to ${to}:`, error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map