"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderSchema = void 0;
const zod_1 = require("zod");
const folder_schema_1 = require("../schemas/folder.schema");
exports.createFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    parentFolder: zod_1.z.string().optional(),
    publicAccess: zod_1.z
        .enum([
        folder_schema_1.PublicAccessLevel.NONE,
        folder_schema_1.PublicAccessLevel.RESTRICTED,
        folder_schema_1.PublicAccessLevel.VIEW_ONLY,
        folder_schema_1.PublicAccessLevel.EDIT,
    ])
        .default(folder_schema_1.PublicAccessLevel.NONE),
});
//# sourceMappingURL=create-folder.dto.js.map