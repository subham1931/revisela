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
exports.QuizzesController = void 0;
const common_1 = require("@nestjs/common");
const quizzes_service_1 = require("./quizzes.service");
const create_quiz_dto_1 = require("./dto/create-quiz.dto");
const update_quiz_dto_1 = require("./dto/update-quiz.dto");
const zod_1 = require("zod");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const duplicate_quiz_dto_1 = require("./dto/duplicate-quiz.dto");
const bookmark_quiz_dto_1 = require("./dto/bookmark-quiz.dto");
const share_quiz_dto_1 = require("./dto/share-quiz.dto");
let QuizzesController = class QuizzesController {
    quizzesService;
    constructor(quizzesService) {
        this.quizzesService = quizzesService;
    }
    async create(createQuizDto, req) {
        try {
            create_quiz_dto_1.createQuizSchema.parse(createQuizDto);
            return this.quizzesService.create(createQuizDto, req.user.userId);
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
    async createInFolder(folderId, createQuizDto, req) {
        try {
            create_quiz_dto_1.createQuizSchema.parse(createQuizDto);
            return this.quizzesService.createInFolder(createQuizDto, folderId, req.user.userId);
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
    async findAll(limit, offset) {
        return this.quizzesService.findAllPublic(limit, offset);
    }
    async getRecent(req, limit, offset) {
        return this.quizzesService.findRecent(
            req.user.userId,
            Number(limit) || 10,
            Number(offset) || 0
        );
    }
    async search(query, limit, offset) {
        if (!query) {
            throw new common_1.HttpException('Search query is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.quizzesService.search(query, limit, offset);
    }
    async findByTag(tag, limit, offset) {
        return this.quizzesService.findByTag(tag, limit, offset);
    }
    async findMyQuizzes(req, limit, offset) {
        return this.quizzesService.findByUser(req.user.userId, limit, offset);
    }
    findAllInTrash(req) {
        return this.quizzesService.findAllInTrash(req.user.userId);
    }
    async findBookmarked(req) {
        try {
            const bookmarkedQuizzes = await this.quizzesService.findBookmarked(req.user.userId);
            return {
                success: true,
                count: bookmarkedQuizzes.length,
                data: bookmarkedQuizzes,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                message: 'Failed to retrieve bookmarked quizzes',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    restore(id, req) {
        return this.quizzesService.restoreFromTrash(id, req.user.userId);
    }
    permanentlyDelete(id, req) {
        return this.quizzesService.permanentlyDelete(id, req.user.userId);
    }
    async findOne(id, req) {
        const quiz = await this.quizzesService.findOne(id, req.user.userId);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        return quiz;
    }
    async update(id, updateQuizDto, req) {
        try {
            update_quiz_dto_1.updateQuizSchema.parse(updateQuizDto);
            return this.quizzesService.update(id, updateQuizDto, req.user.userId);
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
        return this.quizzesService.moveToTrash(id, req.user.userId);
    }
    async duplicate(id, duplicateQuizDto, req) {
        try {
            duplicate_quiz_dto_1.duplicateQuizSchema.parse(duplicateQuizDto);
            return this.quizzesService.duplicate(id, duplicateQuizDto, req.user.userId);
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
    async bookmark(id, bookmarkQuizDto, req) {
        try {
            bookmark_quiz_dto_1.bookmarkQuizSchema.parse(bookmarkQuizDto);
            return this.quizzesService.toggleBookmark(id, req.user.userId, bookmarkQuizDto.bookmarked);
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
    async shareQuiz(id, shareQuizDto, req) {
        try {
            share_quiz_dto_1.shareQuizSchema.parse(shareQuizDto);
            return this.quizzesService.shareQuiz(id, shareQuizDto, req.user.userId);
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
    generateShareLink(id, req) {
        return this.quizzesService.generateShareLink(id, req.user.userId);
    }
    async updateMemberAccess(id, userId, body, req) {
        return this.quizzesService.updateMemberAccess(id, userId, body.accessLevel, req.user.userId);
    }
    async removeMember(id, userId, req) {
        return this.quizzesService.removeMember(id, userId, req.user.userId);
    }
};
exports.QuizzesController = QuizzesController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('folder/:folderId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "createInFolder", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('tags/:tag'),
    __param(0, (0, common_1.Param)('tag')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findByTag", null);
__decorate([
    (0, common_1.Get)('my-quizzes'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findMyQuizzes", null);
__decorate([
    (0, common_1.Get)('trash'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "findAllInTrash", null);
__decorate([
    (0, common_1.Get)('bookmarked'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findBookmarked", null);
__decorate([
    (0, common_1.Patch)('trash/:id/restore'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "restore", null);
__decorate([
    (0, common_1.Delete)('trash/:id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "permanentlyDelete", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "moveToTrash", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)(':id/bookmark'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "bookmark", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "shareQuiz", null);
__decorate([
    (0, common_1.Get)(':id/share-link'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "generateShareLink", null);
__decorate([
    (0, common_1.Patch)(':id/members/:userId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "updateMemberAccess", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "removeMember", null);
exports.QuizzesController = QuizzesController = __decorate([
    (0, common_1.Controller)('quizzes'),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
//# sourceMappingURL=quizzes.controller.js.map