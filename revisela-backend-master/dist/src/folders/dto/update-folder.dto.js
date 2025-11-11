"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFolderSchema = void 0;
const zod_1 = require("zod");
const create_folder_dto_1 = require("./create-folder.dto");
const folder_schema_1 = require("../schemas/folder.schema");
exports.updateFolderSchema = create_folder_dto_1.createFolderSchema
    .partial()
    .extend({
    publicAccess: zod_1.z
        .union([
        zod_1.z.enum([
            folder_schema_1.PublicAccessLevel.NONE,
            folder_schema_1.PublicAccessLevel.RESTRICTED,
            folder_schema_1.PublicAccessLevel.VIEW_ONLY,
            folder_schema_1.PublicAccessLevel.EDIT,
        ]),
        zod_1.z.literal('public'),
    ])
        .optional()
        .transform((val) => {
        if (val === 'public') {
            return folder_schema_1.PublicAccessLevel.EDIT;
        }
        return val;
    }),
});
//# sourceMappingURL=update-folder.dto.js.map