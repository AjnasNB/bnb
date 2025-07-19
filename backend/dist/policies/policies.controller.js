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
exports.PoliciesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const policies_service_1 = require("./policies.service");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const update_policy_dto_1 = require("./dto/update-policy.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PoliciesController = class PoliciesController {
    constructor(policiesService) {
        this.policiesService = policiesService;
    }
    create(createPolicyDto, req) {
        return this.policiesService.create(createPolicyDto, req.user.id);
    }
    findAll(userId) {
        return this.policiesService.findAll(userId);
    }
    findUserPolicies(req) {
        return this.policiesService.findUserPolicies(req.user.id);
    }
    findByTokenId(tokenId) {
        return this.policiesService.findByTokenId(tokenId);
    }
    findOne(id) {
        return this.policiesService.findOne(id);
    }
    update(id, updatePolicyDto) {
        return this.policiesService.update(id, updatePolicyDto);
    }
    transferPolicy(tokenId, toUserId, req) {
        return this.policiesService.transferPolicy(tokenId, req.user.id, toUserId);
    }
    remove(id) {
        return this.policiesService.remove(id);
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new insurance policy' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_policy_dto_1.CreatePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User policies retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findUserPolicies", null);
__decorate([
    (0, common_1.Get)('token/:tokenId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by token ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findByTokenId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_policy_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':tokenId/transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer policy to another user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy transferred successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Transfer not allowed' }),
    __param(0, (0, common_1.Param)('tokenId')),
    __param(1, (0, common_1.Body)('toUserId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "transferPolicy", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Policy not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PoliciesController.prototype, "remove", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('policies'),
    (0, common_1.Controller)('policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map