import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        user: import("../users/schemas/user.schema").UserDocument;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        access_token: string;
    }>;
}
