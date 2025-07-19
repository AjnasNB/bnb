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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const users_service_1 = require("../users/users.service");
const policies_service_1 = require("../policies/policies.service");
const claims_service_1 = require("../claims/claims.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../common/guards/admin.guard");
let AdminController = class AdminController {
    constructor(adminService, usersService, policiesService, claimsService) {
        this.adminService = adminService;
        this.usersService = usersService;
        this.policiesService = policiesService;
        this.claimsService = claimsService;
    }
    getDashboard() {
        return this.adminService.getDashboardStats();
    }
    getAnalytics(period = '30d') {
        return this.adminService.getAnalytics(period);
    }
    getRecentActivity(limit = 20) {
        return this.adminService.getRecentActivity(limit);
    }
    getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
    exportData(entityType, format = 'json') {
        return this.adminService.exportData(entityType, format);
    }
    getAllUsers() {
        return this.usersService.findAll();
    }
    verifyUser(id) {
        return this.usersService.update(id, { isVerified: true });
    }
    suspendUser(id) {
        return this.usersService.update(id, { isActive: false });
    }
    activateUser(id) {
        return this.usersService.update(id, { isActive: true });
    }
    updateRiskScore(id, riskScore) {
        return this.usersService.updateRiskScore(id, riskScore);
    }
    getAllPolicies() {
        return this.policiesService.findAll();
    }
    updatePolicyStatus(id, status) {
        return this.policiesService.updateStatus(id, status);
    }
    getAllClaims() {
        return this.claimsService.findAll();
    }
    getPendingClaims() {
        return this.claimsService.findAll();
    }
    reviewClaim(id, status, notes, adjustedAmount) {
        const updateData = { status };
        if (adjustedAmount !== undefined) {
            updateData.approvedAmount = adjustedAmount;
        }
        if (notes) {
            updateData['humanReview.notes'] = notes;
            updateData['humanReview.reviewDate'] = new Date();
        }
        return this.claimsService.update(id, updateData);
    }
    approveClaim(id, notes) {
        return this.claimsService.updateStatus(id, 'approved', notes);
    }
    rejectClaim(id, notes) {
        return this.claimsService.updateStatus(id, 'rejected', notes);
    }
    processClaim(id) {
        return this.claimsService.processPayment(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent platform activity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity retrieved' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health status retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('export/:entityType'),
    (0, swagger_1.ApiOperation)({ summary: 'Export platform data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "exportData", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (admin view)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User verified' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/suspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User suspended' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "suspendUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User activated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "activateUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/risk-score'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user risk score' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk score updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('riskScore')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRiskScore", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policies (admin view)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllPolicies", null);
__decorate([
    (0, common_1.Patch)('policies/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update policy status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy status updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePolicyStatus", null);
__decorate([
    (0, common_1.Get)('claims'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all claims (admin view)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claims retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllClaims", null);
__decorate([
    (0, common_1.Get)('claims/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending claims for review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending claims retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingClaims", null);
__decorate([
    (0, common_1.Patch)('claims/:id/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Review and update claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim reviewed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('notes')),
    __param(3, (0, common_1.Body)('adjustedAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reviewClaim", null);
__decorate([
    (0, common_1.Post)('claims/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveClaim", null);
__decorate([
    (0, common_1.Post)('claims/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectClaim", null);
__decorate([
    (0, common_1.Post)('claims/:id/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Process claim payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "processClaim", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        users_service_1.UsersService,
        policies_service_1.PoliciesService,
        claims_service_1.ClaimsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map