import { z } from 'zod';
export declare const duplicateFolderSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type DuplicateFolderDto = z.infer<typeof duplicateFolderSchema>;
