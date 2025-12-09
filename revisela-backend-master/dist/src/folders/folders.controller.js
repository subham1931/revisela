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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const update_folder_dto_1 = require("./dto/update-folder.dto");
const share_folder_dto_1 = require("./dto/share-folder.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const duplicate_folder_dto_1 = require("./dto/duplicate-folder.dto");
const bookmark_folder_dto_1 = require("./dto/bookmark-folder.dto");
const move_items_dto_1 = require("./dto/move-items.dto");
let FoldersController = class FoldersController {
    foldersService;
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    async getBookmarkedFolders(req) {
        try {
            console.log('[Controller] Getting bookmarked folders for user:', req.user.userId);
            const bookmarkedFolders = await this.foldersService.findBookmarked(req.user.userId);
            return {
                success: true,
                count: bookmarkedFolders.length,
                data: bookmarkedFolders,
            };
        }
        catch (error) {
            console.error('[Controller] Error getting bookmarked folders:', error);
            throw new common_1.HttpException('Failed to retrieve bookmarked folders', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(createFolderDto, req) {
        try {
            create_folder_dto_1.createFolderSchema.parse(createFolderDto);
            return this.foldersService.create(createFolderDto, req.user.userId);
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
    findAll(req) {
        return this.foldersService.findAll(req.user.userId);
    }
    findAllInTrash(req) {
        return this.foldersService.findAllInTrash(req.user.userId);
    }
    restore(id, req) {
        return this.foldersService.restoreFromTrash(id, req.user.userId);
    }
    permanentlyDelete(id, req) {
        return this.foldersService.permanentlyDelete(id, req.user.userId);
    }
    async findOne(id, req) {
        const folder = await this.foldersService.findOne(id, req.user.userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        return folder;
    }
    async update(id, updateFolderDto, req) {
        try {
            update_folder_dto_1.updateFolderSchema.parse(updateFolderDto);
            return this.foldersService.update(id, updateFolderDto, req.user.userId);
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
    moveToTrash(id, req) {
        return this.foldersService.moveToTrash(id, req.user.userId);
    }
    addQuiz(id, quizId, req) {
        return this.foldersService.addQuiz(id, quizId, req.user.userId);
    }
    async shareFolder(id, shareFolderDto, req) {
        try {
            share_folder_dto_1.shareFolderSchema.parse(shareFolderDto);
            return this.foldersService.shareFolder(id, shareFolderDto, req.user.userId);
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
    async generateShareLink(id, req) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.HttpException('Invalid folder ID', common_1.HttpStatus.BAD_REQUEST);
        }
        const shareLink = await this.foldersService.generateShareLink(id, req.user.userId);
        return { link: shareLink };
    }
    async duplicate(id, duplicateFolderDto, req) {
        try {
            duplicate_folder_dto_1.duplicateFolderSchema.parse(duplicateFolderDto);
            return this.foldersService.duplicate(id, duplicateFolderDto, req.user.userId);
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
    async bookmark(id, bookmarkFolderDto, req) {
        try {
            bookmark_folder_dto_1.bookmarkFolderSchema.parse(bookmarkFolderDto);
            return this.foldersService.toggleBookmark(id, req.user.userId, bookmarkFolderDto.bookmarked);
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
    moveFolder(id, moveItemsDto, req) {
        try {
            move_items_dto_1.moveItemsSchema.parse(moveItemsDto);
        }
        catch (error) {
            throw new common_1.HttpException({ message: 'Validation failed', errors: error.errors }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.foldersService.moveFolder(id, moveItemsDto, req.user.userId);
    }
    moveQuiz(quizId, moveItemsDto, req) {
        try {
            move_items_dto_1.moveItemsSchema.parse(moveItemsDto);
        }
        catch (error) {
            throw new common_1.HttpException({ message: 'Validation failed', errors: error.errors }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.foldersService.moveQuiz(quizId, moveItemsDto, req.user.userId);
    }
    async getQuizzes(id, req) {
        return this.foldersService.findFolderQuizzes(id, req.user.userId);
    }
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Get)(':id/quizzes'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "getQuizzes", null);
__decorate([
    (0, common_1.Get)('bookmarked'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "getBookmarkedFolders", null);
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('trash'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "findAllInTrash", null);
__decorate([
    (0, common_1.Patch)('trash/:id/restore'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "restore", null);
__decorate([
    (0, common_1.Delete)('trash/:id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "permanentlyDelete", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "moveToTrash", null);
__decorate([
    (0, common_1.Post)(':id/quizzes/:quizId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('quizId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "addQuiz", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "shareFolder", null);
__decorate([
    (0, common_1.Get)(':id/share-link'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "generateShareLink", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)(':id/bookmark'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "bookmark", null);
__decorate([
    (0, common_1.Post)(':id/move'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "moveFolder", null);
__decorate([
    (0, common_1.Post)('quizzes/:quizId/move'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "moveQuiz", null);
exports.FoldersController = FoldersController = __decorate([
    (0, common_1.Controller)('folders'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map