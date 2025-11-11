import { z } from 'zod';
export declare const duplicateQuizSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
}, {
    title?: string | undefined;
}>;
export type DuplicateQuizDto = z.infer<typeof duplicateQuizSchema>;
