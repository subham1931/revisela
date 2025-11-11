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
exports.SharedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const folders_service_1 = require("../folders/folders.service");
const quizzes_service_1 = require("../quizzes/quizzes.service");
const quiz_schema_1 = require("../quizzes/schemas/quiz.schema");
const folder_schema_1 = require("../folders/schemas/folder.schema");
let SharedService = class SharedService {
    folderModel;
    quizModel;
    foldersService;
    quizzesService;
    constructor(folderModel, quizModel, foldersService, quizzesService) {
        this.folderModel = folderModel;
        this.quizModel = quizModel;
        this.foldersService = foldersService;
        this.quizzesService = quizzesService;
    }
    async getSharedContent(userId) {
        const sharedFolders = await this.folderModel
            .find({
            isInTrash: { $ne: true },
            owner: { $ne: userId },
            'sharedWith.user': userId,
        })
            .populate('owner', 'name username email')
            .populate('sharedWith.user', 'name username email')
            .populate({
            path: 'quizzes',
            select: 'title description tags createdBy isPublic bookmarkedBy createdAt updatedAt',
            populate: { path: 'createdBy', select: 'name username email' },
        })
            .lean()
            .exec();
        const transformedFolders = sharedFolders.map((folder) => {
            const userShare = folder.sharedWith.find((share) => share.user._id.toString() === userId);
            return {
                ...folder,
                type: 'folder',
                userAccessLevel: userShare?.accessLevel || 'member',
                isBookmarked: folder.bookmarkedBy?.some((id) => id.toString() === userId) ||
                    false,
            };
        });
        const sharedQuizzes = [];
        const processedQuizIds = new Set();
        for (const folder of sharedFolders) {
            if (folder.quizzes && Array.isArray(folder.quizzes)) {
                for (const quiz of folder.quizzes) {
                    const quizId = typeof quiz === 'string' ? quiz : quiz._id?.toString();
                    if (quizId && !processedQuizIds.has(quizId)) {
                        processedQuizIds.add(quizId);
                        if (typeof quiz === 'object' && quiz._id) {
                            const userShare = folder.sharedWith.find((share) => share.user._id.toString() === userId);
                            sharedQuizzes.push({
                                ...quiz,
                                _id: quiz._id.toString(),
                                type: 'quiz',
                                isBookmarked: quiz.bookmarkedBy?.some((id) => id.toString() === userId) || false,
                                sharedVia: {
                                    folderId: folder._id.toString(),
                                    folderName: folder.name,
                                    accessLevel: userShare?.accessLevel || 'member',
                                },
                            });
                        }
                    }
                }
            }
        }
        const directlySharedQuizzes = await this.quizModel
            .find({
            isInTrash: { $ne: true },
            createdBy: { $ne: userId },
            'sharedWith.user': userId,
        })
            .populate('createdBy', 'name username email')
            .lean()
            .exec();
        for (const quiz of directlySharedQuizzes) {
            const quizId = quiz._id.toString();
            if (!processedQuizIds.has(quizId)) {
                processedQuizIds.add(quizId);
                sharedQuizzes.push({
                    ...quiz,
                    _id: quizId,
                    type: 'quiz',
                    isBookmarked: quiz.bookmarkedBy?.some((id) => id.toString() === userId) ||
                        false,
                    sharedVia: undefined,
                });
            }
        }
        return {
            folders: transformedFolders,
            quizzes: sharedQuizzes,
            totalCount: {
                folders: transformedFolders.length,
                quizzes: sharedQuizzes.length,
                total: transformedFolders.length + sharedQuizzes.length,
            },
        };
    }
    async getSharedFolders(userId) {
        const sharedFolders = await this.folderModel
            .find({
            isInTrash: { $ne: true },
            owner: { $ne: userId },
            'sharedWith.user': userId,
        })
            .populate('owner', 'name username email')
            .populate('sharedWith.user', 'name username email')
            .select('-quizzes')
            .lean()
            .exec();
        return sharedFolders.map((folder) => {
            const userShare = folder.sharedWith.find((share) => share.user._id.toString() === userId);
            return {
                ...folder,
                type: 'folder',
                userAccessLevel: userShare?.accessLevel || 'member',
                isBookmarked: folder.bookmarkedBy?.some((id) => id.toString() === userId) ||
                    false,
            };
        });
    }
    async getSharedQuizzes(userId) {
        const sharedFolders = await this.folderModel
            .find({
            isInTrash: { $ne: true },
            owner: { $ne: userId },
            'sharedWith.user': userId,
        })
            .select('name quizzes sharedWith')
            .populate('sharedWith.user', '_id')
            .lean()
            .exec();
        const quizIds = new Set();
        const folderQuizMap = new Map();
        for (const folder of sharedFolders) {
            const userShare = folder.sharedWith.find((share) => share.user._id.toString() === userId);
            if (folder.quizzes && Array.isArray(folder.quizzes)) {
                for (const quizId of folder.quizzes) {
                    const id = quizId.toString();
                    quizIds.add(id);
                    if (!folderQuizMap.has(id)) {
                        folderQuizMap.set(id, {
                            folderId: folder._id.toString(),
                            folderName: folder.name,
                            accessLevel: userShare?.accessLevel || 'member',
                        });
                    }
                }
            }
        }
        const directlySharedQuizzes = await this.quizModel
            .find({
            isInTrash: { $ne: true },
            createdBy: { $ne: userId },
            'sharedWith.user': userId,
        })
            .select('_id')
            .lean()
            .exec();
        for (const quiz of directlySharedQuizzes) {
            const id = quiz._id.toString();
            quizIds.add(id);
        }
        const quizzes = await this.quizModel
            .find({
            _id: { $in: Array.from(quizIds) },
            isInTrash: { $ne: true },
        })
            .populate('createdBy', 'name username email')
            .lean()
            .exec();
        const hasUserAccess = (quiz) => {
            const extractId = (value) => {
                if (!value) {
                    return undefined;
                }
                if (typeof value === 'string') {
                    return value;
                }
                if (value._id) {
                    return value._id.toString();
                }
                if (typeof value.toString === 'function') {
                    return value.toString();
                }
                return undefined;
            };
            const creatorId = extractId(quiz.createdBy);
            if (creatorId === userId) {
                return true;
            }
            return (quiz.sharedWith?.some((share) => {
                const sharedUserId = extractId(share?.user);
                return sharedUserId === userId;
            }) || false);
        };
        return quizzes.filter(hasUserAccess).map((quiz) => {
            const sharedVia = folderQuizMap.get(quiz._id.toString());
            return {
                ...quiz,
                _id: quiz._id.toString(),
                type: 'quiz',
                isBookmarked: quiz.bookmarkedBy?.some((id) => id.toString() === userId) ||
                    false,
                sharedVia,
            };
        });
    }
};
exports.SharedService = SharedService;
exports.SharedService = SharedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(folder_schema_1.Folder.name)),
    __param(1, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        folders_service_1.FoldersService,
        quizzes_service_1.QuizzesService])
], SharedService);
//# sourceMappingURL=shared.service.js.map