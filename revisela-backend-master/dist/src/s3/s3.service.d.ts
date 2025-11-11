import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private readonly s3Client;
    private readonly bucket;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    getFileUrl(key: string): string;
}
