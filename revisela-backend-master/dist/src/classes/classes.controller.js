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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const create_class_dto_1 = require("./dto/create-class.dto");
const update_class_dto_1 = require("./dto/update-class.dto");
const join_class_dto_1 = require("./dto/join-class.dto");
const manage_member_dto_1 = require("./dto/manage-member.dto");
const add_content_dto_1 = require("./dto/add-content.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const zod_1 = require("zod");
let ClassesController = class ClassesController {
    classesService;
    constructor(classesService) {
        this.classesService = classesService;
    }
    async create(createClassDto, req) {
        try {
            create_class_dto_1.createClassSchema.parse(createClassDto);
            return this.classesService.create(createClassDto, req.user.userId);
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
    async findAll(req) {
        return this.classesService.findAll(req.user.userId);
    }
    async findOne(id, req) {
        return this.classesService.findOne(id, req.user.userId);
    }
    async update(id, updateClassDto, req) {
        try {
            update_class_dto_1.updateClassSchema.parse(updateClassDto);
            return this.classesService.update(id, updateClassDto, req.user.userId);
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
    async remove(id, req) {
        return this.classesService.remove(id, req.user.userId);
    }
    async joinClass(joinClassDto, req) {
        try {
            join_class_dto_1.joinClassSchema.parse(joinClassDto);
            return this.classesService.joinClass(joinClassDto, req.user.userId);
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
    async leaveClass(id, req) {
        return this.classesService.leaveClass(id, req.user.userId);
    }
    async addMembers(id, addMembersDto, req) {
        try {
            manage_member_dto_1.addMembersSchema.parse(addMembersDto);
            return this.classesService.addMembers(id, addMembersDto, req.user.userId);
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
    async updateMemberAccess(id, userId, manageMemberDto, req) {
        try {
            const fullDto = { ...manageMemberDto, userId };
            manage_member_dto_1.manageMemberSchema.parse(fullDto);
            return this.classesService.updateMemberAccess(id, fullDto, req.user.userId);
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
    async removeMember(id, userId, req) {
        const removeMemberDto = { userId };
        return this.classesService.removeMember(id, removeMemberDto, req.user.userId);
    }
    async addQuiz(id, addQuizDto, req) {
        try {
            add_content_dto_1.addQuizToClassSchema.parse(addQuizDto);
            return this.classesService.addQuiz(id, addQuizDto, req.user.userId);
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
    async removeQuiz(id, quizId, req) {
        const removeQuizDto = { quizId };
        return this.classesService.removeQuiz(id, removeQuizDto, req.user.userId);
    }
    async addFolder(id, addFolderDto, req) {
        try {
            add_content_dto_1.addFolderToClassSchema.parse(addFolderDto);
            return this.classesService.addFolder(id, addFolderDto, req.user.userId);
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
    async removeFolder(id, folderId, req) {
        const removeFolderDto = { folderId };
        return this.classesService.removeFolder(id, removeFolderDto, req.user.userId);
    }
    async archiveClass(id, req) {
        return this.classesService.archiveClass(id, req.user.userId);
    }
    async restoreClass(id, req) {
        return this.classesService.restoreClass(id, req.user.userId);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "joinClass", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "leaveClass", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "addMembers", null);
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
], ClassesController.prototype, "updateMemberAccess", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)(':id/quizzes'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "addQuiz", null);
__decorate([
    (0, common_1.Delete)(':id/quizzes/:quizId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('quizId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "removeQuiz", null);
__decorate([
    (0, common_1.Post)(':id/folders'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "addFolder", null);
__decorate([
    (0, common_1.Delete)(':id/folders/:folderId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "removeFolder", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "archiveClass", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "restoreClass", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map