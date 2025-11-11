"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFolderFromClassSchema = exports.removeQuizFromClassSchema = exports.addFolderToClassSchema = exports.addQuizToClassSchema = void 0;
const zod_1 = require("zod");
exports.addQuizToClassSchema = zod_1.z.object({
    quizId: zod_1.z.string(),
});
exports.addFolderToClassSchema = zod_1.z.object({
    folderId: zod_1.z.string(),
});
exports.removeQuizFromClassSchema = zod_1.z.object({
    quizId: zod_1.z.string(),
});
exports.removeFolderFromClassSchema = zod_1.z.object({
    folderId: zod_1.z.string(),
});
//# sourceMappingURL=add-content.dto.js.map