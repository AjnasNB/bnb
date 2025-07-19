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
const create_claim_dto_1 = require("./dto/create-claim.dto");
const update_claim_dto_1 = require("./dto/update-claim.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const claim_schema_1 = require("./claim.schema");
let ClaimsController = class ClaimsController {
    constructor(claimsService) {
        this.claimsService = claimsService;
    }
    create(createClaimDto, req) {
        return this.claimsService.create(createClaimDto, req.user.id);
    }
    findAll(userId) {
        return this.claimsService.findAll(userId);
    }
    findUserClaims(req) {
        return this.claimsService.findUserClaims(req.user.id);
    }
    getStatistics(userId) {
        return this.claimsService.getClaimStatistics(userId);
    }
    findByClaimNumber(claimNumber) {
        return this.claimsService.findByClaimNumber(claimNumber);
    }
    findOne(id) {
        return this.claimsService.findOne(id);
    }
    update(id, updateClaimDto) {
        return this.claimsService.update(id, updateClaimDto);
    }
    processWithAI(id) {
        return this.claimsService.processWithAI(id);
    }
    processPayment(id) {
        return this.claimsService.processPayment(id);
    }
    updateStatus(id, status, notes) {
        return this.claimsService.updateStatus(id, status, notes);
    }
    remove(id) {
        return this.claimsService.remove(id);
    }
};
exports.ClaimsController = ClaimsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new insurance claim' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Claim submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_claim_dto_1.CreateClaimDto, Object]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all claims' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claims retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-claims'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user claims' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User claims retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "findUserClaims", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('number/:claimNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim by claim number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Claim not found' }),
    __param(0, (0, common_1.Param)('claimNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "findByClaimNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Claim not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Claim not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_claim_dto_1.UpdateClaimDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/process-ai'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger AI analysis for claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI analysis triggered' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "processWithAI", null);
__decorate([
    (0, common_1.Post)(':id/process-payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Process payment for approved claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Claim not approved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update claim status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Claim not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "remove", null);
exports.ClaimsController = ClaimsController = __decorate([
    (0, swagger_1.ApiTags)('claims'),
    (0, common_1.Controller)('claims'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [claims_service_1.ClaimsService])
], ClaimsController);
//# sourceMappingURL=claims.controller.js.map