"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWinstonLogger = createWinstonLogger;
const winston = require("winston");
const nest_winston_1 = require("nest-winston");
function createWinstonLogger() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const environment = process.env.NODE_ENV || 'development';
    const transports = [];
    if (environment === 'development') {
        transports.push(new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike('ChainSure', {
                colors: true,
                prettyPrint: true,
            })),
        }));
    }
    else {
        transports.push(new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
        }));
    }
    if (environment === 'production') {
        transports.push(new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
        }), new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
        }));
    }
    return {
        level: logLevel,
        format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true })),
        defaultMeta: { service: 'chainsure-backend' },
        transports,
    };
}
//# sourceMappingURL=winston.config.js.map