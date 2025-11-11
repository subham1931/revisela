"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareQuizSchema = void 0;
const zod_1 = require("zod");
exports.shareQuizSchema = zod_1.z.object({
    emails: zod_1.z.array(zod_1.z.string().email()),
    accessLevel: zod_1.z
        .enum(['admin', 'collaborator', 'member'])
        .default('member'),
});
//# sourceMappingURL=share-quiz.dto.js.map