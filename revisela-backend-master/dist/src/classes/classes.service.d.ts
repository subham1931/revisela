import { Model } from 'mongoose';
import { Class, ClassDocument, ClassAccessLevel } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JoinClassDto } from './dto/join-class.dto';
import { ManageMemberDto, AddMembersDto, RemoveMemberDto } from './dto/manage-member.dto';
import { AddQuizToClassDto, AddFolderToClassDto, RemoveQuizFromClassDto, RemoveFolderFromClassDto } from './dto/add-content.dto';
import { UsersService } from '../users/users.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { FoldersService } from '../folders/folders.service';
export type ClassWithUserMeta = Class & {
    isOwner: boolean;
    userAccessLevel: ClassAccessLevel | 'owner' | 'none';
    memberCount: number;
};
export declare class ClassesService {
    private classModel;
    private usersService;
    private quizzesService;
    private foldersService;
    constructor(classModel: Model<ClassDocument>, usersService: UsersService, quizzesService: QuizzesService, foldersService: FoldersService);
    private generateClassCode;
    private generateUniqueClassCode;
    create(createClassDto: CreateClassDto, userId: string): Promise<Class>;
    findAll(userId: string): Promise<Class[]>;
    findOne(id: string, userId?: string): Promise<Class | ClassWithUserMeta>;
    findByClassCode(classCode: string): Promise<Class>;
    update(id: string, updateClassDto: UpdateClassDto, userId: string): Promise<Class>;
    remove(id: string, userId: string): Promise<Class>;
    joinClass(joinClassDto: JoinClassDto, userId: string): Promise<Class>;
    leaveClass(id: string, userId: string): Promise<{
        message: string;
    }>;
    addMembers(id: string, addMembersDto: AddMembersDto, userId: string): Promise<Class>;
    updateMemberAccess(id: string, manageMemberDto: ManageMemberDto, userId: string): Promise<Class>;
    removeMember(id: string, removeMemberDto: RemoveMemberDto, userId: string): Promise<Class>;
    addQuiz(id: string, addQuizDto: AddQuizToClassDto, userId: string): Promise<Class>;
    removeQuiz(id: string, removeQuizDto: RemoveQuizFromClassDto, userId: string): Promise<Class>;
    addFolder(id: string, addFolderDto: AddFolderToClassDto, userId: string): Promise<Class>;
    removeFolder(id: string, removeFolderDto: RemoveFolderFromClassDto, userId: string): Promise<Class>;
    archiveClass(id: string, userId: string): Promise<Class>;
    restoreClass(id: string, userId: string): Promise<Class>;
    private hasAccess;
    private hasPublicAccess;
    private addUserMetadata;
}
