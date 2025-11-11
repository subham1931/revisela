"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const uploads_controller_1 = require("./uploads.controller");
const s3_module_1 = require("../s3/s3.module");
const uploads_config_1 = require("./uploads.config");
const users_module_1 = require("../users/users.module");
const quizzes_module_1 = require("../quizzes/quizzes.module");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [s3_module_1.S3Module, users_module_1.UsersModule, quizzes_module_1.QuizzesModule],
        controllers: [uploads_controller_1.UploadsController],
        providers: [uploads_config_1.UploadsConfig],
        exports: [uploads_config_1.UploadsConfig],
    })
], UploadsModule);
//# sourceMappingURL=uploads.module.js.map