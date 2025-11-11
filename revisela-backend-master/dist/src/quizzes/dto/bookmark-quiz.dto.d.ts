import { z } from 'zod';
export declare const bookmarkQuizSchema: z.ZodObject<{
    bookmarked: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    bookmarked: boolean;
}, {
    bookmarked?: boolean | undefined;
}>;
export type BookmarkQuizDto = z.infer<typeof bookmarkQuizSchema>;
