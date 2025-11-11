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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../s3/s3.service");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const uploads_constants_1 = require("./uploads.constants");
const users_service_1 = require("../users/users.service");
const quizzes_service_1 = require("../quizzes/quizzes.service");
let UploadsController = class UploadsController {
    s3Service;
    usersService;
    quizzesService;
    constructor(s3Service, usersService, quizzesService) {
        this.s3Service = s3Service;
        this.usersService = usersService;
        this.quizzesService = quizzesService;
    }
    async getFile(key) {
        try {
            const url = await this.s3Service.getFileUrl(key);
            return { url };
        }
        catch (error) {
            throw new common_1.HttpException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.PRESIGNED_URL_FAILED, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFile(key) {
        try {
            await this.s3Service.deleteFile(key);
            return { message: uploads_constants_1.UPLOAD_MESSAGES.SUCCESS.DELETE };
        }
        catch (error) {
            throw new common_1.HttpException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.DELETE_FAILED, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadProfileImage(req, file) {
        if (!file) {
            throw new common_1.BadRequestException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.NO_FILE);
        }
        try {
            const key = await this.s3Service.uploadFile(file, uploads_constants_1.UPLOAD_FOLDERS.PROFILE_IMAGES);
            const url = await this.s3Service.getFileUrl(key);
            await this.usersService.update(req.user.userId, {
                profileImage: url,
            });
            return {
                key,
                url,
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to upload profile image', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException(uploads_constants_1.UPLOAD_MESSAGES.ERRORS.NO_FILE);
        }
        try {
            let fileType = 'unknown';
            let folder = uploads_constants_1.UPLOAD_FOLDERS.IMAGES;
            if (file.mimetype.startsWith('image/')) {
                fileType = 'image';
                folder = uploads_constants_1.UPLOAD_FOLDERS.IMAGES;
            }
            else if (file.mimetype.startsWith('audio/')) {
                fileType = 'audio';
                folder = uploads_constants_1.UPLOAD_FOLDERS.QUIZ_QUESTION_AUDIO;
            }
            const key = (await this.s3Service.uploadFile(file, folder))
                .split('/')[1]
                .split('.')[0];
            const url = await this.s3Service.getFileUrl(key);
            return {
                key,
                url,
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                type: fileType,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to upload file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Get)(':key'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getFile", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)('profile'),
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
], UploadsController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 15 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^(image|audio)\//)) {
                return callback(new common_1.BadRequestException('Only image and audio files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        users_service_1.UsersService,
        quizzes_service_1.QuizzesService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map