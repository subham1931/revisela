import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, Date | undefined, string | undefined>>;
    profileImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    birthday?: Date | undefined;
    profileImage?: string | undefined;
}, {
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    birthday?: string | undefined;
    profileImage?: string | undefined;
}>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
