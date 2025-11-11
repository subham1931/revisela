import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { DuplicateQuizDto } from './dto/duplicate-quiz.dto';
import { BookmarkQuizDto } from './dto/bookmark-quiz.dto';
import { ShareQuizDto } from './dto/share-quiz.dto';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    create(createQuizDto: CreateQuizDto, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    findAll(limit?: number, offset?: number): Promise<{
        results: import("./schemas/quiz.schema").Quiz[];
        totalCount: number;
    }>;
    search(query: string, limit?: number, offset?: number): Promise<{
        results: import("./schemas/quiz.schema").Quiz[];
        totalCount: number;
    }>;
    findByTag(tag: string, limit?: number, offset?: number): Promise<{
        results: import("./schemas/quiz.schema").Quiz[];
        totalCount: number;
    }>;
    findMyQuizzes(req: any, limit?: number, offset?: number): Promise<{
        results: import("./schemas/quiz.schema").Quiz[];
        totalCount: number;
    }>;
    findAllInTrash(req: any): Promise<import("./schemas/quiz.schema").Quiz[]>;
    findBookmarked(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/quiz.schema").Quiz[];
    }>;
    restore(id: string, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    permanentlyDelete(id: string, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    findOne(id: string, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    update(id: string, updateQuizDto: UpdateQuizDto, req: any): Promise<import("./schemas/quiz.schema").Quiz | null>;
    moveToTrash(id: string, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    duplicate(id: string, duplicateQuizDto: DuplicateQuizDto, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    bookmark(id: string, bookmarkQuizDto: BookmarkQuizDto, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    shareQuiz(id: string, shareQuizDto: ShareQuizDto, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    generateShareLink(id: string, req: any): Promise<{
        link: string;
    }>;
    updateMemberAccess(id: string, userId: string, body: {
        accessLevel: 'admin' | 'collaborator' | 'member';
    }, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
    removeMember(id: string, userId: string, req: any): Promise<import("./schemas/quiz.schema").Quiz>;
}
