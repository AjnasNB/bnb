"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
let GovernanceService = class GovernanceService {
    async getProposals() {
        return {
            proposals: [
                {
                    id: '1',
                    title: 'Increase Coverage Limits',
                    description: 'Proposal to increase maximum coverage limits for health insurance',
                    status: 'active',
                    votesFor: '150000',
                    votesAgainst: '50000',
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }
            ],
            total: 1,
        };
    }
    async healthCheck() {
        return {
            status: 'healthy',
            message: 'Governance service is operational',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = __decorate([
    (0, common_1.Injectable)()
], GovernanceService);
//# sourceMappingURL=governance.service.js.map