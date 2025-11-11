import { ConfigService } from '@nestjs/config';
export declare class UploadsConfig {
    private configService;
    readonly imageSizeLimit: number;
    readonly documentSizeLimit: number;
    readonly imagesFolderPath: string;
    readonly documentsFolderPath: string;
    constructor(configService: ConfigService);
    private getConfigSizeInBytes;
}
