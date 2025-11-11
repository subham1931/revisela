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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderSchema = exports.Folder = exports.PublicAccessLevel = exports.AccessLevel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["ADMIN"] = "admin";
    AccessLevel["COLLABORATOR"] = "collaborator";
    AccessLevel["MEMBER"] = "member";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
var PublicAccessLevel;
(function (PublicAccessLevel) {
    PublicAccessLevel["RESTRICTED"] = "restricted";
    PublicAccessLevel["VIEW_ONLY"] = "view_only";
    PublicAccessLevel["EDIT"] = "edit";
    PublicAccessLevel["NONE"] = "none";
})(PublicAccessLevel || (exports.PublicAccessLevel = PublicAccessLevel = {}));
let Folder = class Folder {
    _id;
    name;
    description;
    owner;
    parentFolder;
    subFolders;
    quizzes;
    sharedWith;
    publicAccess;
    isInTrash;
    bookmarkedBy;
    deletedAt;
    createdAt;
    updatedAt;
};
exports.Folder = Folder;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Folder.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Folder.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Folder' }),
    __metadata("design:type", Object)
], Folder.prototype, "parentFolder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Folder' }] }),
    __metadata("design:type", Array)
], Folder.prototype, "subFolders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Quiz' }] }),
    __metadata("design:type", Array)
], Folder.prototype, "quizzes", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
            accessLevel: { type: String, enum: Object.values(AccessLevel) },
            name: { type: String, required: false },
            email: { type: String, required: false },
        },
    ]),
    __metadata("design:type", Array)
], Folder.prototype, "sharedWith", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(PublicAccessLevel),
        default: PublicAccessLevel.NONE,
    }),
    __metadata("design:type", String)
], Folder.prototype, "publicAccess", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Folder.prototype, "isInTrash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    }),
    __metadata("design:type", Array)
], Folder.prototype, "bookmarkedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Folder.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Folder.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Folder.prototype, "updatedAt", void 0);
exports.Folder = Folder = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Folder);
exports.FolderSchema = mongoose_1.SchemaFactory.createForClass(Folder);
//# sourceMappingURL=folder.schema.js.map