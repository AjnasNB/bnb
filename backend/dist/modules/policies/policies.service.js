"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PoliciesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
let PoliciesService = PoliciesService_1 = class PoliciesService {
    constructor() {
        this.logger = new common_1.Logger(PoliciesService_1.name);
    }
    async findAll(pagination) {
        const mockPolicies = [
            {
                id: 'pol_1',
                userId: 'user_1',
                type: 'health',
                status: 'active',
                coverageAmount: '50000',
                premiumAmount: '150',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                nftTokenId: '1',
                createdAt: new Date().toISOString(),
            },
        ];
        const { page, limit } = pagination;
        return {
            policies: mockPolicies,
            total: mockPolicies.length,
            page,
            limit,
            totalPages: Math.ceil(mockPolicies.length / limit),
        };
    }
    async findOne(id) {
        return {
            id,
            userId: 'user_1',
            type: 'health',
            status: 'active',
            coverageAmount: '50000',
            premiumAmount: '150',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            nftTokenId: '1',
            terms: { deductible: '500', maxClaim: '10000' },
            metadata: { riskScore: 'low' },
            createdAt: new Date().toISOString(),
        };
    }
    async create(policyData) {
        this.logger.log(`Creating policy for user: ${policyData.userId}`);
        return {
            success: true,
            policy: { id: `pol_${Date.now()}`, ...policyData },
            message: 'Policy created successfully',
        };
    }
    async update(id, policyData) {
        return { success: true, id, message: 'Policy updated successfully' };
    }
    async remove(id) {
        return { success: true, id, message: 'Policy deleted successfully' };
    }
    async getAvailableTypes() {
        return {
            types: [
                { id: 'health', name: 'Health Insurance', basePremium: 150, description: 'Comprehensive health coverage' },
                { id: 'vehicle', name: 'Vehicle Insurance', basePremium: 200, description: 'Auto insurance coverage' },
                { id: 'travel', name: 'Travel Insurance', basePremium: 50, description: 'Travel protection' },
                { id: 'pet', name: 'Pet Insurance', basePremium: 75, description: 'Pet health coverage' },
            ],
        };
    }
    async getQuote(quoteData) {
        return {
            quote: {
                type: quoteData.type,
                coverageAmount: quoteData.coverageAmount,
                premiumAmount: (parseFloat(quoteData.coverageAmount) * 0.003).toString(),
                estimatedPayout: '30 seconds',
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            },
        };
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = PoliciesService_1 = __decorate([
    (0, common_1.Injectable)()
], PoliciesService);
//# sourceMappingURL=policies.service.js.map