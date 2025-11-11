import { Document, Schema as MongooseSchema } from 'mongoose';
import { z } from 'zod';
import { User } from '../../users/schemas/user.schema';
export declare enum QuestionType {
    FLASH_CARD = "flashCard",
    MCQ = "mcq",
    FILL_IN = "fillIn"
}
export interface BaseQuestion {
    type: QuestionType;
    question: string;
    image?: string;
    audio?: string;
}
export interface MCQOption {
    label: string;
    value: string;
    image?: string;
    audio?: string;
}
export interface FlashCardQuestion extends BaseQuestion {
    type: QuestionType.FLASH_CARD;
    answer?: string;
}
export interface MCQQuestion extends BaseQuestion {
    type: QuestionType.MCQ;
    answer: string;
    options: MCQOption[];
}
export interface FillInQuestion extends BaseQuestion {
    type: QuestionType.FILL_IN;
    answer: string;
}
export type Question = FlashCardQuestion | MCQQuestion | FillInQuestion;
export declare const QuestionValidationSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<QuestionType.FLASH_CARD>;
    question: z.ZodString;
    answer: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    audio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: QuestionType.FLASH_CARD;
    question: string;
    answer?: string | undefined;
    image?: string | undefined;
    audio?: string | undefined;
}, {
    type: QuestionType.FLASH_CARD;
    question: string;
    answer?: string | undefined;
    image?: string | undefined;
    audio?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<QuestionType.MCQ>;
    question: z.ZodString;
    answer: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        value: string;
        label: string;
        image?: string | undefined;
        audio?: string | undefined;
    }>, "many">;
    image: z.ZodOptional<z.ZodString>;
    audio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    options: {
        value: string;
        label: string;
        image?: string | undefined;
        audio?: string | undefined;
    }[];
    type: QuestionType.MCQ;
    question: string;
    answer: string;
    image?: string | undefined;
    audio?: string | undefined;
}, {
    options: {
        value: string;
        label: string;
        image?: string | undefined;
        audio?: string | undefined;
    }[];
    type: QuestionType.MCQ;
    question: string;
    answer: string;
    image?: string | undefined;
    audio?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<QuestionType.FILL_IN>;
    question: z.ZodString;
    answer: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    audio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: QuestionType.FILL_IN;
    question: string;
    answer: string;
    image?: string | undefined;
    audio?: string | undefined;
}, {
    type: QuestionType.FILL_IN;
    question: string;
    answer: string;
    image?: string | undefined;
    audio?: string | undefined;
}>]>;
export declare const QuizValidationSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    questions: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<QuestionType.FLASH_CARD>;
        question: z.ZodString;
        answer: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        type: QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<QuestionType.MCQ>;
        question: z.ZodString;
        answer: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
            image: z.ZodOptional<z.ZodString>;
            audio: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }, {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }>, "many">;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        options: {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }[];
        type: QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        options: {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }[];
        type: QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<QuestionType.FILL_IN>;
        question: z.ZodString;
        answer: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        type: QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }>]>, "many">;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    createdBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tags: string[];
    title: string;
    description: string;
    questions: ({
        type: QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        options: {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }[];
        type: QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        type: QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    })[];
    isPublic: boolean;
    createdBy: string;
}, {
    title: string;
    description: string;
    questions: ({
        type: QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        options: {
            value: string;
            label: string;
            image?: string | undefined;
            audio?: string | undefined;
        }[];
        type: QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        type: QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    })[];
    createdBy: string;
    tags?: string[] | undefined;
    isPublic?: boolean | undefined;
}>;
export declare class Quiz {
    title: string;
    description: string;
    tags: string[];
    questions: Question[];
    isPublic: boolean;
    createdBy: User | string;
    sharedWith: Array<{
        user: User | string;
        accessLevel: 'admin' | 'collaborator' | 'member';
        name?: string;
        email?: string;
    }>;
    publicAccess: 'restricted' | 'public';
    createdAt: Date;
    updatedAt: Date;
    isInTrash: boolean;
    bookmarkedBy: User[] | string[];
    deletedAt: Date;
    isBookmarked?: boolean;
    isCreator?: boolean;
}
export type QuizDocument = Quiz & Document;
export declare const QuizSchema: MongooseSchema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz> & Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>> & import("mongoose").FlatRecord<Quiz> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
