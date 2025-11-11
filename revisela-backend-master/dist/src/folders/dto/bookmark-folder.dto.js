"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkFolderSchema = void 0;
const zod_1 = require("zod");
exports.bookmarkFolderSchema = zod_1.z.object({
    bookmarked: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=bookmark-folder.dto.js.map