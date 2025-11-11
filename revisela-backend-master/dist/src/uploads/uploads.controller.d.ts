import { S3Service } from '../s3/s3.service';
import { UsersService } from '../users/users.service';
import { QuizzesService } from '../quizzes/quizzes.service';
export declare class UploadsController {
    private readonly s3Service;
    private readonly usersService;
    private readonly quizzesService;
    constructor(s3Service: S3Service, usersService: UsersService, quizzesService: QuizzesService);
    getFile(key: string): Promise<{
        url: string;
    }>;
    deleteFile(key: string): Promise<{
        message: string;
    }>;
    uploadProfileImage(req: any, file: Express.Multer.File): Promise<{
        key: string;
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
    uploadFile(file: Express.Multer.File): Promise<{
        key: string;
        url: string;
        filename: string;
        mimetype: string;
        size: number;
        type: string;
    }>;
}
