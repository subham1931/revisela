"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const quizzes_service_1 = require("./quizzes.service");
const quizzes_controller_1 = require("./quizzes.controller");
const quiz_schema_1 = require("./schemas/quiz.schema");
const s3_module_1 = require("../s3/s3.module");
const users_module_1 = require("../users/users.module");
const email_module_1 = require("../email/email.module");
const folder_schema_1 = require("../folders/schemas/folder.schema");
let QuizzesModule = class QuizzesModule {
};
exports.QuizzesModule = QuizzesModule;
exports.QuizzesModule = QuizzesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: quiz_schema_1.Quiz.name, schema: quiz_schema_1.QuizSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: folder_schema_1.Folder.name, schema: folder_schema_1.FolderSchema }]),
            s3_module_1.S3Module,
            users_module_1.UsersModule,
            email_module_1.EmailModule,
        ],
        controllers: [quizzes_controller_1.QuizzesController],
        providers: [quizzes_service_1.QuizzesService],
        exports: [quizzes_service_1.QuizzesService],
    })
], QuizzesModule);
//# sourceMappingURL=quizzes.module.js.map