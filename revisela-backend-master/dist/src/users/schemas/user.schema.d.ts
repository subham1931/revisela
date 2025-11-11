import { Document } from 'mongoose';
import { z } from 'zod';
export declare enum UserRole {
    USER = "user",
    SYSTEM_ADMIN = "system_admin"
}
export declare const UserValidationSchema: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<typeof UserRole>>;
    birthday: z.ZodOptional<z.ZodDate>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
    profileImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    birthday?: Date | undefined;
    profileImage?: string | undefined;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
    role?: UserRole | undefined;
    birthday?: Date | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    profileImage?: string | undefined;
}>;
export declare class User {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    birthday: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileImage: string;
}
export type UserDocument = User & Document;
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
