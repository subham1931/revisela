"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkQuizSchema = void 0;
const zod_1 = require("zod");
exports.bookmarkQuizSchema = zod_1.z.object({
    bookmarked: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=bookmark-quiz.dto.js.map