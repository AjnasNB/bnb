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
exports.GovernanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_service_1 = require("./governance.service");
let GovernanceController = class GovernanceController {
    constructor(governanceService) {
        this.governanceService = governanceService;
    }
    async getProposals() {
        return this.governanceService.getProposals();
    }
    async voteOnProposal(proposalId, voteData) {
        return this.governanceService.voteOnProposal(proposalId, voteData);
    }
    async processVotingResults(proposalId) {
        return this.governanceService.processVotingResults(proposalId);
    }
    async healthCheck() {
        return this.governanceService.healthCheck();
    }
};
exports.GovernanceController = GovernanceController;
__decorate([
    (0, common_1.Get)('proposals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all governance proposals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of governance proposals' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "getProposals", null);
__decorate([
    (0, common_1.Post)('proposals/:id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a governance proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote submitted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "voteOnProposal", null);
__decorate([
    (0, common_1.Post)('proposals/:id/process-results'),
    (0, swagger_1.ApiOperation)({ summary: 'Process voting results for a proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voting results processed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "processVotingResults", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Governance service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Governance service status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "healthCheck", null);
exports.GovernanceController = GovernanceController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance'),
    __metadata("design:paramtypes", [governance_service_1.GovernanceService])
], GovernanceController);
//# sourceMappingURL=governance.controller.js.map