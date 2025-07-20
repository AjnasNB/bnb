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
exports.ClaimsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const claims_service_1 = require("./claims.service");
let ClaimsController = class ClaimsController {
    constructor(claimsService) {
        this.claimsService = claimsService;
    }
    async findAll(status) {
        return this.claimsService.findAll(status);
    }
    async getClaimsForVoting() {
        return this.claimsService.getClaimsForVoting();
    }
    async findOne(id) {
        return this.claimsService.findOne(id);
    }
    async getClaimWithVotingDetails(id) {
        return this.claimsService.getClaimWithVotingDetails(id);
    }
    async create(claimData) {
        return this.claimsService.create(claimData);
    }
    async voteOnClaim(voteData) {
        return this.claimsService.voteOnClaim(voteData);
    }
};
exports.ClaimsController = ClaimsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all claims' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('voting'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claims ready for community voting' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "getClaimsForVoting", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/voting-details'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim with voting details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "getClaimWithVotingDetails", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new claim' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a claim' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "voteOnClaim", null);
exports.ClaimsController = ClaimsController = __decorate([
    (0, swagger_1.ApiTags)('Claims'),
    (0, common_1.Controller)('claims'),
    __metadata("design:paramtypes", [claims_service_1.ClaimsService])
], ClaimsController);
//# sourceMappingURL=claims.controller.js.map