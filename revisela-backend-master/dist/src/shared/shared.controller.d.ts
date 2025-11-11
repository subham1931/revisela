import { SharedService } from './shared.service';
export declare class SharedController {
    private readonly sharedService;
    constructor(sharedService: SharedService);
    getSharedContent(req: any): Promise<{
        success: boolean;
        data: import("./shared.service").SharedContent;
        message: string;
    }>;
    getSharedFolders(req: any): Promise<{
        success: boolean;
        data: import("./shared.service").SharedFolder[];
        count: number;
        message: string;
    }>;
    getSharedQuizzes(req: any): Promise<{
        success: boolean;
        data: import("./shared.service").SharedQuiz[];
        count: number;
        message: string;
    }>;
}
