"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizSchema = void 0;
const zod_1 = require("zod");
const create_quiz_dto_1 = require("./create-quiz.dto");
exports.updateQuizSchema = create_quiz_dto_1.createQuizSchema
    .partial()
    .extend({
    publicAccess: zod_1.z
        .enum(['restricted', 'public'])
        .optional(),
});
//# sourceMappingURL=update-quiz.dto.js.map