/**
 * Query Keys
 *
 * This file contains constants for all React Query key patterns used in the application.
 * Using these constants ensures consistency and makes invalidation easier.
 */

export const QUERY_KEYS = {
  // User related keys
  USERS: {
    all: ['users'] as const,
    details: (userId: string) => ['user', userId] as const,
    me: ['user', 'me'] as const,
    byEmail: (email: string) => ['user', 'email', email] as const,
  },

  // Authentication related keys
  AUTH: {
    me: ['user', 'me'] as const,
  },

  // Quiz related keys
  QUIZZES: {
    all: ['quizzes'] as const,
    details: (quizId: string) => ['quiz', quizId] as const,
    myQuizzes: ['myQuizzes'] as const,
    byTag: (tag: string) => ['quizzes', 'tag', tag] as const,
    search: (query: string) => ['quizSearch', query] as const,
    trash: ['quizzes', 'trash'] as const,
    bookmarked: ['quizzes', 'bookmarked'] as const,
    // 🆕 NEW — get quizzes by folder
    byFolder: (folderId?: string) =>
      ['quizzes', 'folder', folderId ?? 'root'] as const,
    public: ['quizzes', 'public'] as const,
    recent: ['quizzes', 'recent'] as const,
  },

  // Folder related keys
  FOLDERS: {
    all: ['folders'] as const,
    byParent: (parentId?: string) => ['folders', parentId] as const,
    details: (folderId: string) => ['folder', folderId] as const,
    trash: ['folders', 'trash'] as const,
    bookmarked: ['folders', 'bookmarked'] as const,
  },

  // Class related keys
  CLASSES: {
    all: ['classes'] as const,
    myClasses: ['my-classes'] as const,
    details: (classId: string) => ['class', classId] as const,
    members: (classId: string) => ['class', classId, 'members'] as const,
    quizzes: (classId: string) => ['class', classId, 'quizzes'] as const,
    invitations: ['class-invitations'] as const,
  },

  // Upload related keys
  UPLOADS: {
    presignedUrl: (key: string) => ['presignedUrl', key] as const,
  },

  // Library related keys
  LIBRARY: {
    quizSets: (folderId?: string) => ['quizSets', folderId] as const,
  },

  // Shared content related keys
  SHARED: {
    all: ['shared'] as const,
    folders: ['shared', 'folders'] as const,
    quizzes: ['shared', 'quizzes'] as const,
  },
};