import { z } from 'zod';
import { PublicAccessLevel } from '../schemas/folder.schema';
export declare const updateFolderSchema: z.ZodObject<z.objectUtil.extendShape<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentFolder: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    publicAccess: z.ZodOptional<z.ZodDefault<z.ZodEnum<[PublicAccessLevel.NONE, PublicAccessLevel.RESTRICTED, PublicAccessLevel.VIEW_ONLY, PublicAccessLevel.EDIT]>>>;
}, {
    publicAccess: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodEnum<[PublicAccessLevel.NONE, PublicAccessLevel.RESTRICTED, PublicAccessLevel.VIEW_ONLY, PublicAccessLevel.EDIT]>, z.ZodLiteral<"public">]>>, PublicAccessLevel | undefined, "public" | PublicAccessLevel | undefined>;
}>, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    publicAccess?: PublicAccessLevel | undefined;
    parentFolder?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    publicAccess?: "public" | PublicAccessLevel | undefined;
    parentFolder?: string | undefined;
}>;
export type UpdateFolderDto = z.infer<typeof updateFolderSchema>;
