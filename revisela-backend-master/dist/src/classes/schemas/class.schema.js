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
exports.ClassSchema = exports.Class = exports.ClassPublicAccessLevel = exports.ClassAccessLevel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ClassAccessLevel;
(function (ClassAccessLevel) {
    ClassAccessLevel["ADMIN"] = "admin";
    ClassAccessLevel["COLLABORATOR"] = "collaborator";
    ClassAccessLevel["MEMBER"] = "member";
})(ClassAccessLevel || (exports.ClassAccessLevel = ClassAccessLevel = {}));
var ClassPublicAccessLevel;
(function (ClassPublicAccessLevel) {
    ClassPublicAccessLevel["RESTRICTED"] = "restricted";
    ClassPublicAccessLevel["VIEW_ONLY"] = "view_only";
    ClassPublicAccessLevel["EDIT"] = "edit";
    ClassPublicAccessLevel["NONE"] = "none";
})(ClassPublicAccessLevel || (exports.ClassPublicAccessLevel = ClassPublicAccessLevel = {}));
let Class = class Class {
    _id;
    name;
    orgName;
    classCode;
    owner;
    members;
    joinRequests;
    quizzes;
    folders;
    publicAccess;
    isActive;
    isArchived;
    archivedAt;
    createdAt;
    updatedAt;
};
exports.Class = Class;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Class.prototype, "orgName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        uppercase: true,
        length: 6,
        match: /^[A-Z0-9]{6}$/,
    }),
    __metadata("design:type", String)
], Class.prototype, "classCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Class.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
            accessLevel: { type: String, enum: Object.values(ClassAccessLevel) },
            joinedAt: { type: Date, default: Date.now },
        },
    ]),
    __metadata("design:type", Array)
], Class.prototype, "members", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
            requestedAt: { type: Date, default: Date.now },
        },
    ]),
    __metadata("design:type", Array)
], Class.prototype, "joinRequests", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Quiz' }] }),
    __metadata("design:type", Array)
], Class.prototype, "quizzes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Folder' }] }),
    __metadata("design:type", Array)
], Class.prototype, "folders", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(ClassPublicAccessLevel),
        default: ClassPublicAccessLevel.RESTRICTED,
    }),
    __metadata("design:type", String)
], Class.prototype, "publicAccess", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Class.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Class.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Class.prototype, "archivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Class.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Class.prototype, "updatedAt", void 0);
exports.Class = Class = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Class);
exports.ClassSchema = mongoose_1.SchemaFactory.createForClass(Class);
//# sourceMappingURL=class.schema.js.map