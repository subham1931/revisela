"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveItemsSchema = void 0;
const zod_1 = require("zod");
exports.moveItemsSchema = zod_1.z.object({
    targetFolderId: zod_1.z.string(),
});
//# sourceMappingURL=move-items.dto.js.map