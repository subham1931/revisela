"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateFolderSchema = void 0;
const zod_1 = require("zod");
exports.duplicateFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
});
//# sourceMappingURL=duplicate-folder.dto.js.map