"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassSchema = void 0;
const zod_1 = require("zod");
const class_schema_1 = require("../schemas/class.schema");
exports.createClassSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    orgName: zod_1.z.string().min(1).max(100),
    publicAccess: zod_1.z
        .enum([
        class_schema_1.ClassPublicAccessLevel.NONE,
        class_schema_1.ClassPublicAccessLevel.RESTRICTED,
        class_schema_1.ClassPublicAccessLevel.VIEW_ONLY,
        class_schema_1.ClassPublicAccessLevel.EDIT,
    ])
        .default(class_schema_1.ClassPublicAccessLevel.RESTRICTED),
});
//# sourceMappingURL=create-class.dto.js.map