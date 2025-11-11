import { z } from 'zod';
import { AccessLevel } from '../schemas/folder.schema';
export declare const shareFolderSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    accessLevel: z.ZodDefault<z.ZodEnum<[AccessLevel.ADMIN, AccessLevel.COLLABORATOR, AccessLevel.MEMBER]>>;
}, "strip", z.ZodTypeAny, {
    accessLevel: AccessLevel;
    emails: string[];
}, {
    emails: string[];
    accessLevel?: AccessLevel | undefined;
}>;
export type ShareFolderDto = z.infer<typeof shareFolderSchema>;
