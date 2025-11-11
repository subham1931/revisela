"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinClassSchema = void 0;
const zod_1 = require("zod");
exports.joinClassSchema = zod_1.z.object({
    classCode: zod_1.z
        .string()
        .length(6)
        .regex(/^[A-Z0-9]{6}$/, 'Class code must be 6 characters long and contain only uppercase letters and numbers'),
});
//# sourceMappingURL=join-class.dto.js.map