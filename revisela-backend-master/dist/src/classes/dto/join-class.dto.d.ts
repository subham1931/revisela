import { z } from 'zod';
export declare const joinClassSchema: z.ZodObject<{
    classCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    classCode: string;
}, {
    classCode: string;
}>;
export type JoinClassDto = z.infer<typeof joinClassSchema>;
