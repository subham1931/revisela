import { z } from 'zod';
export declare const updateClassSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    orgName: z.ZodOptional<z.ZodString>;
    publicAccess: z.ZodOptional<z.ZodDefault<z.ZodEnum<[import("../schemas/class.schema").ClassPublicAccessLevel.NONE, import("../schemas/class.schema").ClassPublicAccessLevel.RESTRICTED, import("../schemas/class.schema").ClassPublicAccessLevel.VIEW_ONLY, import("../schemas/class.schema").ClassPublicAccessLevel.EDIT]>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    publicAccess?: import("../schemas/class.schema").ClassPublicAccessLevel | undefined;
    orgName?: string | undefined;
}, {
    name?: string | undefined;
    publicAccess?: import("../schemas/class.schema").ClassPublicAccessLevel | undefined;
    orgName?: string | undefined;
}>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;
