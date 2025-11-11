import { z } from 'zod';
import { ClassAccessLevel } from '../schemas/class.schema';
export declare const manageMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    accessLevel: z.ZodDefault<z.ZodEnum<[ClassAccessLevel.ADMIN, ClassAccessLevel.COLLABORATOR, ClassAccessLevel.MEMBER]>>;
}, "strip", z.ZodTypeAny, {
    accessLevel: ClassAccessLevel;
    userId: string;
}, {
    userId: string;
    accessLevel?: ClassAccessLevel | undefined;
}>;
export declare const addMembersSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    accessLevel: z.ZodDefault<z.ZodEnum<[ClassAccessLevel.ADMIN, ClassAccessLevel.COLLABORATOR, ClassAccessLevel.MEMBER]>>;
}, "strip", z.ZodTypeAny, {
    accessLevel: ClassAccessLevel;
    emails: string[];
}, {
    emails: string[];
    accessLevel?: ClassAccessLevel | undefined;
}>;
export declare const removeMemberSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type ManageMemberDto = z.infer<typeof manageMemberSchema>;
export type AddMembersDto = z.infer<typeof addMembersSchema>;
export type RemoveMemberDto = z.infer<typeof removeMemberSchema>;
