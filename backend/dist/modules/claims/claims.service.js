"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
let ClaimsService = class ClaimsService {
    async findAll() {
        return {
            claims: [
                {
                    id: 'claim_1',
                    userId: 'user_1',
                    policyId: 'pol_1',
                    type: 'health',
                    status: 'approved',
                    requestedAmount: '1250',
                    description: 'Emergency room visit',
                },
            ],
        };
    }
    async findOne(id) {
        return {
            id,
            userId: 'user_1',
            policyId: 'pol_1',
            type: 'health',
            status: 'approved',
            requestedAmount: '1250',
            description: 'Emergency room visit',
        };
    }
    async create(claimData) {
        return {
            success: true,
            claim: { id: `claim_${Date.now()}`, ...claimData },
        };
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = __decorate([
    (0, common_1.Injectable)()
], ClaimsService);
//# sourceMappingURL=claims.service.js.map