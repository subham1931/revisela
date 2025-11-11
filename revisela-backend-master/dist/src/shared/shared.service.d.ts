import { Model } from 'mongoose';
import { FoldersService } from '../folders/folders.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { Quiz, QuizDocument } from '../quizzes/schemas/quiz.schema';
import { Folder, FolderDocument } from '../folders/schemas/folder.schema';
export interface SharedFolder extends Omit<Folder, 'type'> {
    userAccessLevel: string;
    type: 'folder';
}
export interface SharedQuiz extends Omit<Quiz, 'type'> {
    _id: string;
    type: 'quiz';
    sharedVia?: {
        folderId: string;
        folderName: string;
        accessLevel: string;
    };
}
export interface SharedContent {
    folders: SharedFolder[];
    quizzes: SharedQuiz[];
    totalCount: {
        folders: number;
        quizzes: number;
        total: number;
    };
}
export declare class SharedService {
    private folderModel;
    private quizModel;
    private readonly foldersService;
    private readonly quizzesService;
    constructor(folderModel: Model<FolderDocument>, quizModel: Model<QuizDocument>, foldersService: FoldersService, quizzesService: QuizzesService);
    getSharedContent(userId: string): Promise<SharedContent>;
    getSharedFolders(userId: string): Promise<SharedFolder[]>;
    getSharedQuizzes(userId: string): Promise<SharedQuiz[]>;
}
