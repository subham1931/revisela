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
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const folder_schema_1 = require("./schemas/folder.schema");
const users_service_1 = require("../users/users.service");
const quizzes_service_1 = require("../quizzes/quizzes.service");
const email_service_1 = require("../email/email.service");
const uuid_1 = require("uuid");
const quiz_schema_1 = require("../quizzes/schemas/quiz.schema");
let FoldersService = class FoldersService {
    folderModel;
    quizModel;
    usersService;
    quizzesService;
    emailService;
    constructor(folderModel, quizModel, usersService, quizzesService, emailService) {
        this.folderModel = folderModel;
        this.quizModel = quizModel;
        this.usersService = usersService;
        this.quizzesService = quizzesService;
        this.emailService = emailService;
    }
    async create(createFolderDto, userId) {
        if (createFolderDto.parentFolder) {
            const parentFolder = await this.findOne(createFolderDto.parentFolder, userId);
            if (!parentFolder) {
                throw new common_1.HttpException('Parent folder not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!this.hasPermission(parentFolder, userId, 'create')) {
                throw new common_1.HttpException('You do not have permission to create folders here', common_1.HttpStatus.FORBIDDEN);
            }
        }
        const folder = new this.folderModel({
            ...createFolderDto,
            owner: userId,
            sharedWith: [],
        });
        const savedFolder = await folder.save();
        if (createFolderDto.parentFolder) {
            await this.folderModel.findByIdAndUpdate(createFolderDto.parentFolder, { $push: { subFolders: savedFolder._id } }, { new: true });
        }
        return savedFolder;
    }
    async findAll(userId) {
        try {
            const folders = await this.populateFolderHierarchy(userId, true, false);
            return folders.map((folder) => {
                return {
                    ...folder,
                    isBookmarked: folder.bookmarkedBy
                        ? folder.bookmarkedBy.some((id) => id.toString() === userId)
                        : false,
                };
            });
        }
        catch (error) {
            console.error('Error finding folders:', error);
            throw new common_1.HttpException('Failed to retrieve folders', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, userId) {
        try {
            const folder = await this.folderModel
                .findOne({ _id: id, isInTrash: { $ne: true } })
                .populate('owner', 'name username email')
                .populate('sharedWith.user', 'name username email')
                .populate({
                path: 'quizzes',
                select: 'title description tags createdBy isPublic',
                populate: { path: 'createdBy', select: 'name username email' },
            })
                .lean()
                .exec();
            if (!folder) {
                throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
            }
            const allFolders = await this.folderModel
                .find({
                isInTrash: { $ne: true },
            })
                .lean()
                .exec();
            const folderMap = new Map();
            allFolders.forEach((f) => {
                folderMap.set(f._id.toString(), {
                    ...f,
                    subFolders: [],
                });
            });
            if (!folderMap.has(id)) {
                folderMap.set(id, {
                    ...folder,
                    subFolders: [],
                });
            }
            folderMap.forEach((f) => {
                if (f.parentFolder && folderMap.has(f.parentFolder.toString())) {
                    const parent = folderMap.get(f.parentFolder.toString());
                    parent.subFolders.push(f);
                }
            });
            const populatedFolder = folderMap.get(id);
            if (userId && populatedFolder) {
                populatedFolder.isBookmarked = populatedFolder.bookmarkedBy
                    ? populatedFolder.bookmarkedBy.some((id) => id.toString() === userId)
                    : false;
                if (populatedFolder.quizzes && Array.isArray(populatedFolder.quizzes)) {
                    populatedFolder.quizzes.forEach((quiz) => {
                        if (quiz.bookmarkedBy) {
                            quiz.isBookmarked = quiz.bookmarkedBy.some((id) => id.toString() === userId);
                        }
                    });
                }
            }
            return populatedFolder;
        }
        catch (error) {
            console.error('Error finding folder:', error);
            throw new common_1.HttpException('Failed to retrieve folder', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateFolderDto, userId) {
        const folder = await this.findOne(id, userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'edit')) {
            throw new common_1.HttpException('You do not have permission to update this folder', common_1.HttpStatus.FORBIDDEN);
        }
        await this.folderModel
            .findByIdAndUpdate(id, updateFolderDto, { new: true })
            .exec();
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const folder = await this.findOne(id, userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'delete')) {
            throw new common_1.HttpException('You do not have permission to delete this folder', common_1.HttpStatus.FORBIDDEN);
        }
        if (folder.parentFolder) {
            await this.folderModel.findByIdAndUpdate(folder.parentFolder, { $pull: { subFolders: id } }, { new: true });
        }
        const deletedFolder = await this.folderModel.findByIdAndDelete(id).exec();
        if (!deletedFolder) {
            throw new common_1.HttpException('Folder could not be deleted', common_1.HttpStatus.NOT_FOUND);
        }
        return deletedFolder;
    }
    async addQuiz(folderId, quizId, userId) {
        const [folder, quiz] = await Promise.all([
            this.findOne(folderId, userId),
            this.quizzesService.findOne(quizId),
        ]);
        if (!folder || !quiz) {
            throw new common_1.HttpException('Folder or quiz not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'create')) {
            throw new common_1.HttpException('You do not have permission to add quizzes to this folder', common_1.HttpStatus.FORBIDDEN);
        }
        if (!folder.quizzes.includes(quizId)) {
            await this.folderModel
                .findByIdAndUpdate(folderId, { $push: { quizzes: quizId } }, { new: true })
                .exec();
            return this.findOne(folderId, userId);
        }
        return folder;
    }
    async shareFolder(id, shareFolderDto, userId) {
        const folder = await this.folderModel
            .findById(id)
            .populate('sharedWith.user', '_id')
            .exec();
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'share')) {
            throw new common_1.HttpException('Only the folder owner or admin can share it', common_1.HttpStatus.FORBIDDEN);
        }
        const inviter = await this.usersService.findOne(userId);
        if (!inviter) {
            throw new common_1.HttpException('Inviter not found', common_1.HttpStatus.NOT_FOUND);
        }
        const shareLink = await this.generateShareLink(id, userId);
        const folderLink = shareLink;
        const updates = [];
        const emailsToSend = [];
        for (const email of shareFolderDto.emails) {
            const user = await this.usersService.findByEmail(email);
            if (user) {
                const userIdStr = user._id.toString();
                const isAlreadyShared = folder.sharedWith.some((share) => {
                    const shareUserId = typeof share.user === 'string'
                        ? share.user
                        : share.user._id
                            ? share.user._id.toString()
                            : share.user.toString();
                    return shareUserId === userIdStr;
                });
                if (!isAlreadyShared) {
                    updates.push({
                        user: user._id,
                        accessLevel: shareFolderDto.accessLevel,
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
                await this.emailService.sendInvitationEmail(email, 'folder', folder.name, folderLink, inviter.name || inviter.username || 'Someone', inviter.email || '');
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
            const usersToPropagate = updates.map((update) => {
                const userObjectId = update.user instanceof mongoose_2.Types.ObjectId
                    ? update.user
                    : new mongoose_2.Types.ObjectId(update.user);
                return {
                    userId: userObjectId.toString(),
                    userRef: userObjectId,
                    accessLevel: update.accessLevel,
                    name: update.name,
                    email: update.email,
                };
            });
            await this.folderModel
                .findByIdAndUpdate(id, {
                $push: {
                    sharedWith: {
                        $each: updatePayload,
                    },
                },
            }, { new: true })
                .exec();
            await this.propagateShareToDescendantsAndQuizzes(id, usersToPropagate);
            return this.findOne(id, userId);
        }
        return folder;
    }
    async propagateShareToDescendantsAndQuizzes(rootFolderId, users) {
        if (users.length === 0) {
            return;
        }
        const queue = [rootFolderId];
        const visited = new Set();
        while (queue.length > 0) {
            const currentFolderId = queue.shift();
            if (!currentFolderId || visited.has(currentFolderId)) {
                continue;
            }
            visited.add(currentFolderId);
            const folderDoc = await this.folderModel
                .findById(currentFolderId)
                .populate('sharedWith.user', '_id')
                .exec();
            if (!folderDoc) {
                continue;
            }
            const existingFolderUserIds = new Set(folderDoc.sharedWith.map((share) => {
                if (!share?.user) {
                    return '';
                }
                if (typeof share.user === 'string') {
                    return share.user;
                }
                if (share.user?._id) {
                    return share.user._id.toString();
                }
                return share.user.toString();
            }));
            const folderEntriesToAdd = users.filter((user) => !existingFolderUserIds.has(user.userId));
            if (folderEntriesToAdd.length > 0) {
                folderDoc.sharedWith.push(...folderEntriesToAdd.map((user) => ({
                    user: user.userId,
                    accessLevel: user.accessLevel,
                    name: user.name,
                    email: user.email,
                })));
                await folderDoc.save();
            }
            const subFolderIds = (folderDoc.subFolders || []).map((sub) => {
                if (!sub) {
                    return undefined;
                }
                if (typeof sub === 'string') {
                    return sub;
                }
                if (sub._id) {
                    return sub._id.toString();
                }
                return sub.toString();
            });
            for (const subFolderId of subFolderIds) {
                if (subFolderId) {
                    queue.push(subFolderId);
                }
            }
            const quizIds = (folderDoc.quizzes || []).map((quiz) => {
                if (!quiz) {
                    return undefined;
                }
                if (typeof quiz === 'string') {
                    return quiz;
                }
                if (quiz._id) {
                    return quiz._id.toString();
                }
                return quiz.toString();
            });
            for (const quizId of quizIds) {
                if (!quizId) {
                    continue;
                }
                const quizDoc = await this.quizModel
                    .findById(quizId)
                    .populate('sharedWith.user', '_id')
                    .exec();
                if (!quizDoc) {
                    continue;
                }
                const existingQuizUserIds = new Set(quizDoc.sharedWith.map((share) => {
                    if (!share?.user) {
                        return '';
                    }
                    if (typeof share.user === 'string') {
                        return share.user;
                    }
                    if (share.user?._id) {
                        return share.user._id.toString();
                    }
                    return share.user.toString();
                }));
                const quizEntriesToAdd = users.filter((user) => !existingQuizUserIds.has(user.userId));
                if (quizEntriesToAdd.length > 0) {
                    quizDoc.sharedWith.push(...quizEntriesToAdd.map((user) => ({
                        user: user.userId,
                        accessLevel: user.accessLevel,
                        name: user.name,
                        email: user.email,
                    })));
                    await quizDoc.save();
                }
            }
        }
    }
    async generateShareLink(id, userId) {
        const folder = await this.findOne(id, userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'share')) {
            throw new common_1.HttpException('Only the folder owner or admin can generate share link', common_1.HttpStatus.FORBIDDEN);
        }
        const shareToken = (0, uuid_1.v4)();
        const encodedId = encodeURIComponent(id);
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
        return `${baseUrl}/dashboard/library?folderId=${encodedId}&shared=true&token=${shareToken}`;
    }
    hasPermission(folder, userId, action) {
        const getOwnerId = () => {
            if (typeof folder.owner === 'string') {
                return folder.owner;
            }
            return folder.owner._id
                ? folder.owner._id.toString()
                : folder.owner.toString();
        };
        const getSharedUserId = (user) => {
            if (typeof user === 'string') {
                return user;
            }
            return user._id ? user._id.toString() : user.toString();
        };
        const ownerId = getOwnerId();
        if (ownerId === userId) {
            return true;
        }
        const userAccess = folder.sharedWith?.find((share) => getSharedUserId(share.user) === userId);
        if (userAccess) {
            const accessLevel = userAccess.accessLevel;
            if (accessLevel === folder_schema_1.AccessLevel.ADMIN) {
                return true;
            }
            if (accessLevel === folder_schema_1.AccessLevel.COLLABORATOR) {
                return action === 'view' || action === 'edit';
            }
            if (accessLevel === folder_schema_1.AccessLevel.MEMBER) {
                return action === 'view';
            }
        }
        if (folder.publicAccess === folder_schema_1.PublicAccessLevel.VIEW_ONLY ||
            folder.publicAccess === folder_schema_1.PublicAccessLevel.EDIT) {
            return action === 'view';
        }
        return false;
    }
    hasAccess(folder, userId, requiredLevel) {
        const levelToAction = {
            [folder_schema_1.AccessLevel.MEMBER]: 'view',
            [folder_schema_1.AccessLevel.COLLABORATOR]: 'edit',
            [folder_schema_1.AccessLevel.ADMIN]: 'delete',
        };
        const action = levelToAction[requiredLevel];
        return this.hasPermission(folder, userId, action);
    }
    hasPublicAccess(folder, requiredLevel) {
        const publicToUserAccess = {
            [folder_schema_1.PublicAccessLevel.NONE]: 0,
            [folder_schema_1.PublicAccessLevel.RESTRICTED]: 0,
            [folder_schema_1.PublicAccessLevel.VIEW_ONLY]: 1,
            [folder_schema_1.PublicAccessLevel.EDIT]: 2,
        };
        const accessLevels = {
            [folder_schema_1.AccessLevel.MEMBER]: 1,
            [folder_schema_1.AccessLevel.COLLABORATOR]: 2,
            [folder_schema_1.AccessLevel.ADMIN]: 3,
        };
        return (publicToUserAccess[folder.publicAccess] >= accessLevels[requiredLevel]);
    }
    async sendInvitationEmail(email, folder, inviterId) {
        const inviter = await this.usersService.findOne(inviterId);
        console.log(`
      Would send email to: ${email}
      Subject: ${inviter?.name} has shared a folder with you on Revisela
      Body: ${inviter?.name} (${inviter?.email}) has shared the folder "${folder.name}" with you.
            Sign up for Revisela to access this content.
            [Sign Up Link]
    `);
    }
    async moveToTrash(id, userId) {
        const folder = await this.findOne(id, userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folder, userId, 'delete')) {
            throw new common_1.HttpException('You do not have permission to move this folder to trash', common_1.HttpStatus.FORBIDDEN);
        }
        if (folder.parentFolder) {
            await this.folderModel.findByIdAndUpdate(folder.parentFolder, { $pull: { subFolders: id } }, { new: true });
        }
        const updatedFolder = await this.folderModel
            .findByIdAndUpdate(id, {
            isInTrash: true,
            deletedAt: new Date(),
        }, { new: true })
            .exec();
        if (!updatedFolder) {
            throw new common_1.HttpException('Folder could not be moved to trash', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedFolder;
    }
    async restoreFromTrash(id, userId) {
        const folder = await this.folderModel
            .findById(id)
            .populate('owner', 'name username email')
            .populate('sharedWith.user', 'name username email')
            .populate('subFolders', 'name _id')
            .exec();
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!folder.isInTrash) {
            throw new common_1.HttpException('Folder is not in trash', common_1.HttpStatus.BAD_REQUEST);
        }
        const ownerId = typeof folder.owner === 'string'
            ? folder.owner
            : folder.owner._id
                ? folder.owner._id.toString()
                : folder.owner.toString();
        if (ownerId !== userId &&
            !folder.sharedWith.some((share) => share.user.toString() === userId &&
                share.accessLevel === folder_schema_1.AccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to restore this folder', common_1.HttpStatus.FORBIDDEN);
        }
        const restoredFolder = await this.folderModel
            .findByIdAndUpdate(id, {
            isInTrash: false,
            deletedAt: null,
        }, { new: true })
            .exec();
        if (!restoredFolder) {
            throw new common_1.HttpException('Folder could not be restored', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return restoredFolder;
    }
    async permanentlyDelete(id, userId) {
        const folder = await this.folderModel
            .findById(id)
            .populate('owner', 'name username email')
            .populate('sharedWith.user', 'name username email')
            .populate('subFolders', 'name _id')
            .exec();
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        const ownerId = typeof folder.owner === 'string'
            ? folder.owner
            : folder.owner._id
                ? folder.owner._id.toString()
                : folder.owner.toString();
        if (ownerId !== userId &&
            !folder.sharedWith.some((share) => share.user.toString() === userId &&
                share.accessLevel === folder_schema_1.AccessLevel.ADMIN)) {
            throw new common_1.HttpException('You do not have permission to delete this folder', common_1.HttpStatus.FORBIDDEN);
        }
        if (folder.parentFolder) {
            await this.folderModel.findByIdAndUpdate(folder.parentFolder, { $pull: { subFolders: id } }, { new: true });
        }
        const deletedFolder = await this.folderModel.findByIdAndDelete(id).exec();
        if (!deletedFolder) {
            throw new common_1.HttpException('Folder could not be deleted', common_1.HttpStatus.NOT_FOUND);
        }
        return deletedFolder;
    }
    async findAllInTrash(userId) {
        try {
            return await this.populateFolderHierarchy(userId, true, true);
        }
        catch (error) {
            console.error('Error finding folders in trash:', error);
            throw new common_1.HttpException('Failed to retrieve folders from trash', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async duplicate(id, duplicateFolderDto, userId) {
        try {
            const sourceFolder = await this.findOne(id, userId);
            if (!sourceFolder) {
                throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!this.hasAccess(sourceFolder, userId, folder_schema_1.AccessLevel.MEMBER)) {
                throw new common_1.HttpException('You do not have permission to duplicate this folder', common_1.HttpStatus.FORBIDDEN);
            }
            const folderIdsToDuplicate = new Set();
            const collectFolderIds = (folder) => {
                folderIdsToDuplicate.add(folder._id.toString());
                if (folder.subFolders && folder.subFolders.length > 0) {
                    folder.subFolders.forEach((subfolder) => collectFolderIds(subfolder));
                }
            };
            collectFolderIds(sourceFolder);
            const folderIdMap = new Map();
            const rootFolderData = {
                name: duplicateFolderDto.name || `${sourceFolder.name} (Copy)`,
                description: sourceFolder.description,
                parentFolder: sourceFolder.parentFolder,
                publicAccess: sourceFolder.publicAccess,
                owner: userId,
                quizzes: [],
                subFolders: [],
            };
            const newRootFolder = new this.folderModel(rootFolderData);
            const savedRootFolder = await newRootFolder.save();
            const rootFolderId = savedRootFolder._id.toString();
            folderIdMap.set(id, rootFolderId);
            const quizIdMap = new Map();
            const duplicateQuizzes = async () => {
                for (const folderId of folderIdsToDuplicate) {
                    const folder = await this.folderModel
                        .findById(folderId)
                        .populate('quizzes')
                        .lean()
                        .exec();
                    if (folder &&
                        folder.quizzes &&
                        Array.isArray(folder.quizzes) &&
                        folder.quizzes.length > 0) {
                        for (const quiz of folder.quizzes) {
                            try {
                                let quizId;
                                if (typeof quiz === 'string') {
                                    quizId = quiz;
                                }
                                else if (quiz && typeof quiz === 'object') {
                                    quizId = quiz._id?.toString() || '';
                                }
                                else {
                                    console.error('Invalid quiz format encountered');
                                    continue;
                                }
                                if (quizId && !quizIdMap.has(quizId)) {
                                    const duplicatedQuiz = await this.quizzesService.duplicate(quizId, { title: undefined }, userId);
                                    if (duplicatedQuiz) {
                                        const newQuizId = duplicatedQuiz._id?.toString();
                                        if (newQuizId) {
                                            quizIdMap.set(quizId, newQuizId);
                                        }
                                    }
                                }
                            }
                            catch (error) {
                                console.error(`Failed to duplicate quiz: ${error}`);
                            }
                        }
                    }
                }
            };
            await duplicateQuizzes();
            const createFolderCopies = async () => {
                for (const folderId of folderIdsToDuplicate) {
                    if (folderId === id)
                        continue;
                    const folder = await this.folderModel
                        .findById(folderId)
                        .lean()
                        .exec();
                    if (folder) {
                        const folderData = {
                            name: folder.name,
                            description: folder.description,
                            publicAccess: folder.publicAccess,
                            owner: userId,
                            quizzes: [],
                            subFolders: [],
                        };
                        const newFolder = new this.folderModel(folderData);
                        const savedFolder = await newFolder.save();
                        folderIdMap.set(folderId, savedFolder._id.toString());
                    }
                }
            };
            await createFolderCopies();
            const updateFolderRelationships = async () => {
                for (const folderId of folderIdsToDuplicate) {
                    const folder = await this.folderModel
                        .findById(folderId)
                        .lean()
                        .exec();
                    if (folder) {
                        const newFolderId = folderIdMap.get(folderId);
                        if (newFolderId) {
                            const quizzesToAdd = [];
                            if (folder.quizzes &&
                                Array.isArray(folder.quizzes) &&
                                folder.quizzes.length > 0) {
                                for (const quiz of folder.quizzes) {
                                    let origQuizId;
                                    if (typeof quiz === 'string') {
                                        origQuizId = quiz;
                                    }
                                    else if (quiz && typeof quiz === 'object') {
                                        origQuizId = quiz._id?.toString() || '';
                                    }
                                    else {
                                        console.error('Invalid quiz format encountered');
                                        continue;
                                    }
                                    if (origQuizId) {
                                        const newQuizId = quizIdMap.get(origQuizId);
                                        if (newQuizId) {
                                            quizzesToAdd.push(newQuizId);
                                        }
                                    }
                                }
                            }
                            if (quizzesToAdd.length > 0) {
                                await this.folderModel.findByIdAndUpdate(newFolderId, { $push: { quizzes: { $each: quizzesToAdd } } }, { new: true });
                            }
                            if (folder.parentFolder && folder._id.toString() !== id) {
                                const origParentId = folder.parentFolder.toString();
                                const newParentId = folderIdMap.get(origParentId) || null;
                                if (newParentId) {
                                    await this.folderModel.findByIdAndUpdate(newFolderId, { parentFolder: newParentId }, { new: true });
                                    await this.folderModel.findByIdAndUpdate(newParentId, { $push: { subFolders: newFolderId } }, { new: true });
                                }
                            }
                            if (folder.parentFolder &&
                                folder.parentFolder.toString() === id) {
                                await this.folderModel.findByIdAndUpdate(newFolderId, { parentFolder: rootFolderId }, { new: true });
                                await this.folderModel.findByIdAndUpdate(rootFolderId, { $push: { subFolders: newFolderId } }, { new: true });
                            }
                        }
                    }
                }
            };
            await updateFolderRelationships();
            return this.findOne(rootFolderId, userId);
        }
        catch (error) {
            console.error('Error duplicating folder:', error);
            throw new common_1.HttpException('Failed to duplicate folder', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async toggleBookmark(id, userId, bookmarked) {
        const folder = await this.findOne(id, userId);
        if (!folder) {
            throw new common_1.HttpException('Folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasBookmarkAccess(folder, userId)) {
            throw new common_1.HttpException('You do not have permission to bookmark this folder', common_1.HttpStatus.FORBIDDEN);
        }
        const operation = bookmarked
            ? { $addToSet: { bookmarkedBy: userId } }
            : { $pull: { bookmarkedBy: userId } };
        const updatedFolder = await this.folderModel
            .findByIdAndUpdate(id, operation, { new: true })
            .exec();
        if (!updatedFolder) {
            throw new common_1.HttpException('Folder could not be updated', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedFolder;
    }
    async findBookmarked(userId) {
        try {
            console.log('Finding bookmarked folders for user:', userId);
            const bookmarkedFolders = await this.folderModel
                .find({
                isInTrash: { $ne: true },
                bookmarkedBy: userId,
            })
                .populate('owner', 'name username email')
                .populate('sharedWith.user', 'name username email')
                .populate({
                path: 'quizzes',
                select: 'title description tags createdBy isPublic bookmarkedBy',
                populate: { path: 'createdBy', select: 'name username email' },
            })
                .lean()
                .exec();
            console.log('Bookmarked folders query result:', bookmarkedFolders
                ? `Found ${bookmarkedFolders.length} folders`
                : 'Query returned null/undefined');
            if (!bookmarkedFolders || bookmarkedFolders.length === 0) {
                console.log('No bookmarked folders found, returning empty array');
                return [];
            }
            const result = bookmarkedFolders.map((folder) => {
                const ownerId = folder.owner && typeof folder.owner === 'object'
                    ? folder.owner._id.toString()
                    : folder.owner.toString();
                const isOwner = ownerId === userId;
                const sharedInfo = folder.sharedWith
                    ? folder.sharedWith.find((share) => share.user &&
                        ((typeof share.user === 'object' &&
                            share.user._id.toString() === userId) ||
                            (typeof share.user === 'string' && share.user === userId)))
                    : null;
                const userAccessLevel = isOwner
                    ? 'owner'
                    : sharedInfo
                        ? sharedInfo.accessLevel
                        : 'viewer';
                if (folder.quizzes && Array.isArray(folder.quizzes)) {
                    folder.quizzes = folder.quizzes.map((quiz) => ({
                        ...quiz,
                        isBookmarked: quiz.bookmarkedBy
                            ? quiz.bookmarkedBy.some((id) => id.toString() === userId)
                            : false,
                    }));
                }
                return {
                    ...folder,
                    isBookmarked: true,
                    isOwner,
                    userAccessLevel,
                };
            });
            console.log(`Returning ${result.length} bookmarked folders`);
            return result;
        }
        catch (error) {
            console.error('Error finding bookmarked folders:', error);
            throw new common_1.HttpException('Failed to retrieve bookmarked folders', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async moveQuiz(quizId, moveItemsDto, userId) {
        try {
            const { targetFolderId } = moveItemsDto;
            const [quiz, targetFolder] = await Promise.all([
                this.quizzesService.findOne(quizId),
                this.findOne(targetFolderId, userId),
            ]);
            if (!quiz || !targetFolder) {
                throw new common_1.HttpException('Quiz or target folder not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!this.hasPermission(targetFolder, userId, 'create')) {
                throw new common_1.HttpException('You do not have permission to add quizzes to the target folder', common_1.HttpStatus.FORBIDDEN);
            }
            const creatorId = typeof quiz.createdBy === 'string'
                ? quiz.createdBy
                : quiz.createdBy._id
                    ? quiz.createdBy._id.toString()
                    : quiz.createdBy.toString();
            const userIsCreator = creatorId === userId;
            const foldersContainingQuiz = await this.folderModel
                .find({ quizzes: quizId, isInTrash: { $ne: true } })
                .populate('owner', 'name username email')
                .populate('sharedWith.user', 'name username email')
                .exec();
            const hasAdminAccessToAnyFolder = foldersContainingQuiz.some((folder) => this.hasPermission(folder, userId, 'delete'));
            if (!userIsCreator && !hasAdminAccessToAnyFolder) {
                throw new common_1.HttpException('You do not have permission to move this quiz', common_1.HttpStatus.FORBIDDEN);
            }
            await Promise.all(foldersContainingQuiz.map((folder) => this.folderModel
                .findByIdAndUpdate(folder._id, { $pull: { quizzes: quizId } }, { new: true })
                .exec()));
            if (!targetFolder.quizzes.includes(quizId)) {
                await this.folderModel
                    .findByIdAndUpdate(targetFolderId, { $push: { quizzes: quizId } }, { new: true })
                    .exec();
            }
            return this.findOne(targetFolderId, userId);
        }
        catch (error) {
            console.error('Error moving quiz:', error);
            throw new common_1.HttpException(error.message || 'Failed to move quiz', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async moveFolder(folderId, moveItemsDto, userId) {
        const { targetFolderId } = moveItemsDto;
        if (folderId === targetFolderId) {
            throw new common_1.HttpException('Cannot move a folder into itself', common_1.HttpStatus.BAD_REQUEST);
        }
        const [folderToMove, targetFolder] = await Promise.all([
            this.findOne(folderId, userId),
            this.findOne(targetFolderId, userId),
        ]);
        if (!folderToMove || !targetFolder) {
            throw new common_1.HttpException('Folder or target folder not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!this.hasPermission(folderToMove, userId, 'delete')) {
            throw new common_1.HttpException('You do not have permission to move this folder', common_1.HttpStatus.FORBIDDEN);
        }
        if (!this.hasPermission(targetFolder, userId, 'create')) {
            throw new common_1.HttpException('You do not have permission to add folders to the target folder', common_1.HttpStatus.FORBIDDEN);
        }
        if (await this.isDescendant(targetFolderId, folderId)) {
            throw new common_1.HttpException('Cannot move a folder into its own subfolder', common_1.HttpStatus.BAD_REQUEST);
        }
        let currentParentFolder = null;
        if (folderToMove.parentFolder) {
            currentParentFolder = await this.findOne(folderToMove.parentFolder.toString(), userId);
        }
        const updates = [];
        if (currentParentFolder) {
            updates.push(this.folderModel
                .findByIdAndUpdate(currentParentFolder._id, { $pull: { subFolders: folderId } }, { new: true })
                .exec());
        }
        if (!targetFolder.subFolders.includes(folderId)) {
            updates.push(this.folderModel
                .findByIdAndUpdate(targetFolderId, { $push: { subFolders: folderId } }, { new: true })
                .exec());
        }
        updates.push(this.folderModel
            .findByIdAndUpdate(folderId, { parentFolder: targetFolderId }, { new: true })
            .exec());
        await Promise.all(updates);
        return this.findOne(targetFolderId, userId);
    }
    async isDescendant(folderId, potentialAncestorId) {
        const folder = await this.folderModel.findById(folderId).exec();
        if (!folder) {
            return false;
        }
        if (!folder.parentFolder) {
            return false;
        }
        if (folder.parentFolder.toString() === potentialAncestorId) {
            return true;
        }
        return this.isDescendant(folder.parentFolder.toString(), potentialAncestorId);
    }
    async populateFolderHierarchy(userId, topLevelOnly = false, isTrash = false) {
        try {
            const baseQuery = {
                isInTrash: isTrash,
                $or: [{ owner: userId }, { 'sharedWith.user': userId }],
            };
            if (topLevelOnly) {
                baseQuery.parentFolder = { $exists: false };
            }
            const allFolders = await this.folderModel
                .find(baseQuery)
                .populate('owner', 'name username email')
                .populate('sharedWith.user', 'name username email')
                .populate({
                path: 'quizzes',
                select: 'title description tags createdBy isPublic',
                populate: { path: 'createdBy', select: 'name username email' },
            })
                .lean()
                .exec();
            const folderMap = new Map();
            allFolders.forEach((folder) => {
                folderMap.set(folder._id.toString(), {
                    ...folder,
                    subFolders: [],
                });
            });
            const rootFolders = [];
            folderMap.forEach((folder) => {
                if (folder.parentFolder) {
                    const parentId = folder.parentFolder.toString();
                    if (folderMap.has(parentId)) {
                        const parent = folderMap.get(parentId);
                        parent.subFolders.push(folder);
                    }
                    else if (!topLevelOnly) {
                        rootFolders.push(folder);
                    }
                }
                else {
                    rootFolders.push(folder);
                }
            });
            return topLevelOnly ? rootFolders : allFolders;
        }
        catch (error) {
            console.error('Error building folder hierarchy:', error);
            throw new common_1.HttpException('Failed to retrieve folder structure', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    hasBookmarkAccess(folder, userId) {
        const ownerId = typeof folder.owner === 'string'
            ? folder.owner
            : folder.owner._id
                ? folder.owner._id.toString()
                : folder.owner.toString();
        if (ownerId === userId) {
            return true;
        }
        const isSharedWithUser = folder.sharedWith.some((share) => share.user.toString() === userId);
        if (isSharedWithUser) {
            return true;
        }
        return (folder.publicAccess !== folder_schema_1.PublicAccessLevel.NONE &&
            folder.publicAccess !== folder_schema_1.PublicAccessLevel.RESTRICTED);
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(folder_schema_1.Folder.name)),
    __param(1, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        quizzes_service_1.QuizzesService,
        email_service_1.EmailService])
], FoldersService);
//# sourceMappingURL=folders.service.js.map