import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ShareFolderDto } from './dto/share-folder.dto';
import { DuplicateFolderDto } from './dto/duplicate-folder.dto';
import { BookmarkFolderDto } from './dto/bookmark-folder.dto';
import { MoveItemsDto } from './dto/move-items.dto';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    getBookmarkedFolders(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/folder.schema").Folder[];
    }>;
    create(createFolderDto: CreateFolderDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    findAll(req: any): Promise<import("./schemas/folder.schema").Folder[]>;
    findAllInTrash(req: any): Promise<import("./schemas/folder.schema").Folder[]>;
    restore(id: string, req: any): Promise<import("./schemas/folder.schema").Folder>;
    permanentlyDelete(id: string, req: any): Promise<import("./schemas/folder.schema").Folder>;
    findOne(id: string, req: any): Promise<import("./schemas/folder.schema").Folder>;
    update(id: string, updateFolderDto: UpdateFolderDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    moveToTrash(id: string, req: any): Promise<import("./schemas/folder.schema").Folder>;
    addQuiz(id: string, quizId: string, req: any): Promise<import("./schemas/folder.schema").Folder>;
    shareFolder(id: string, shareFolderDto: ShareFolderDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    generateShareLink(id: string, req: any): Promise<{
        link: string;
    }>;
    duplicate(id: string, duplicateFolderDto: DuplicateFolderDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    bookmark(id: string, bookmarkFolderDto: BookmarkFolderDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    moveFolder(id: string, moveItemsDto: MoveItemsDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
    moveQuiz(quizId: string, moveItemsDto: MoveItemsDto, req: any): Promise<import("./schemas/folder.schema").Folder>;
}
