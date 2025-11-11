export declare const FILE_SIZE_LIMITS: {
    IMAGE: number;
    DOCUMENT: number;
    AUDIO: number;
};
export declare const MIME_TYPE_REGEX: {
    IMAGE: RegExp;
    DOCUMENT: RegExp;
    AUDIO: RegExp;
};
export declare const UPLOAD_FOLDERS: {
    IMAGES: string;
    DOCUMENTS: string;
    PROFILE_IMAGES: string;
    QUIZ_QUESTION_IMAGES: string;
    QUIZ_QUESTION_AUDIO: string;
    QUIZ_OPTION_IMAGES: string;
    QUIZ_OPTION_AUDIO: string;
};
export declare const UPLOAD_MESSAGES: {
    ERRORS: {
        ONLY_IMAGES: string;
        ONLY_DOCUMENTS: string;
        NO_FILE: string;
        UPLOAD_IMAGE_FAILED: string;
        UPLOAD_DOCUMENT_FAILED: string;
        PRESIGNED_URL_FAILED: string;
        DELETE_FAILED: string;
        UPLOAD_MEDIA_FAILED: string;
    };
    SUCCESS: {
        DELETE: string;
    };
};
