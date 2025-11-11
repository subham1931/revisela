"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberSchema = exports.addMembersSchema = exports.manageMemberSchema = void 0;
const zod_1 = require("zod");
const class_schema_1 = require("../schemas/class.schema");
exports.manageMemberSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    accessLevel: zod_1.z
        .enum([
        class_schema_1.ClassAccessLevel.ADMIN,
        class_schema_1.ClassAccessLevel.COLLABORATOR,
        class_schema_1.ClassAccessLevel.MEMBER,
    ])
        .default(class_schema_1.ClassAccessLevel.MEMBER),
});
exports.addMembersSchema = zod_1.z.object({
    emails: zod_1.z.array(zod_1.z.string().email()),
    accessLevel: zod_1.z
        .enum([
        class_schema_1.ClassAccessLevel.ADMIN,
        class_schema_1.ClassAccessLevel.COLLABORATOR,
        class_schema_1.ClassAccessLevel.MEMBER,
    ])
        .default(class_schema_1.ClassAccessLevel.MEMBER),
});
exports.removeMemberSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
//# sourceMappingURL=manage-member.dto.js.map