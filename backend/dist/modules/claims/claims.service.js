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
var ClaimsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const claim_entity_1 = require("./entities/claim.entity");
const contract_service_1 = require("../blockchain/contract.service");
const governance_service_1 = require("../governance/governance.service");
let ClaimsService = ClaimsService_1 = class ClaimsService {
    constructor(claimRepository, contractService, governanceService) {
        this.claimRepository = claimRepository;
        this.contractService = contractService;
        this.governanceService = governanceService;
        this.logger = new common_1.Logger(ClaimsService_1.name);
    }
    async findAll(status) {
        try {
            const blockchainClaims = await this.contractService.getAllClaims();
            let filteredClaims = blockchainClaims;
            if (status) {
                filteredClaims = blockchainClaims.filter(claim => claim.status.toLowerCase() === status.toLowerCase());
            }
            return {
                claims: filteredClaims,
                total: filteredClaims.length,
                status: status || 'all',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching claims: ${error.message}`);
            return {
                claims: [],
                total: 0,
                status: status || 'all',
                error: error.message,
            };
        }
    }
    async findOne(id) {
        try {
            const claim = await this.contractService.getClaimDetails(id);
            return claim;
        }
        catch (error) {
            this.logger.error(`Error fetching claim ${id}: ${error.message}`);
            throw error;
        }
    }
    async create(claimData) {
        try {
            this.logger.log(`Creating claim: ${claimData.policyTokenId}`);
            const result = await this.contractService.submitClaim(claimData);
            const claim = this.claimRepository.create({
                userId: claimData.userId,
                policyId: claimData.policyTokenId,
                type: claimData.claimType || 'general',
                status: 'pending',
                requestedAmount: claimData.amount.toString(),
                description: claimData.description,
                documents: claimData.evidenceHashes || [],
                images: claimData.evidenceHashes || [],
                aiAnalysis: claimData.aiAnalysis || null,
                transactionHash: null,
            });
            const savedClaim = await this.claimRepository.save(claim);
            const votingProposal = await this.governanceService.createClaimVotingProposal({
                claimId: savedClaim.id,
                title: `Claim Review: ${claimData.claimType || 'General'} Claim`,
                description: `Review claim for policy ${claimData.policyTokenId}. Amount: ${claimData.amount}. Description: ${claimData.description}`,
                votingPeriod: 3 * 24 * 60 * 60,
                claimData: {
                    claimId: savedClaim.id,
                    policyTokenId: claimData.policyTokenId,
                    amount: claimData.amount,
                    description: claimData.description,
                    evidenceHashes: claimData.evidenceHashes || [],
                },
            });
            return {
                success: true,
                claim: savedClaim,
                blockchainResult: result,
                votingProposal,
                message: 'Claim submitted successfully and voting session created',
            };
        }
        catch (error) {
            this.logger.error(`Error creating claim: ${error.message}`);
            throw error;
        }
    }
    async getClaimsForVoting() {
        try {
            const claims = await this.contractService.getAllClaims();
            const votingClaims = claims.filter(claim => claim.status === 'pending' || claim.status === 'under_review');
            return {
                claims: votingClaims,
                total: votingClaims.length,
                message: 'Claims ready for community voting',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching claims for voting: ${error.message}`);
            return {
                claims: [],
                total: 0,
                error: error.message,
            };
        }
    }
    async voteOnClaim(voteData) {
        try {
            this.logger.log(`Voting on claim: ${voteData.claimId}`);
            const result = await this.contractService.voteOnClaim(voteData);
            return {
                success: true,
                voteData,
                blockchainResult: result,
                message: 'Vote submitted successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error voting on claim: ${error.message}`);
            throw error;
        }
    }
    async getClaimWithVotingDetails(claimId) {
        try {
            const claim = await this.contractService.getClaimDetails(claimId);
            let votingDetails = null;
            if (claim.status === 'under_review') {
                votingDetails = await this.contractService.getJuryVotingDetails(claimId);
            }
            return {
                claim,
                votingDetails,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching claim with voting details: ${error.message}`);
            throw error;
        }
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = ClaimsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(claim_entity_1.Claim)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        contract_service_1.ContractService,
        governance_service_1.GovernanceService])
], ClaimsService);
//# sourceMappingURL=claims.service.js.map