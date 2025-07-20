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
let PoliciesController = class PoliciesController {
    constructor(policiesService) {
        this.policiesService = policiesService;
    }
    async getTypes() {
        return {
            types: [
                {
                    id: 'health',
                    name: 'Health Insurance',
                    basePremium: 150,
                    description: 'Comprehensive health coverage for medical expenses',
                    minCoverage: 1000,
                    maxCoverage: 100000,
                    premiumRate: 0.03,
                    duration: 365
                },
                {
                    id: 'vehicle',
                    name: 'Vehicle Insurance',
                    basePremium: 200,
                    description: 'Auto insurance coverage for accidents and damage',
                    minCoverage: 5000,
                    maxCoverage: 500000,
                    premiumRate: 0.025,
                    duration: 365
                },
                {
                    id: 'travel',
                    name: 'Travel Insurance',
                    basePremium: 50,
                    description: 'Travel protection for trips and vacations',
                    minCoverage: 500,
                    maxCoverage: 50000,
                    premiumRate: 0.04,
                    duration: 30
                },
                {
                    id: 'pet',
                    name: 'Pet Insurance',
                    basePremium: 75,
                    description: 'Pet health coverage for veterinary expenses',
                    minCoverage: 1000,
                    maxCoverage: 25000,
                    premiumRate: 0.035,
                    duration: 365
                },
                {
                    id: 'home',
                    name: 'Home Insurance',
                    basePremium: 300,
                    description: 'Home and property protection',
                    minCoverage: 10000,
                    maxCoverage: 1000000,
                    premiumRate: 0.02,
                    duration: 365
                },
                {
                    id: 'life',
                    name: 'Life Insurance',
                    basePremium: 100,
                    description: 'Life insurance coverage',
                    minCoverage: 10000,
                    maxCoverage: 1000000,
                    premiumRate: 0.015,
                    duration: 365
                },
            ],
        };
    }
    async getAvailableTypes() {
        return this.policiesService.getAvailableTypes();
    }
    async findAll(page = 1, limit = 10) {
        return this.policiesService.findAll({ page, limit });
    }
    async findUserPolicies(userId) {
        return this.policiesService.findUserPolicies(userId);
    }
    async findOne(id) {
        return this.policiesService.findOne(id);
    }
    async create(policyData) {
        return this.policiesService.create(policyData);
    }
    async update(id, policyData) {
        return this.policiesService.update(id, policyData);
    }
    async remove(id) {
        return this.policiesService.remove(id);
    }
    async getQuote(quoteData) {
        return this.policiesService.getQuote(quoteData);
    }
};
exports.PoliciesController = PoliciesController;
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available policy types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getTypes", null);
__decorate([
    (0, common_1.Get)('types/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available policy types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getAvailableTypes", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all policies' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policies for specific user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findUserPolicies", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new policy' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update policy' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete policy' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('quote'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy quote' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoliciesController.prototype, "getQuote", null);
exports.PoliciesController = PoliciesController = __decorate([
    (0, swagger_1.ApiTags)('Policies'),
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService])
], PoliciesController);
//# sourceMappingURL=policies.controller.js.map