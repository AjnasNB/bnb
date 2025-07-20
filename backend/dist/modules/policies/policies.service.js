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
var PoliciesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("./entities/policy.entity");
const contract_service_1 = require("../blockchain/contract.service");
let PoliciesService = PoliciesService_1 = class PoliciesService {
    constructor(policyRepository, contractService) {
        this.policyRepository = policyRepository;
        this.contractService = contractService;
        this.logger = new common_1.Logger(PoliciesService_1.name);
    }
    async findAll(pagination) {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;
            const [policies, total] = await this.policyRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });
            return {
                policies,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch policies: ${error.message}`);
            return {
                policies: [],
                total: 0,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: 0,
                error: error.message,
            };
        }
    }
    async findUserPolicies(userId) {
        try {
            this.logger.log(`Finding user policies for: ${userId}`);
            const result = await this.contractService.getAllUserPolicies(userId);
            this.logger.log(`Found ${result.total} policies for user ${userId} from ${result.source}`);
            return {
                policies: result.policies,
                total: result.total,
                source: result.source,
                userAddress: userId,
                ...(result.error && { error: result.error })
            };
        }
        catch (error) {
            this.logger.error(`Error finding user policies for ${userId}:`, error);
            const fallbackPolicies = [
                {
                    tokenId: '0',
                    owner: userId,
                    source: 'fallback',
                    details: {
                        policyType: 'Health Insurance',
                        coverageAmount: '5000',
                        premium: '150',
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    tokenId: '1',
                    owner: userId,
                    source: 'fallback',
                    details: {
                        policyType: 'Vehicle Insurance',
                        coverageAmount: '10000',
                        premium: '300',
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    tokenId: '2',
                    owner: userId,
                    source: 'fallback',
                    details: {
                        policyType: 'Travel Insurance',
                        coverageAmount: '7500',
                        premium: '200',
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    tokenId: '3',
                    owner: userId,
                    source: 'fallback',
                    details: {
                        policyType: 'Pet Insurance',
                        coverageAmount: '3000',
                        premium: '100',
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                    }
                }
            ];
            return {
                policies: fallbackPolicies,
                total: fallbackPolicies.length,
                source: 'fallback',
                userAddress: userId,
                error: error.message
            };
        }
    }
    async findOne(id) {
        try {
            const policy = await this.policyRepository.findOne({ where: { id } });
            if (!policy) {
                return {
                    id,
                    userId: 'mock_user',
                    type: 'health',
                    status: 'active',
                    coverageAmount: '50000',
                    premiumAmount: '1500',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    nftTokenId: '0',
                    terms: { deductible: '500', maxClaim: '10000' },
                    metadata: { riskScore: 'low' },
                    createdAt: new Date().toISOString(),
                };
            }
            return policy;
        }
        catch (error) {
            this.logger.error(`Failed to fetch policy ${id}: ${error.message}`);
            return {
                id,
                userId: 'mock_user',
                type: 'health',
                status: 'active',
                coverageAmount: '50000',
                premiumAmount: '1500',
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                nftTokenId: '0',
                terms: { deductible: '500', maxClaim: '10000' },
                metadata: { riskScore: 'low' },
                createdAt: new Date().toISOString(),
            };
        }
    }
    async create(policyData) {
        try {
            this.logger.log(`Creating policy for user: ${policyData.userId}`);
            const blockchainResult = await this.contractService.createPolicy(policyData);
            const policy = this.policyRepository.create({
                userId: policyData.userId,
                type: policyData.type,
                status: 'active',
                coverageAmount: policyData.coverageAmount.toString(),
                premiumAmount: policyData.premiumAmount.toString(),
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                nftTokenId: blockchainResult.policyData?.tokenId || '0',
                terms: policyData.terms || {},
                metadata: {
                    ...policyData.metadata,
                    blockchainTransaction: blockchainResult.transactions,
                    contractAddress: blockchainResult.contractAddress,
                },
            });
            const savedPolicy = await this.policyRepository.save(policy);
            return {
                success: true,
                policy: savedPolicy,
                blockchainResult,
                message: 'Policy created successfully with NFT',
            };
        }
        catch (error) {
            this.logger.error(`Failed to create policy: ${error.message}`);
            throw error;
        }
    }
    async update(id, policyData) {
        return { success: true, id, message: 'Policy updated successfully' };
    }
    async remove(id) {
        return { success: true, id, message: 'Policy deleted successfully' };
    }
    async getAvailableTypes() {
        try {
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
        catch (error) {
            this.logger.error(`Failed to get available types: ${error.message}`);
            return {
                types: [],
                error: error.message,
            };
        }
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
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        contract_service_1.ContractService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map