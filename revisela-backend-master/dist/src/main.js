"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const https = require("https");
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const logger_service_1 = require("./logger/logger.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const config_1 = require("@nestjs/config");
const users_service_1 = require("./users/users.service");
const user_schema_1 = require("./users/schemas/user.schema");
const sslDir = process.env.SSL_DIR || path.join(process.cwd(), 'ssl');
async function setupSystemAdmin(app) {
    const logger = app.get(logger_service_1.LoggerService);
    const configService = app.get(config_1.ConfigService);
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = configService.get('SYSTEM_ADMIN_EMAIL');
    if (!adminEmail) {
        logger.warn('SYSTEM_ADMIN_EMAIL not defined. Skipping system admin setup.');
        return;
    }
    try {
        const existingAdmin = await usersService.findByEmail(adminEmail);
        if (existingAdmin) {
            logger.log(`System admin account already exists: ${adminEmail}`);
            return;
        }
        const adminPassword = configService.get('SYSTEM_ADMIN_PASSWORD');
        const adminName = configService.get('SYSTEM_ADMIN_NAME');
        const adminUsername = configService.get('SYSTEM_ADMIN_USERNAME');
        if (!adminPassword) {
            logger.warn('SYSTEM_ADMIN_PASSWORD not defined. Skipping system admin setup.');
            return;
        }
        const adminUser = await usersService.create({
            email: adminEmail,
            password: adminPassword,
            name: adminName || 'System Administrator',
            username: adminUsername || 'sysadmin',
            role: user_schema_1.UserRole.SYSTEM_ADMIN,
        });
        logger.log(`System admin account created: ${adminEmail}`);
        return adminUser;
    }
    catch (error) {
        logger.error(`Failed to setup system admin: ${error.message}`);
    }
}
async function bootstrap() {
    if (process.env.NODE_ENV === 'production') {
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = app.get(logger_service_1.LoggerService);
    app.useLogger(logger);
    const corsOrigin = process.env.CORS_ORIGIN;
    let originsArray = [];
    if (corsOrigin) {
        originsArray = corsOrigin.split(',').map((origin) => origin.trim());
    }
    const allowedOrigins = [
        ...originsArray,
        'http://localhost:4000',
        'https://revisela-v3.vercel.app',
        'https://www.revisela-v3.vercel.app',
    ];
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization'],
    }));
    const globalPrefix = process.env.API_PREFIX || 'api';
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    await setupSystemAdmin(app);
    const httpPort = process.env.HTTP_PORT || 3000;
    await app.listen(httpPort);
    logger.log(`\x1b[32mHTTP server running on: http://localhost:${httpPort}/${globalPrefix}\x1b[0m`, 'Bootstrap');
    try {
        const keyPath = path.join(sslDir, 'key.pem');
        const certPath = path.join(sslDir, 'cert.pem');
        if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
            logger.warn(`SSL certificates not found at ${sslDir}, HTTPS server will not start`);
            return;
        }
        const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        };
        const httpsPort = process.env.HTTPS_PORT || 3443;
        const httpsServer = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());
        await new Promise((resolve) => httpsServer.listen(httpsPort, resolve));
        logger.log(`\x1b[32mHTTPS server running on: https://localhost:${httpsPort}/${globalPrefix}\x1b[0m`, 'Bootstrap');
    }
    catch (error) {
        logger.error(`Failed to start HTTPS server: ${error.message}`, 'Bootstrap');
        logger.error(`Make sure the SSL certificates exist at ${process.cwd()}/ssl/`, 'Bootstrap');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map