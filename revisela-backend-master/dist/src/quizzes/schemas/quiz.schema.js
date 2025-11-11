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
exports.QuizSchema = exports.Quiz = exports.QuizValidationSchema = exports.QuestionValidationSchema = exports.QuestionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const zod_1 = require("zod");
var QuestionType;
(function (QuestionType) {
    QuestionType["FLASH_CARD"] = "flashCard";
    QuestionType["MCQ"] = "mcq";
    QuestionType["FILL_IN"] = "fillIn";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
exports.QuestionValidationSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal(QuestionType.FLASH_CARD),
        question: zod_1.z.string().min(1),
        answer: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        audio: zod_1.z.string().url().optional(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal(QuestionType.MCQ),
        question: zod_1.z.string().min(1),
        answer: zod_1.z.string().min(1),
        options: zod_1.z
            .array(zod_1.z.object({
            label: zod_1.z.string().min(1),
            value: zod_1.z.string().min(1),
            image: zod_1.z.string().url().optional(),
            audio: zod_1.z.string().url().optional(),
        }))
            .min(2),
        image: zod_1.z.string().url().optional(),
        audio: zod_1.z.string().url().optional(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal(QuestionType.FILL_IN),
        question: zod_1.z.string().min(1),
        answer: zod_1.z.string().min(1),
        image: zod_1.z.string().url().optional(),
        audio: zod_1.z.string().url().optional(),
    }),
]);
exports.QuizValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(5).max(500),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    questions: zod_1.z.array(exports.QuestionValidationSchema).min(1),
    isPublic: zod_1.z.boolean().default(true),
    createdBy: zod_1.z.string(),
});
let Quiz = class Quiz {
    title;
    description;
    tags;
    questions;
    isPublic;
    createdBy;
    sharedWith;
    publicAccess;
    createdAt;
    updatedAt;
    isInTrash;
    bookmarkedBy;
    deletedAt;
    isBookmarked;
    isCreator;
};
exports.Quiz = Quiz;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Quiz.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Quiz.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Quiz.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                type: {
                    type: String,
                    enum: Object.values(QuestionType),
                    required: true,
                },
                question: { type: String, required: true },
                answer: { type: String },
                options: {
                    type: [
                        {
                            label: { type: String },
                            value: { type: String },
                            image: { type: String },
                            audio: { type: String },
                        },
                    ],
                },
                image: { type: String },
                audio: { type: String },
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "questions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Quiz.prototype, "isPublic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Quiz.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
            accessLevel: { type: String, enum: ['admin', 'collaborator', 'member'] },
            name: { type: String, required: false },
            email: { type: String, required: false },
        },
    ]),
    __metadata("design:type", Array)
], Quiz.prototype, "sharedWith", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['restricted', 'public'],
        default: 'restricted',
    }),
    __metadata("design:type", String)
], Quiz.prototype, "publicAccess", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Quiz.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Quiz.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Quiz.prototype, "isInTrash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "bookmarkedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Quiz.prototype, "deletedAt", void 0);
exports.Quiz = Quiz = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Quiz);
exports.QuizSchema = mongoose_1.SchemaFactory.createForClass(Quiz);
//# sourceMappingURL=quiz.schema.js.map