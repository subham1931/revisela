"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const zod_1 = require("zod");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const logger_module_1 = require("./logger/logger.module");
const http_logger_middleware_1 = require("./logger/http-logger.middleware");
const quizzes_module_1 = require("./quizzes/quizzes.module");
const s3_module_1 = require("./s3/s3.module");
const uploads_module_1 = require("./uploads/uploads.module");
const folders_module_1 = require("./folders/folders.module");
const classes_module_1 = require("./classes/classes.module");
const shared_module_1 = require("./shared/shared.module");
const validationSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: zod_1.z.string().default('3000'),
    API_PREFIX: zod_1.z.string().default('api'),
    MONGODB_URI: zod_1.z.string().url(),
    MONGODB_DB_NAME: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRATION: zod_1.z.string().default('1d'),
    JWT_REFRESH_EXPIRATION: zod_1.z.string().default('7d'),
    CORS_ORIGIN: zod_1.z.string(),
    LOG_LEVEL: zod_1.z
        .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
        .default('debug'),
    THROTTLE_TTL: zod_1.z.string().or(zod_1.z.number()).default('60'),
    THROTTLE_LIMIT: zod_1.z.string().or(zod_1.z.number()).default('100'),
    AWS_REGION: zod_1.z.string(),
    AWS_ACCESS_KEY_ID: zod_1.z.string(),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string(),
    AWS_S3_BUCKET_NAME: zod_1.z.string(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().or(zod_1.z.number()).optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().optional(),
});
const validate = (config) => {
    const result = validationSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }
    return result.data;
};
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                validate,
                envFilePath: ['.env.local', '.env'],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                    dbName: configService.get('MONGODB_DB_NAME'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
            }),
            logger_module_1.LoggerModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            quizzes_module_1.QuizzesModule,
            s3_module_1.S3Module,
            uploads_module_1.UploadsModule,
            folders_module_1.FoldersModule,
            classes_module_1.ClassesModule,
            shared_module_1.SharedModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map