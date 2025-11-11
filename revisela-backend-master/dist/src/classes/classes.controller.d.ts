import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JoinClassDto } from './dto/join-class.dto';
import { ManageMemberDto, AddMembersDto } from './dto/manage-member.dto';
import { AddQuizToClassDto, AddFolderToClassDto } from './dto/add-content.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto, req: any): Promise<import("./schemas/class.schema").Class>;
    findAll(req: any): Promise<import("./schemas/class.schema").Class[]>;
    findOne(id: string, req: any): Promise<import("./schemas/class.schema").Class | import("./classes.service").ClassWithUserMeta>;
    update(id: string, updateClassDto: UpdateClassDto, req: any): Promise<import("./schemas/class.schema").Class>;
    remove(id: string, req: any): Promise<import("./schemas/class.schema").Class>;
    joinClass(joinClassDto: JoinClassDto, req: any): Promise<import("./schemas/class.schema").Class>;
    leaveClass(id: string, req: any): Promise<{
        message: string;
    }>;
    addMembers(id: string, addMembersDto: AddMembersDto, req: any): Promise<import("./schemas/class.schema").Class>;
    updateMemberAccess(id: string, userId: string, manageMemberDto: Omit<ManageMemberDto, 'userId'>, req: any): Promise<import("./schemas/class.schema").Class>;
    removeMember(id: string, userId: string, req: any): Promise<import("./schemas/class.schema").Class>;
    addQuiz(id: string, addQuizDto: AddQuizToClassDto, req: any): Promise<import("./schemas/class.schema").Class>;
    removeQuiz(id: string, quizId: string, req: any): Promise<import("./schemas/class.schema").Class>;
    addFolder(id: string, addFolderDto: AddFolderToClassDto, req: any): Promise<import("./schemas/class.schema").Class>;
    removeFolder(id: string, folderId: string, req: any): Promise<import("./schemas/class.schema").Class>;
    archiveClass(id: string, req: any): Promise<import("./schemas/class.schema").Class>;
    restoreClass(id: string, req: any): Promise<import("./schemas/class.schema").Class>;
}
