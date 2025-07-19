"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
const path_1 = require("path");
exports.databaseConfig = (0, config_1.registerAs)('database', () => ({
    type: 'sqlite',
    path: process.env.DATABASE_PATH || (0, path_1.join)(process.cwd(), 'db', 'chainsure.db'),
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DATABASE_LOGGING === 'true',
    migrations: [(0, path_1.join)(__dirname, '..', 'database', 'migrations', '*.ts')],
    migrationsRun: true,
    entities: [(0, path_1.join)(__dirname, '..', '**', '*.entity.ts')],
}));
//# sourceMappingURL=database.config.js.map