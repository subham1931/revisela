"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const folders_service_1 = require("./folders.service");
const folders_controller_1 = require("./folders.controller");
const folder_schema_1 = require("./schemas/folder.schema");
const quiz_schema_1 = require("../quizzes/schemas/quiz.schema");
const quizzes_module_1 = require("../quizzes/quizzes.module");
const users_module_1 = require("../users/users.module");
const email_module_1 = require("../email/email.module");
let FoldersModule = class FoldersModule {
};
exports.FoldersModule = FoldersModule;
exports.FoldersModule = FoldersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: folder_schema_1.Folder.name, schema: folder_schema_1.FolderSchema },
                { name: quiz_schema_1.Quiz.name, schema: quiz_schema_1.QuizSchema },
            ]),
            quizzes_module_1.QuizzesModule,
            users_module_1.UsersModule,
            email_module_1.EmailModule,
        ],
        controllers: [folders_controller_1.FoldersController],
        providers: [folders_service_1.FoldersService],
        exports: [folders_service_1.FoldersService],
    })
], FoldersModule);
//# sourceMappingURL=folders.module.js.map