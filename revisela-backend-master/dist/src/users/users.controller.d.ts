import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { S3Service } from '../s3/s3.service';
export declare class UsersController {
    private readonly usersService;
    private readonly s3Service;
    constructor(usersService: UsersService, s3Service: S3Service);
    create(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").User>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    findByEmail(email: string): Promise<import("./schemas/user.schema").User>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User | null>;
    remove(id: string): Promise<import("./schemas/user.schema").User | null>;
    getProfile(req: any): Promise<import("./schemas/user.schema").User>;
    uploadProfileImage(req: any, file: Express.Multer.File): Promise<{
        key: string;
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    }>;
}
