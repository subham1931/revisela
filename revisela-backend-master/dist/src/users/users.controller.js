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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const zod_1 = require("zod");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../s3/s3.service");
const uploads_constants_1 = require("../uploads/uploads.constants");
let UsersController = class UsersController {
    usersService;
    s3Service;
    constructor(usersService, s3Service) {
        this.usersService = usersService;
        this.s3Service = s3Service;
    }
    async create(createUserDto) {
        try {
            create_user_dto_1.createUserSchema.parse(createUserDto);
            return this.usersService.create(createUserDto);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                throw new common_1.HttpException({
                    message: 'Validation failed',
                    errors: error.errors,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    }
    findAll() {
        return this.usersService.findAll();
    }
    async findByEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            update_user_dto_1.updateUserSchema.parse(updateUserDto);
            const existingUser = await this.usersService.findOne(id);
            if (!existingUser) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            return this.usersService.update(id, updateUserDto);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                throw new common_1.HttpException({
                    message: 'Validation failed',
                    errors: error.errors,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    }
    async remove(id) {
        return this.usersService.remove(id);
    }
    async getProfile(req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async uploadProfileImage(req, file) {
        if (!file) {
            throw new common_1.BadRequestException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.NO_FILE);
        }
        try {
            /* S3 Upload commented out
            const key = await this.s3Service.uploadFile(file, 'profile-images');
            const url = await this.s3Service.getFileUrl(key);
            */

            // Local File Save
            const uploadDir = path.join(process.cwd(), 'uploads', 'profile-images');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            // Generate unique filename
            const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            const filepath = path.join(uploadDir, filename);
            // Write file
            fs.writeFileSync(filepath, file.buffer);
            // Construct absolute URL
            const protocol = req.protocol;
            const host = req.get('host');
            const url = `${protocol}://${host}/uploads/profile-images/${filename}`;
            const user = await this.usersService.update(req.user.userId, {
                profileImage: url,
            });
            return {
                // key,
                url,
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            };
        }
        catch (error) {
            console.error('Profile upload error:', error);
            throw new common_1.HttpException('Failed to upload profile image', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('profile/image'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        limits: {
            fileSize: uploads_constants_1.FILE_SIZE_LIMITS.IMAGE,
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(uploads_constants_1.MIME_TYPE_REGEX.IMAGE)) {
                return callback(new common_1.BadRequestException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.ONLY_IMAGES), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfileImage", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
    s3_service_1.S3Service])
], UsersController);
//# sourceMappingURL=users.controller.js.map