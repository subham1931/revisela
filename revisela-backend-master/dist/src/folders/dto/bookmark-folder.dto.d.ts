import { z } from 'zod';
export declare const bookmarkFolderSchema: z.ZodObject<{
    bookmarked: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    bookmarked: boolean;
}, {
    bookmarked?: boolean | undefined;
}>;
export type BookmarkFolderDto = z.infer<typeof bookmarkFolderSchema>;
