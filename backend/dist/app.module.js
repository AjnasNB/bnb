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
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const platform_express_1 = require("@nestjs/platform-express");
const app_config_1 = require("./config/app.config");
const health_module_1 = require("./modules/health/health.module");
const policies_module_1 = require("./modules/policies/policies.module");
const claims_module_1 = require("./modules/claims/claims.module");
const users_module_1 = require("./modules/users/users.module");
const blockchain_module_1 = require("./modules/blockchain/blockchain.module");
const ai_module_1 = require("./modules/ai/ai.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const user_entity_1 = require("./modules/users/entities/user.entity");
const policy_entity_1 = require("./modules/policies/entities/policy.entity");
const claim_entity_1 = require("./modules/claims/entities/claim.entity");
const blockchain_transaction_entity_1 = require("./modules/blockchain/entities/blockchain-transaction.entity");
const notification_entity_1 = require("./modules/notifications/entities/notification.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [() => app_config_1.AppConfig],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: app_config_1.AppConfig.database.path,
                entities: [user_entity_1.User, policy_entity_1.Policy, claim_entity_1.Claim, blockchain_transaction_entity_1.BlockchainTransaction, notification_entity_1.Notification],
                synchronize: app_config_1.AppConfig.database.synchronize,
                autoLoadEntities: app_config_1.AppConfig.database.autoLoadEntities,
                logging: app_config_1.AppConfig.database.logging,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: app_config_1.AppConfig.rateLimit.ttl,
                    limit: app_config_1.AppConfig.rateLimit.max,
                }]),
            platform_express_1.MulterModule.register({
                dest: app_config_1.AppConfig.upload.uploadPath,
                limits: {
                    fileSize: app_config_1.AppConfig.upload.maxFileSize,
                },
            }),
            health_module_1.HealthModule,
            users_module_1.UsersModule,
            policies_module_1.PoliciesModule,
            claims_module_1.ClaimsModule,
            blockchain_module_1.BlockchainModule,
            ai_module_1.AIModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map