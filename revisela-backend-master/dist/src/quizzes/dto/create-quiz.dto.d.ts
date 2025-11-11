import { z } from 'zod';
import { QuestionType } from '../schemas/quiz.schema';
export declare const createQuizSchema: z.ZodObject<{
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
    tags?: string[] | undefined;
    isPublic?: boolean | undefined;
}>;
export type CreateQuizDto = z.infer<typeof createQuizSchema>;
