"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuizSchema = void 0;
const zod_1 = require("zod");
const quiz_schema_1 = require("../schemas/quiz.schema");
exports.createQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(5).max(500),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    questions: zod_1.z.array(quiz_schema_1.QuestionValidationSchema).min(1),
    isPublic: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=create-quiz.dto.js.map