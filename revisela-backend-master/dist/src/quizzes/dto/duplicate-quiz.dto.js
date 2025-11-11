"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateQuizSchema = void 0;
const zod_1 = require("zod");
exports.duplicateQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100).optional(),
});
//# sourceMappingURL=duplicate-quiz.dto.js.map