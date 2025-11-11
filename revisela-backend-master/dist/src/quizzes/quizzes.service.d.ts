import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { DuplicateQuizDto } from './dto/duplicate-quiz.dto';
import { ShareQuizDto } from './dto/share-quiz.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
export declare class QuizzesService {
    private readonly quizModel;
    private readonly usersService;
    private readonly emailService;
    constructor(quizModel: Model<QuizDocument>, usersService: UsersService, emailService: EmailService);
    create(createQuizDto: CreateQuizDto, userId: string): Promise<Quiz>;
    findAllPublic(limit?: number, offset?: number): Promise<{
        results: Quiz[];
        totalCount: number;
    }>;
    findByUser(userId: string, limit?: number, offset?: number): Promise<{
        results: Quiz[];
        totalCount: number;
    }>;
    findOne(id: string, userId?: string): Promise<Quiz | null>;
    findByTag(tag: string, limit?: number, offset?: number): Promise<{
        results: Quiz[];
        totalCount: number;
    }>;
    search(query: string, limit?: number, offset?: number): Promise<{
        results: Quiz[];
        totalCount: number;
    }>;
    update(id: string, updateQuizDto: UpdateQuizDto, userId: string): Promise<Quiz | null>;
    remove(id: string, userId: string): Promise<Quiz | null>;
    moveToTrash(id: string, userId: string): Promise<Quiz>;
    restoreFromTrash(id: string, userId: string): Promise<Quiz>;
    permanentlyDelete(id: string, userId: string): Promise<Quiz>;
    findAllInTrash(userId: string): Promise<Quiz[]>;
    findAll(userId: string): Promise<Quiz[]>;
    duplicate(id: string, duplicateQuizDto: DuplicateQuizDto, userId: string): Promise<Quiz>;
    private hasPermission;
    private canBookmarkQuiz;
    toggleBookmark(id: string, userId: string, bookmarked: boolean): Promise<Quiz>;
    findBookmarked(userId: string): Promise<Quiz[]>;
    shareQuiz(id: string, shareQuizDto: ShareQuizDto, userId: string): Promise<Quiz>;
    generateShareLink(id: string, userId: string): Promise<{
        link: string;
    }>;
    updateMemberAccess(id: string, memberId: string, accessLevel: 'admin' | 'collaborator' | 'member', userId: string): Promise<Quiz>;
    removeMember(id: string, memberId: string, userId: string): Promise<Quiz>;
}
