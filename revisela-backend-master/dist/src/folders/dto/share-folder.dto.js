"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareFolderSchema = void 0;
const zod_1 = require("zod");
const folder_schema_1 = require("../schemas/folder.schema");
exports.shareFolderSchema = zod_1.z.object({
    emails: zod_1.z.array(zod_1.z.string().email()),
    accessLevel: zod_1.z
        .enum([folder_schema_1.AccessLevel.ADMIN, folder_schema_1.AccessLevel.COLLABORATOR, folder_schema_1.AccessLevel.MEMBER])
        .default(folder_schema_1.AccessLevel.MEMBER),
});
//# sourceMappingURL=share-folder.dto.js.map