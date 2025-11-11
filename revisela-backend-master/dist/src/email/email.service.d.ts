import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendInvitationEmail(to: string, resourceType: 'quiz' | 'folder', resourceName: string, shareLink: string, inviterName: string, inviterEmail: string): Promise<void>;
    testEmail(to: string): Promise<void>;
}
