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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_schema_1 = require("./schemas/class.schema");
const users_service_1 = require("../users/users.service");
const quizzes_service_1 = require("../quizzes/quizzes.service");
const folders_service_1 = require("../folders/folders.service");
let ClassesService = class ClassesService {
    classModel;
    usersService;
    quizzesService;
    foldersService;
    constructor(classModel, usersService, quizzesService, foldersService) {
        this.classModel = classModel;
        this.usersService = usersService;
        this.quizzesService = quizzesService;
        this.foldersService = foldersService;
    }
    generateClassCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async generateUniqueClassCode() {
        let classCode = '';
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        while (!isUnique && attempts < maxAttempts) {
            classCode = this.generateClassCode();
            const existingClass = await this.classModel.findOne({ classCode }).exec();
            if (!existingClass) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new common_1.HttpException('Unable to generate unique class code. Please try again.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return classCode;
    }
    async create(createClassDto, userId) {
        const classCode = await this.generateUniqueClassCode();
        const newClass = new this.classModel({
            ...createClassDto,
            classCode,
            owner: userId,
            members: [],
        });
        const savedClass = await newClass.save();
        return this.findOne(savedClass._id.toString(), userId);
    }
    async findAll(userId) {
        const classes = await this.classModel
            .find({
                $or: [{ owner: userId }, { 'members.user': userId }],
                isArchived: false,
            })
            .populate('owner', 'name username email')
            .populate('members.user', 'name username email')
            .populate('quizzes', 'title description isPublic')
            .populate('folders', 'name description')
            .sort({ createdAt: -1 })
            .exec();
        return classes.map((classDoc) => this.addUserMetadata(classDoc, userId));
    }
    async findOne(id, userId) {
        const classDoc = await this.classModel
            .findById(id)
            .populate('owner', 'name username email')
            .populate('members.user', 'name username email')
            .populate('joinRequests.user', 'name username email profileImage')
            .populate('quizzes', 'title description isPublic createdBy')
            .populate('folders', 'name description owner')
            .exec();
        if (!classDoc) {
            throw new common_1.HttpException('Class not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (userId && !this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.MEMBER)) {
            // Return limited data for non-members so they can see the "Request to Join" page
            const limitedData = this.addUserMetadata(classDoc, userId);
            limitedData.folders = [];
            limitedData.quizzes = [];
            limitedData.members = [];

            // Filter joinRequests to only show current user's request
            if (limitedData.joinRequests && Array.isArray(limitedData.joinRequests)) {
                limitedData.joinRequests = limitedData.joinRequests.filter(req => {
                    const reqUserId = req.user._id ? req.user._id.toString() : req.user.toString();
                    return reqUserId === userId;
                });
            }

            return limitedData;
        }
        return userId
            ? this.addUserMetadata(classDoc, userId)
            : classDoc.toObject();
    }
    async findByClassCode(classCode) {
        const classDoc = await this.classModel
            .findOne({ classCode: classCode.toUpperCase(), isActive: true })
            .populate('owner', 'name username email')
            .populate('members.user', 'name username email')
            .exec();
        if (!classDoc) {
            throw new common_1.HttpException('Class not found', common_1.HttpStatus.NOT_FOUND);
        }
        return classDoc;
    }
    async requestJoin(id, userId) {
        const classDoc = await this.classModel.findById(id);
        if (!classDoc) {
            throw new common_1.HttpException('Class not found', common_1.HttpStatus.NOT_FOUND);
        }

        // Check if already a member
        const isMember = classDoc.members.some((member) => member.user.toString() === userId);
        if (isMember) {
            throw new common_1.HttpException('You are already a member of this class', common_1.HttpStatus.BAD_REQUEST);
        }

        // Check if owner
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId === userId) {
            throw new common_1.HttpException('You allow own this class', common_1.HttpStatus.BAD_REQUEST);
        }

        // Check if already requested
        const hasRequested = classDoc.joinRequests?.some((req) => req.user.toString() === userId);
        if (hasRequested) {
            throw new common_1.HttpException('Request already sent', common_1.HttpStatus.BAD_REQUEST);
        }

        await this.classModel.findByIdAndUpdate(id, {
            $push: {
                joinRequests: {
                    user: userId,
                    requestedAt: new Date(),
                }
            }
        });

        return { message: 'Request sent successfully' };
    }

    async approveRequest(id, requestingUserId, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to approve requests', common_1.HttpStatus.FORBIDDEN);
        }

        // Remove from requests
        await this.classModel.updateOne(
            { _id: id },
            { $pull: { joinRequests: { user: requestingUserId } } }
        );

        // Add to members
        await this.classModel.updateOne(
            { _id: id },
            {
                $push: {
                    members: {
                        user: requestingUserId,
                        accessLevel: class_schema_1.ClassAccessLevel.MEMBER,
                        joinedAt: new Date()
                    }
                }
            }
        );
        return this.findOne(id, userId);
    }

    async rejectRequest(id, requestingUserId, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to reject requests', common_1.HttpStatus.FORBIDDEN);
        }

        await this.classModel.updateOne(
            { _id: id },
            { $pull: { joinRequests: { user: requestingUserId } } }
        );

        return this.findOne(id, userId);
    }

    async update(id, updateClassDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to update this class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, updateClassDto, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const classDoc = await this.findOne(id, userId);
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId !== userId) {
            throw new common_1.HttpException('Only the class owner can delete the class', common_1.HttpStatus.FORBIDDEN);
        }
        const deletedClass = await this.classModel.findByIdAndDelete(id).exec();
        if (!deletedClass) {
            throw new common_1.HttpException('Class could not be deleted', common_1.HttpStatus.NOT_FOUND);
        }
        return deletedClass;
    }
    async joinClass(joinClassDto, userId) {
        const classDoc = await this.findByClassCode(joinClassDto.classCode);
        const isAlreadyMember = classDoc.members.some((member) => member.user.toString() === userId);
        if (isAlreadyMember) {
            throw new common_1.HttpException('You are already a member of this class', common_1.HttpStatus.BAD_REQUEST);
        }
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId === userId) {
            throw new common_1.HttpException('You cannot join your own class', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.classModel
            .findByIdAndUpdate(classDoc._id, {
                $push: {
                    members: {
                        user: userId,
                        accessLevel: class_schema_1.ClassAccessLevel.MEMBER,
                        joinedAt: new Date(),
                    },
                },
            }, { new: true })
            .exec();
        return this.findOne(classDoc._id.toString(), userId);
    }
    async leaveClass(id, userId) {
        const classDoc = await this.findOne(id, userId);
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId === userId) {
            throw new common_1.HttpException('Class owner cannot leave the class. Transfer ownership or delete the class instead.', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $pull: { members: { user: userId } } }, { new: true })
            .exec();
        return { message: 'Successfully left the class' };
    }
    async addMembers(id, addMembersDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to add members to this class', common_1.HttpStatus.FORBIDDEN);
        }
        const newMembers = [];
        for (const email of addMembersDto.emails) {
            const user = await this.usersService.findByEmail(email);
            if (user) {
                const userIdStr = user._id.toString();
                const isAlreadyMember = classDoc.members.some((member) => member.user.toString() === userIdStr);
                const ownerId = typeof classDoc.owner === 'string'
                    ? classDoc.owner
                    : classDoc.owner._id?.toString() || classDoc.owner.toString();
                if (!isAlreadyMember && ownerId !== userIdStr) {
                    newMembers.push({
                        user: user._id,
                        accessLevel: addMembersDto.accessLevel,
                        joinedAt: new Date(),
                    });
                }
            }
        }
        if (newMembers.length > 0) {
            await this.classModel
                .findByIdAndUpdate(id, { $push: { members: { $each: newMembers } } }, { new: true })
                .exec();
        }
        return this.findOne(id, userId);
    }
    async updateMemberAccess(id, manageMemberDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to manage members in this class', common_1.HttpStatus.FORBIDDEN);
        }
        const memberExists = classDoc.members.some((member) => {
            const memberId = typeof member.user === 'string'
                ? member.user
                : member.user._id?.toString();
            console.log('Checking member ID:', memberId);
            return memberId === manageMemberDto.userId;
        });
        if (!memberExists) {
            throw new common_1.HttpException('User is not a member of this class', common_1.HttpStatus.NOT_FOUND);
        }
        await this.classModel
            .findOneAndUpdate({ _id: id, 'members.user': manageMemberDto.userId }, { $set: { 'members.$.accessLevel': manageMemberDto.accessLevel } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async removeMember(id, removeMemberDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to remove members from this class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $pull: { members: { user: removeMemberDto.userId } } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async addQuiz(id, addQuizDto, userId) {
        const [classDoc, quiz] = await Promise.all([
            this.findOne(id, userId),
            this.quizzesService.findOne(addQuizDto.quizId),
        ]);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.COLLABORATOR)) {
            throw new common_1.HttpException('You do not have permission to add quizzes to this class', common_1.HttpStatus.FORBIDDEN);
        }
        if (classDoc.quizzes.includes(addQuizDto.quizId)) {
            throw new common_1.HttpException('Quiz is already in this class', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $push: { quizzes: addQuizDto.quizId } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async removeQuiz(id, removeQuizDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.COLLABORATOR)) {
            throw new common_1.HttpException('You do not have permission to remove quizzes from this class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $pull: { quizzes: removeQuizDto.quizId } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async addFolder(id, addFolderDto, userId) {
        const [classDoc, folder] = await Promise.all([
            this.findOne(id, userId),
            this.foldersService.findOne(addFolderDto.folderId, userId),
        ]);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.COLLABORATOR)) {
            throw new common_1.HttpException('You do not have permission to add folders to this class', common_1.HttpStatus.FORBIDDEN);
        }
        if (classDoc.folders.includes(addFolderDto.folderId)) {
            throw new common_1.HttpException('Folder is already in this class', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $push: { folders: addFolderDto.folderId } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async removeFolder(id, removeFolderDto, userId) {
        const classDoc = await this.findOne(id, userId);
        if (!this.hasAccess(classDoc, userId, class_schema_1.ClassAccessLevel.COLLABORATOR)) {
            throw new common_1.HttpException('You do not have permission to remove folders from this class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, { $pull: { folders: removeFolderDto.folderId } }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async archiveClass(id, userId) {
        const classDoc = await this.findOne(id, userId);
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId !== userId) {
            throw new common_1.HttpException('Only the class owner can archive the class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, {
                isArchived: true,
                archivedAt: new Date(),
            }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async restoreClass(id, userId) {
        const classDoc = await this.classModel
            .findById(id)
            .populate('owner', 'name username email')
            .exec();
        if (!classDoc) {
            throw new common_1.HttpException('Class not found', common_1.HttpStatus.NOT_FOUND);
        }
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId !== userId) {
            throw new common_1.HttpException('Only the class owner can restore the class', common_1.HttpStatus.FORBIDDEN);
        }
        await this.classModel
            .findByIdAndUpdate(id, {
                isArchived: false,
                archivedAt: null,
            }, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    hasAccess(classDoc, userId, requiredLevel) {
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        if (ownerId === userId)
            return true;
        const userMembership = classDoc.members.find((member) => {
            const memberId = typeof member.user === 'string'
                ? member.user
                : member.user._id?.toString();
            return memberId === userId;
        });
        if (!userMembership) {
            return this.hasPublicAccess(classDoc, requiredLevel);
        }
        const accessLevels = {
            [class_schema_1.ClassAccessLevel.MEMBER]: 1,
            [class_schema_1.ClassAccessLevel.COLLABORATOR]: 2,
            [class_schema_1.ClassAccessLevel.ADMIN]: 3,
        };
        const level = userMembership.accessLevel;
        return accessLevels[level] >= accessLevels[requiredLevel];
    }
    hasPublicAccess(classDoc, requiredLevel) {
        const publicToUserAccess = {
            [class_schema_1.ClassPublicAccessLevel.NONE]: 0,
            [class_schema_1.ClassPublicAccessLevel.RESTRICTED]: 0,
            [class_schema_1.ClassPublicAccessLevel.VIEW_ONLY]: 1,
            [class_schema_1.ClassPublicAccessLevel.EDIT]: 2,
        };
        const accessLevels = {
            [class_schema_1.ClassAccessLevel.MEMBER]: 1,
            [class_schema_1.ClassAccessLevel.COLLABORATOR]: 2,
            [class_schema_1.ClassAccessLevel.ADMIN]: 3,
        };
        return (publicToUserAccess[classDoc.publicAccess] >= accessLevels[requiredLevel]);
    }
    addUserMetadata(classDoc, userId) {
        const ownerId = typeof classDoc.owner === 'string'
            ? classDoc.owner
            : classDoc.owner._id?.toString() || classDoc.owner.toString();
        const isOwner = ownerId === userId;
        const userMembership = classDoc.members.find((member) => {
            const memberId = typeof member.user === 'string'
                ? member.user
                : member.user._id?.toString();
            return memberId === userId;
        });
        let userAccessLevel = 'none';
        if (isOwner) {
            userAccessLevel = 'owner';
        }
        else if (userMembership) {
            userAccessLevel = userMembership.accessLevel;
        }
        return {
            ...classDoc.toObject(),
            isOwner,
            userAccessLevel,
            memberCount: classDoc.members.length,
        };
    }
    async search(query, userId) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedQuery, 'i');
        return this.classModel.find({
            $or: [
                { name: { $regex: searchRegex } },
                { classCode: { $regex: searchRegex } }
            ],
            isArchived: false
        }).limit(20).exec();
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(class_schema_1.Class.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
    users_service_1.UsersService,
    quizzes_service_1.QuizzesService,
    folders_service_1.FoldersService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map