import { z } from 'zod';
import { UserRole } from '../schemas/user.schema';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    birthday: z.ZodEffects<z.ZodOptional<z.ZodString>, Date | undefined, string | undefined>;
    profileImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
    birthday?: Date | undefined;
    profileImage?: string | undefined;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
    birthday?: string | undefined;
    profileImage?: string | undefined;
}>;
export declare class CreateUserDto {
    name: string;
    username: string;
    email: string;
    password: string;
    birthday?: Date;
    role?: UserRole;
}
