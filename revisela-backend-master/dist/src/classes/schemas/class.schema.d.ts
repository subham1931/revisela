import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Quiz } from '../../quizzes/schemas/quiz.schema';
import { Folder } from '../../folders/schemas/folder.schema';
export declare enum ClassAccessLevel {
    ADMIN = "admin",
    COLLABORATOR = "collaborator",
    MEMBER = "member"
}
export declare enum ClassPublicAccessLevel {
    RESTRICTED = "restricted",
    VIEW_ONLY = "view_only",
    EDIT = "edit",
    NONE = "none"
}
export interface ClassMember {
    user: User | string;
    accessLevel: ClassAccessLevel;
    joinedAt: Date;
}
export declare class Class {
    _id: string;
    name: string;
    orgName: string;
    classCode: string;
    owner: User | string;
    members: ClassMember[];
    quizzes: Quiz[] | string[];
    folders: Folder[] | string[];
    publicAccess: ClassPublicAccessLevel;
    isActive: boolean;
    isArchived: boolean;
    archivedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type ClassDocument = Class & Document;
export declare const ClassSchema: MongooseSchema<Class, import("mongoose").Model<Class, any, any, any, Document<unknown, any, Class> & Class & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Class, Document<unknown, {}, import("mongoose").FlatRecord<Class>> & import("mongoose").FlatRecord<Class> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
