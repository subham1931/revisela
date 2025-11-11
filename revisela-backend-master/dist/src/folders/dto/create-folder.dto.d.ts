import { z } from 'zod';
import { PublicAccessLevel } from '../schemas/folder.schema';
export declare const createFolderSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parentFolder: z.ZodOptional<z.ZodString>;
    publicAccess: z.ZodDefault<z.ZodEnum<[PublicAccessLevel.NONE, PublicAccessLevel.RESTRICTED, PublicAccessLevel.VIEW_ONLY, PublicAccessLevel.EDIT]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    publicAccess: PublicAccessLevel;
    description?: string | undefined;
    parentFolder?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    publicAccess?: PublicAccessLevel | undefined;
    parentFolder?: string | undefined;
}>;
export type CreateFolderDto = z.infer<typeof createFolderSchema>;
