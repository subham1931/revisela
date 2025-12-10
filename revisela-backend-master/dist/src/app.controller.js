"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const users_service_1 = require("./users/users.service");
const folders_service_1 = require("./folders/folders.service");
const quizzes_service_1 = require("./quizzes/quizzes.service");
const classes_service_1 = require("./classes/classes.service");
const auth_service_1 = require("./auth/auth.service");

let AppController = class AppController {
    constructor(appService, usersService, foldersService, quizzesService, classesService, authService) {
        this.appService = appService;
        this.usersService = usersService;
        this.foldersService = foldersService;
        this.quizzesService = quizzesService;
        this.classesService = classesService;
        this.authService = authService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async search(query, req) {
        if (!query) return { users: [], folders: [], quizzes: [], classes: [] };

        // Manual token decoding since endpoint is public but needs user context
        let userId = null;
        try {
            if (req.headers.authorization) {
                const token = req.headers.authorization.replace('Bearer ', '');
                if (token) {
                    const decoded = this.authService.jwtService.decode(token);
                    if (decoded) {
                        userId = decoded.sub || decoded.userId || decoded._id;
                    }
                }
            }
        } catch (e) {
            console.error('Error decoding token in search:', e);
        }

        // Fallback to req.user if available (e.g. if I add a guard later)
        if (!userId && req.user) {
            userId = req.user.userId || req.user._id || req.user.sub;
        }

        const [users, folders, quizzes, classes] = await Promise.all([
            this.usersService.search(query),
            userId ? this.foldersService.search(query, userId) : [],
            this.quizzesService.search(query, 20, 0),
            userId ? this.classesService.search(query, userId) : []
        ]);
        return {
            users,
            folders,
            quizzes: quizzes.results,
            classes
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "search", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [
        app_service_1.AppService,
        users_service_1.UsersService,
        folders_service_1.FoldersService,
        quizzes_service_1.QuizzesService,
        classes_service_1.ClassesService,
        auth_service_1.AuthService
    ])
], AppController);