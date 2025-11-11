import { z } from 'zod';
export declare const moveItemsSchema: z.ZodObject<{
    targetFolderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    targetFolderId: string;
}, {
    targetFolderId: string;
}>;
export type MoveItemsDto = z.infer<typeof moveItemsSchema>;
