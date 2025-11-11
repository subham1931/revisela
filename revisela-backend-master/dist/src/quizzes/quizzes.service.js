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
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quiz_schema_1 = require("./schemas/quiz.schema");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
let QuizzesService = class QuizzesService {
    quizModel;
    usersService;
    emailService;
    constructor(quizModel, usersService, emailService) {
        this.quizModel = quizModel;
        this.usersService = usersService;
        this.emailService = emailService;
    }
    async create(createQuizDto, userId) {
        const createdQuiz = new this.quizModel({
            ...createQuizDto,
            createdBy: userId,
        });
        return createdQuiz.save();
    }
    async findAllPublic(limit = 10, offset = 0) {
        const [results, totalCount] = await Promise.all([
            this.quizModel
                .find({ isPublic: true, isInTrash: { $ne: true } })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .populate('createdBy', 'name username')
                .exec(),
            this.quizModel
                .countDocuments({ isPublic: true, isInTrash: { $ne: true } })
                .exec(),
        ]);
        return {
            results,
            totalCount,
        };
    }
    async findByUser(userId, limit = 10, offset = 0) {
        const [results, totalCount] = await Promise.all([
            this.quizModel
                .find({ createdBy: userId, isInTrash: { $ne: true } })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .exec(),
            this.quizModel
                .countDocuments({ createdBy: userId, isInTrash: { $ne: true } })
                .exec(),
        ]);
        return {
            results,
            totalCount,
        };
    }
    async findOne(id, userId) {
        const quiz = await this.quizModel
            .findOne({ _id: id, isInTrash: { $ne: true } })
            .populate('createdBy', 'name username')
            .exec();
        if (userId && quiz) {
            const quizObj = quiz.toObject();
            quizObj.isBookmarked = quizObj.bookmarkedBy
                ? quizObj.bookmarkedBy.some((id) => id.toString() === userId)
                : false;
            return quizObj;
        }
        return quiz;
    }
    async findByTag(tag, limit = 10, offset = 0) {
        const [results, totalCount] = await Promise.all([
            this.quizModel
                .find({ tags: tag, isPublic: true, isInTrash: { $ne: true } })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .populate('createdBy', 'name username')
                .exec(),
            this.quizModel
                .countDocuments({ tags: tag, isPublic: true, isInTrash: { $ne: true } })
                .exec(),
        ]);
        return {
            results,
            totalCount,
        };
    }
    async search(query, limit = 10, offset = 0) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedQuery, 'i');
        const [results, totalCount] = await Promise.all([
            this.quizModel
                .find({
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { tags: { $in: [searchRegex] } },
                ],
                isPublic: true,
                isInTrash: { $ne: true },
            })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .populate('createdBy', 'name username')
                .exec(),
            this.quizModel
                .countDocuments({
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { tags: { $in: [searchRegex] } },
                ],
                isPublic: true,
                isInTrash: { $ne: true },
            })
                .exec(),
        ]);
        return {
            results,
            totalCount,
        };
    }
    async update(id, updateQuizDto, userId) {
        const quiz = await this.quizModel.findById(id).exec();
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'edit')) {
            throw new common_1.HttpException('You do not have permission to update this quiz', common_1.HttpStatus.FORBIDDEN);
        }
        return this.quizModel
            .findByIdAndUpdate(id, updateQuizDto, { new: true })
            .exec();
    }
    async remove(id, userId) {
        const quiz = await this.quizModel.findById(id).exec();
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'delete')) {
            throw new common_1.HttpException('You do not have permission to delete this quiz', common_1.HttpStatus.FORBIDDEN);
        }
        return this.quizModel.findByIdAndDelete(id).exec();
    }
    async moveToTrash(id, userId) {
        const quiz = await this.findOne(id);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'delete')) {
            throw new common_1.HttpException('You do not have permission to move this quiz to trash', common_1.HttpStatus.FORBIDDEN);
        }
        const updatedQuiz = await this.quizModel
            .findByIdAndUpdate(id, {
            isInTrash: true,
            deletedAt: new Date(),
        }, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new common_1.HttpException('Quiz could not be moved to trash', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedQuiz;
    }
    async restoreFromTrash(id, userId) {
        const quiz = await this.quizModel
            .findById(id)
            .populate('createdBy', 'name username')
            .exec();
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!quiz.isInTrash) {
            throw new common_1.HttpException('Quiz is not in trash', common_1.HttpStatus.BAD_REQUEST);
        }
        const creatorId = typeof quiz.createdBy === 'string'
            ? quiz.createdBy
            : quiz.createdBy._id
                ? quiz.createdBy._id.toString()
                : quiz.createdBy.toString();
        if (creatorId !== userId) {
            throw new common_1.HttpException('You can only restore your own quizzes', common_1.HttpStatus.FORBIDDEN);
        }
        const restoredQuiz = await this.quizModel
            .findByIdAndUpdate(id, {
            isInTrash: false,
            deletedAt: null,
        }, { new: true })
            .exec();
        if (!restoredQuiz) {
            throw new common_1.HttpException('Quiz could not be restored', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return restoredQuiz;
    }
    async permanentlyDelete(id, userId) {
        const quiz = await this.quizModel
            .findById(id)
            .populate('createdBy', 'name username')
            .exec();
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        const creatorId = typeof quiz.createdBy === 'string'
            ? quiz.createdBy
            : quiz.createdBy._id
                ? quiz.createdBy._id.toString()
                : quiz.createdBy.toString();
        if (creatorId !== userId) {
            throw new common_1.HttpException('You can only delete your own quizzes', common_1.HttpStatus.FORBIDDEN);
        }
        const deletedQuiz = await this.quizModel.findByIdAndDelete(id).exec();
        if (!deletedQuiz) {
            throw new common_1.HttpException('Quiz could not be deleted', common_1.HttpStatus.NOT_FOUND);
        }
        return deletedQuiz;
    }
    async findAllInTrash(userId) {
        try {
            console.log('Finding trash items for user:', userId);
            const trashedQuizzes = await this.quizModel
                .find({
                isInTrash: true,
                createdBy: userId,
            })
                .populate('createdBy', 'name username')
                .exec();
            console.log(`Found ${trashedQuizzes.length} quizzes in trash`);
            return trashedQuizzes;
        }
        catch (error) {
            console.error('Error fetching quizzes from trash:', error);
            throw new common_1.HttpException('Failed to fetch quizzes from trash', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(userId) {
        return this.quizModel
            .find({
            isInTrash: { $ne: true },
            $or: [{ createdBy: userId }],
        })
            .exec();
    }
    async duplicate(id, duplicateQuizDto, userId) {
        const sourceQuiz = await this.findOne(id);
        if (!sourceQuiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        const newQuizData = {
            title: duplicateQuizDto.title || `${sourceQuiz.title} (Copy)`,
            description: sourceQuiz.description,
            tags: sourceQuiz.tags,
            questions: sourceQuiz.questions,
            isPublic: sourceQuiz.isPublic,
            createdBy: userId,
        };
        const newQuiz = new this.quizModel(newQuizData);
        return newQuiz.save();
    }
    hasPermission(quiz, userId, action) {
        const getCreatorId = () => {
            if (typeof quiz.createdBy === 'string') {
                return quiz.createdBy;
            }
            return quiz.createdBy._id
                ? quiz.createdBy._id.toString()
                : quiz.createdBy.toString();
        };
        const getSharedUserId = (user) => {
            if (typeof user === 'string') {
                return user;
            }
            return user._id ? user._id.toString() : user.toString();
        };
        const creatorId = getCreatorId();
        if (creatorId === userId) {
            return true;
        }
        const userAccess = quiz.sharedWith?.find((share) => getSharedUserId(share.user) === userId);
        if (userAccess) {
            const accessLevel = userAccess.accessLevel;
            if (accessLevel === 'admin') {
                return true;
            }
            if (accessLevel === 'collaborator') {
                return action === 'view' || action === 'edit';
            }
            if (accessLevel === 'member') {
                return action === 'view';
            }
        }
        if (quiz.publicAccess === 'public' && action === 'view') {
            return true;
        }
        return false;
    }
    canBookmarkQuiz(quiz, userId) {
        if (quiz.isPublic) {
            return true;
        }
        const creatorId = quiz.createdBy.toString();
        if (creatorId === userId) {
            return true;
        }
        return false;
    }
    async toggleBookmark(id, userId, bookmarked) {
        const quiz = await this.findOne(id);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.canBookmarkQuiz(quiz, userId)) {
            throw new common_1.HttpException('You do not have permission to bookmark this quiz', common_1.HttpStatus.FORBIDDEN);
        }
        const operation = bookmarked
            ? { $addToSet: { bookmarkedBy: userId } }
            : { $pull: { bookmarkedBy: userId } };
        const updatedQuiz = await this.quizModel
            .findByIdAndUpdate(id, operation, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new common_1.HttpException('Quiz could not be updated', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedQuiz;
    }
    async findBookmarked(userId) {
        try {
            console.log('Finding bookmarked quizzes for user:', userId);
            const bookmarkedQuizzes = await this.quizModel
                .find({
                isInTrash: { $ne: true },
                bookmarkedBy: userId,
            })
                .populate('createdBy', 'name username email')
                .populate('bookmarkedBy', 'name username email')
                .lean()
                .exec();
            console.log(`Found ${bookmarkedQuizzes.length} bookmarked quizzes`);
            const enhancedQuizzes = bookmarkedQuizzes.map((quiz) => {
                const creatorId = quiz.createdBy && typeof quiz.createdBy === 'object'
                    ? quiz.createdBy._id.toString()
                    : quiz.createdBy.toString();
                const isCreator = creatorId === userId;
                const enhancedQuiz = quiz;
                enhancedQuiz.isBookmarked = true;
                enhancedQuiz.isCreator = isCreator;
                return enhancedQuiz;
            });
            return enhancedQuizzes;
        }
        catch (error) {
            console.error('Error finding bookmarked quizzes:', error);
            throw new common_1.HttpException('Failed to retrieve bookmarked quizzes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async shareQuiz(id, shareQuizDto, userId) {
        const quiz = await this.quizModel
            .findById(id)
            .populate('sharedWith.user', '_id')
            .exec();
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'share')) {
            throw new common_1.HttpException('Only the quiz owner or admin can share it', common_1.HttpStatus.FORBIDDEN);
        }
        const inviter = await this.usersService.findOne(userId);
        if (!inviter) {
            throw new common_1.HttpException('Inviter not found', common_1.HttpStatus.NOT_FOUND);
        }
        const shareLink = await this.generateShareLink(id, userId);
        const quizLink = shareLink.link;
        const updates = [];
        const emailsToSend = [];
        for (const email of shareQuizDto.emails) {
            const user = await this.usersService.findByEmail(email);
            if (user) {
                const userIdStr = user._id.toString();
                const isAlreadyShared = quiz.sharedWith.some((sharedUser) => {
                    const sharedUserId = typeof sharedUser.user === 'string'
                        ? sharedUser.user
                        : sharedUser.user._id
                            ? sharedUser.user._id.toString()
                            : sharedUser.user.toString();
                    return sharedUserId === userIdStr;
                });
                if (!isAlreadyShared) {
                    updates.push({
                        user: user._id,
                        accessLevel: shareQuizDto.accessLevel,
                        name: user.name || user.username || 'Unknown',
                        email: user.email || email,
                    });
                    emailsToSend.push(email);
                }
            }
            else {
                emailsToSend.push(email);
            }
        }
        for (const email of emailsToSend) {
            try {
                await this.emailService.sendInvitationEmail(email, 'quiz', quiz.title, quizLink, inviter.name || inviter.username || 'Someone', inviter.email || '');
            }
            catch (error) {
                console.error(`Failed to send invitation email to ${email}:`, error);
            }
        }
        if (updates.length > 0) {
            const updatePayload = updates.map((update) => ({
                user: update.user,
                accessLevel: update.accessLevel,
                name: update.name,
                email: update.email,
            }));
            await this.quizModel.findByIdAndUpdate(id, {
                $push: {
                    sharedWith: {
                        $each: updatePayload,
                    },
                },
            }, { new: true });
        }
        const updatedQuiz = await this.findOne(id, userId);
        if (!updatedQuiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        return updatedQuiz;
    }
    async generateShareLink(id, userId) {
        const quiz = await this.findOne(id, userId);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'share')) {
            throw new common_1.HttpException('Only the quiz owner or admin can generate share link', common_1.HttpStatus.FORBIDDEN);
        }
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
        const shareLink = `${baseUrl}/dashboard/${id}?shared=true`;
        return { link: shareLink };
    }
    async updateMemberAccess(id, memberId, accessLevel, userId) {
        const quiz = await this.findOne(id, userId);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'share')) {
            throw new common_1.HttpException('Only the quiz owner or admin can update member access', common_1.HttpStatus.FORBIDDEN);
        }
        const memberIndex = quiz.sharedWith.findIndex((member) => {
            const userId = typeof member.user === 'string'
                ? member.user
                : member.user._id
                    ? member.user._id.toString()
                    : member.user.toString();
            return userId === memberId;
        });
        if (memberIndex === -1) {
            throw new common_1.HttpException('Member not found', common_1.HttpStatus.NOT_FOUND);
        }
        const updatedQuiz = await this.quizModel
            .findByIdAndUpdate(id, { $set: { [`sharedWith.${memberIndex}.accessLevel`]: accessLevel } }, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.findOne(id, userId);
        if (!result) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async removeMember(id, memberId, userId) {
        const quiz = await this.findOne(id, userId);
        if (!quiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(quiz, userId, 'share')) {
            throw new common_1.HttpException('Only the quiz owner or admin can remove members', common_1.HttpStatus.FORBIDDEN);
        }
        const updatedQuiz = await this.quizModel
            .findByIdAndUpdate(id, { $pull: { sharedWith: { user: memberId } } }, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.findOne(id, userId);
        if (!result) {
            throw new common_1.HttpException('Quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        email_service_1.EmailService])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map