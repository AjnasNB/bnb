"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const policies_service_1 = require("./policies.service");
const policies_controller_1 = require("./policies.controller");
const policy_schema_1 = require("./policy.schema");
const blockchain_module_1 = require("../blockchain/blockchain.module");
const users_module_1 = require("../users/users.module");
let PoliciesModule = class PoliciesModule {
};
exports.PoliciesModule = PoliciesModule;
exports.PoliciesModule = PoliciesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: policy_schema_1.Policy.name, schema: policy_schema_1.PolicySchema }]),
            blockchain_module_1.BlockchainModule,
            users_module_1.UsersModule,
        ],
        controllers: [policies_controller_1.PoliciesController],
        providers: [policies_service_1.PoliciesService],
        exports: [policies_service_1.PoliciesService],
    })
], PoliciesModule);
//# sourceMappingURL=policies.module.js.map