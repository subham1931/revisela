import { z } from 'zod';
export declare const updateQuizSchema: z.ZodObject<z.objectUtil.extendShape<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    questions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<import("../schemas/quiz.schema").QuestionType.FLASH_CARD>;
        question: z.ZodString;
        answer: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: import("../schemas/quiz.schema").QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        type: import("../schemas/quiz.schema").QuestionType.FLASH_CARD;
        question: string;
        answer?: string | undefined;
        image?: string | undefined;
        audio?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<import("../schemas/quiz.schema").QuestionType.MCQ>;
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
        type: import("../schemas/quiz.schema").QuestionType.MCQ;
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
        type: import("../schemas/quiz.schema").QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<import("../schemas/quiz.schema").QuestionType.FILL_IN>;
        question: z.ZodString;
        answer: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: import("../schemas/quiz.schema").QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }, {
        type: import("../schemas/quiz.schema").QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    }>]>, "many">>;
    isPublic: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, {
    publicAccess: z.ZodOptional<z.ZodEnum<["restricted", "public"]>>;
}>, "strip", z.ZodTypeAny, {
    tags?: string[] | undefined;
    title?: string | undefined;
    description?: string | undefined;
    questions?: ({
        type: import("../schemas/quiz.schema").QuestionType.FLASH_CARD;
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
        type: import("../schemas/quiz.schema").QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        type: import("../schemas/quiz.schema").QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    })[] | undefined;
    isPublic?: boolean | undefined;
    publicAccess?: "restricted" | "public" | undefined;
}, {
    tags?: string[] | undefined;
    title?: string | undefined;
    description?: string | undefined;
    questions?: ({
        type: import("../schemas/quiz.schema").QuestionType.FLASH_CARD;
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
        type: import("../schemas/quiz.schema").QuestionType.MCQ;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    } | {
        type: import("../schemas/quiz.schema").QuestionType.FILL_IN;
        question: string;
        answer: string;
        image?: string | undefined;
        audio?: string | undefined;
    })[] | undefined;
    isPublic?: boolean | undefined;
    publicAccess?: "restricted" | "public" | undefined;
}>;
export type UpdateQuizDto = z.infer<typeof updateQuizSchema>;
