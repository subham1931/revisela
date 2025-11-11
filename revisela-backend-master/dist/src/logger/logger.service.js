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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston = require("winston");
const winston_1 = require("winston");
let LoggerService = class LoggerService {
    configService;
    logger;
    constructor(configService) {
        this.configService = configService;
        const logLevel = this.configService.get('LOG_LEVEL') || 'info';
        const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json());
        const consoleFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message, context, ...meta }) => {
            return `[${timestamp}] [${level}] ${context ? `[${context}]` : ''} ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        }));
        const transports = [
            new winston.transports.Console({
                format: consoleFormat,
            }),
            ...(this.configService.get('NODE_ENV') === 'production'
                ? [
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: logFormat,
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log',
                        format: logFormat,
                    }),
                ]
                : []),
        ];
        this.logger = winston.createLogger({
            level: logLevel,
            transports,
        });
    }
    log(message, context) {
        this.logger.info(message, { context });
    }
    error(message, trace, context) {
        this.logger.error(message, { trace, context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    debug(message, context) {
        this.logger.debug(message, { context });
    }
    verbose(message, context) {
        this.logger.verbose(message, { context });
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map