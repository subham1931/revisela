import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Quiz } from '../../quizzes/schemas/quiz.schema';
export declare enum AccessLevel {
    ADMIN = "admin",
    COLLABORATOR = "collaborator",
    MEMBER = "member"
}
export declare enum PublicAccessLevel {
    RESTRICTED = "restricted",
    VIEW_ONLY = "view_only",
    EDIT = "edit",
    NONE = "none"
}
export interface SharedUser {
    user: User | string;
    accessLevel: AccessLevel;
    name?: string;
    email?: string;
}
export declare class Folder {
    _id: string;
    name: string;
    description: string;
    owner: User | string;
    parentFolder: Folder | string;
    subFolders: Folder[] | string[];
    quizzes: Quiz[] | string[];
    sharedWith: SharedUser[];
    publicAccess: PublicAccessLevel;
    isInTrash: boolean;
    bookmarkedBy: User[] | string[];
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type FolderDocument = Folder & Document;
export declare const FolderSchema: MongooseSchema<Folder, import("mongoose").Model<Folder, any, any, any, Document<unknown, any, Folder> & Folder & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Folder, Document<unknown, {}, import("mongoose").FlatRecord<Folder>> & import("mongoose").FlatRecord<Folder> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
