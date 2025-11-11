import { z } from 'zod';
export declare const addQuizToClassSchema: z.ZodObject<{
    quizId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    quizId: string;
}, {
    quizId: string;
}>;
export declare const addFolderToClassSchema: z.ZodObject<{
    folderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    folderId: string;
}, {
    folderId: string;
}>;
export declare const removeQuizFromClassSchema: z.ZodObject<{
    quizId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    quizId: string;
}, {
    quizId: string;
}>;
export declare const removeFolderFromClassSchema: z.ZodObject<{
    folderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    folderId: string;
}, {
    folderId: string;
}>;
export type AddQuizToClassDto = z.infer<typeof addQuizToClassSchema>;
export type AddFolderToClassDto = z.infer<typeof addFolderToClassSchema>;
export type RemoveQuizFromClassDto = z.infer<typeof removeQuizFromClassSchema>;
export type RemoveFolderFromClassDto = z.infer<typeof removeFolderFromClassSchema>;
