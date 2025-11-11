import { z } from 'zod';
export declare const shareQuizSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    accessLevel: z.ZodDefault<z.ZodEnum<["admin", "collaborator", "member"]>>;
}, "strip", z.ZodTypeAny, {
    accessLevel: "admin" | "collaborator" | "member";
    emails: string[];
}, {
    emails: string[];
    accessLevel?: "admin" | "collaborator" | "member" | undefined;
}>;
export type ShareQuizDto = z.infer<typeof shareQuizSchema>;
