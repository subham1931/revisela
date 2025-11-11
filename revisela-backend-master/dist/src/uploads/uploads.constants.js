"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_MESSAGES = exports.UPLOAD_FOLDERS = exports.MIME_TYPE_REGEX = exports.FILE_SIZE_LIMITS = void 0;
exports.FILE_SIZE_LIMITS = {
    IMAGE: 5 * 1024 * 1024,
    DOCUMENT: 10 * 1024 * 1024,
    AUDIO: 15 * 1024 * 1024,
};
exports.MIME_TYPE_REGEX = {
    IMAGE: /image\/(png|jpe?g|gif|webp|bmp)/,
    DOCUMENT: /application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/,
    AUDIO: /audio\/(mpeg|mp4|ogg|wav|webm)/,
};
exports.UPLOAD_FOLDERS = {
    IMAGES: 'images',
    DOCUMENTS: 'documents',
    PROFILE_IMAGES: 'profile-images',
    QUIZ_QUESTION_IMAGES: 'quiz-question-images',
    QUIZ_QUESTION_AUDIO: 'quiz-question-audio',
    QUIZ_OPTION_IMAGES: 'quiz-option-images',
    QUIZ_OPTION_AUDIO: 'quiz-option-audio',
};
exports.UPLOAD_MESSAGES = {
    ERRORS: {
        ONLY_IMAGES: 'Only image files are allowed',
        ONLY_DOCUMENTS: 'Only PDF and Word documents are allowed',
        NO_FILE: 'No file uploaded',
        UPLOAD_IMAGE_FAILED: 'Failed to upload image',
        UPLOAD_DOCUMENT_FAILED: 'Failed to upload document',
        PRESIGNED_URL_FAILED: 'Failed to generate presigned URL',
        DELETE_FAILED: 'Failed to delete file',
        UPLOAD_MEDIA_FAILED: 'Failed to upload media file',
    },
    SUCCESS: {
        DELETE: 'File deleted successfully',
    },
};
//# sourceMappingURL=uploads.constants.js.map