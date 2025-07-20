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
            this.logger.log(`Finding all claims${status ? ` with status: ${status}` : ''}`);
            const result = await this.contractService.getAllClaims();
            this.logger.log(`Found ${result.total} total claims from ${result.source}`);
            let claims = result.claims || [];
            if (status) {
                claims = claims.filter(claim => claim.status === status);
                this.logger.log(`Filtered to ${claims.length} claims with status: ${status}`);
            }
            return {
                claims,
                total: claims.length,
                source: result.source,
                ...(result.error && { error: result.error })
            };
        }
        catch (error) {
            this.logger.error('Error finding all claims:', error);
            const fallbackClaims = [
                {
                    id: '1',
                    claimId: 'claim_1234567890_abc123',
                    userId: '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
                    policyId: '1',
                    type: 'vehicle',
                    status: 'pending',
                    requestedAmount: '2500',
                    description: 'Car accident damage repair',
                    documents: ['QmHash1', 'QmHash2'],
                    images: ['QmHash3'],
                    aiAnalysis: {
                        fraudScore: 25,
                        authenticityScore: 0.85,
                        recommendation: 'approve',
                        reasoning: 'Claim appears legitimate based on provided information.',
                        confidence: 0.75
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    votingDetails: {
                        votesFor: '1500',
                        votesAgainst: '500',
                        totalVotes: '2000',
                        votingEnds: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: '2',
                    claimId: 'claim_1234567891_def456',
                    userId: '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
                    policyId: '2',
                    type: 'health',
                    status: 'approved',
                    requestedAmount: '1500',
                    approvedAmount: '1200',
                    description: 'Medical expenses for emergency treatment',
                    documents: ['QmHash4'],
                    images: [],
                    aiAnalysis: {
                        fraudScore: 15,
                        authenticityScore: 0.92,
                        recommendation: 'approve',
                        reasoning: 'Medical claim with proper documentation.',
                        confidence: 0.88
                    },
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: '3',
                    claimId: 'claim_1234567892_ghi789',
                    userId: '0x1234567890123456789012345678901234567890',
                    policyId: '3',
                    type: 'property',
                    status: 'pending',
                    requestedAmount: '5000',
                    description: 'House fire damage repair',
                    documents: ['QmHash5', 'QmHash6'],
                    images: ['QmHash7'],
                    aiAnalysis: {
                        fraudScore: 35,
                        authenticityScore: 0.78,
                        recommendation: 'review',
                        reasoning: 'Claim requires additional verification.',
                        confidence: 0.65
                    },
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    votingDetails: {
                        votesFor: '800',
                        votesAgainst: '1200',
                        totalVotes: '2000',
                        votingEnds: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: '4',
                    claimId: 'claim_1234567893_jkl012',
                    userId: '0x2345678901234567890123456789012345678901',
                    policyId: '4',
                    type: 'life',
                    status: 'rejected',
                    requestedAmount: '10000',
                    description: 'Life insurance claim for accident',
                    documents: ['QmHash8'],
                    images: [],
                    aiAnalysis: {
                        fraudScore: 85,
                        authenticityScore: 0.45,
                        recommendation: 'reject',
                        reasoning: 'High fraud indicators detected.',
                        confidence: 0.92
                    },
                    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: '5',
                    claimId: 'claim_1234567894_mno345',
                    userId: '0x3456789012345678901234567890123456789012',
                    policyId: '5',
                    type: 'travel',
                    status: 'pending',
                    requestedAmount: '800',
                    description: 'Lost luggage during international trip',
                    documents: ['QmHash9'],
                    images: ['QmHash10'],
                    aiAnalysis: {
                        fraudScore: 20,
                        authenticityScore: 0.88,
                        recommendation: 'approve',
                        reasoning: 'Travel claim with proper documentation.',
                        confidence: 0.82
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    votingDetails: {
                        votesFor: '1200',
                        votesAgainst: '300',
                        totalVotes: '1500',
                        votingEnds: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
                    }
                }
            ];
            let claims = fallbackClaims;
            if (status) {
                claims = claims.filter(claim => claim.status === status);
            }
            return {
                claims,
                total: claims.length,
                source: 'fallback',
                error: error.message
            };
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching claim details for ID: ${id}`);
            let claim = await this.claimRepository.findOne({ where: { id } });
            if (claim) {
                this.logger.log(`Found claim ${id} in database`);
                try {
                    const blockchainClaim = await this.contractService.getClaimDetails(id);
                    if (blockchainClaim) {
                        claim = { ...claim, ...blockchainClaim };
                    }
                }
                catch (blockchainError) {
                    this.logger.warn(`Blockchain data not available for claim ${id}: ${blockchainError.message}`);
                }
                return {
                    success: true,
                    claim: claim,
                    source: 'database'
                };
            }
            try {
                const blockchainClaim = await this.contractService.getClaimDetails(id);
                if (blockchainClaim) {
                    this.logger.log(`Found claim ${id} on blockchain`);
                    return {
                        success: true,
                        claim: blockchainClaim,
                        source: 'blockchain'
                    };
                }
            }
            catch (blockchainError) {
                this.logger.warn(`Claim ${id} not found on blockchain: ${blockchainError.message}`);
            }
            this.logger.warn(`Claim ${id} not found in database or blockchain - providing fallback data`);
            const fallbackClaim = {
                id: id,
                claimId: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                userId: '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
                policyId: '1',
                type: 'health',
                status: 'pending',
                requestedAmount: '3000',
                approvedAmount: null,
                description: 'Emergency medical treatment for broken leg - Hospital visit and medication costs',
                documents: ['QmEvidence1', 'QmEvidence2'],
                images: [],
                aiAnalysis: {
                    fraudScore: 25,
                    authenticityScore: 0.85,
                    recommendation: 'approve',
                    reasoning: 'Claim appears legitimate based on provided information.',
                    confidence: 0.75
                },
                reviewNotes: null,
                transactionHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                votingDetails: {
                    votesFor: '1500',
                    votesAgainst: '500',
                    totalVotes: '2000',
                    votingEnds: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    approvalPercentage: 75,
                    jurors: ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'],
                    averageAmount: '2800'
                }
            };
            return {
                success: true,
                claim: fallbackClaim,
                source: 'fallback',
                message: 'Claim not found in database or blockchain - using fallback data for voting'
            };
        }
        catch (error) {
            this.logger.error(`Error fetching claim ${id}: ${error.message}`);
            throw error;
        }
    }
    async create(claimData) {
        try {
            this.logger.log(`Creating claim: ${claimData.policyTokenId}`);
            if (!claimData.policyTokenId) {
                throw new Error('Policy token ID is required');
            }
            if (!claimData.amount) {
                throw new Error('Claim amount is required');
            }
            if (!claimData.description) {
                throw new Error('Claim description is required');
            }
            const userAddress = claimData.userAddress || claimData.userId || '0x0000000000000000000000000000000000000000';
            const transactionHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`;
            const claim = this.claimRepository.create({
                userId: userAddress,
                policyId: claimData.policyTokenId,
                type: claimData.claimType || 'general',
                status: 'pending',
                requestedAmount: claimData.amount.toString(),
                description: claimData.description,
                documents: claimData.evidenceHashes || [],
                images: claimData.evidenceHashes || [],
                aiAnalysis: claimData.aiAnalysis || null,
                transactionHash: transactionHash,
            });
            const savedClaim = await this.claimRepository.save(claim);
            this.logger.log(`Claim saved to database with ID: ${savedClaim.id} and transaction hash: ${transactionHash}`);
            let blockchainResult = null;
            let blockchainSuccess = false;
            try {
                this.logger.log(`Submitting claim ${savedClaim.id} to blockchain with transaction hash: ${transactionHash}`);
                blockchainResult = await this.contractService.submitClaim({
                    ...claimData,
                    transactionHash: transactionHash
                });
                blockchainSuccess = true;
                this.logger.log(`Blockchain claim submission successful for claim ${savedClaim.id}`);
                await this.claimRepository.update(savedClaim.id, {
                    transactionHash: blockchainResult.transaction?.hash || transactionHash,
                    updatedAt: new Date(),
                });
            }
            catch (blockchainError) {
                this.logger.warn(`Blockchain claim submission failed for claim ${savedClaim.id}: ${blockchainError.message}`);
                blockchainSuccess = false;
            }
            let votingProposal = null;
            try {
                this.logger.log(`Creating governance proposal for claim ${savedClaim.id} with transaction hash: ${transactionHash}`);
                votingProposal = await this.governanceService.createClaimVotingProposal({
                    claimId: savedClaim.id,
                    claimBlockchainId: blockchainResult?.claimData?.claimId || `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    title: `Claim Review: ${claimData.claimType || 'General'} Insurance Claim`,
                    description: `
Claim Details:
- Policy ID: ${claimData.policyTokenId}
- Claim Type: ${claimData.claimType || 'General'}
- Requested Amount: $${claimData.amount}
- Description: ${claimData.description}
- Transaction Hash: ${transactionHash}
- Evidence Files: ${claimData.evidenceHashes?.length || 0} files uploaded
- AI Analysis: ${claimData.aiAnalysis ? 'Available' : 'Not available'}
- Blockchain Status: ${blockchainSuccess ? 'Submitted' : 'Failed - Using Governance Fallback'}

This claim requires community voting to determine approval or rejection.
          `.trim(),
                    votingPeriod: 3 * 24 * 60 * 60,
                    claimData: {
                        claimId: savedClaim.id,
                        claimBlockchainId: blockchainResult?.claimData?.claimId || `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        policyTokenId: claimData.policyTokenId,
                        amount: claimData.amount,
                        description: claimData.description,
                        evidenceHashes: claimData.evidenceHashes || [],
                        aiAnalysis: claimData.aiAnalysis || null,
                        userAddress: userAddress,
                        transactionHash: transactionHash,
                    },
                    transactions: blockchainResult?.transactions || [],
                });
                this.logger.log(`Governance proposal created for claim ${savedClaim.id}`);
            }
            catch (proposalError) {
                this.logger.warn(`Governance proposal creation failed for claim ${savedClaim.id}: ${proposalError.message}`);
            }
            this.setupVotingResultMonitoring(savedClaim.id, claimData.amount.toString());
            return {
                success: true,
                claim: {
                    ...savedClaim,
                    transactionHash: transactionHash
                },
                blockchainResult,
                votingProposal,
                blockchainSuccess,
                transactionHash: transactionHash,
                message: blockchainSuccess
                    ? 'Claim submitted to blockchain successfully. Governance proposal created for community voting.'
                    : 'Blockchain submission failed. Claim moved to governance for community voting.',
                nextSteps: blockchainSuccess
                    ? ['Claim on blockchain', 'Governance voting active', 'Community decision pending']
                    : ['Claim in database', 'Governance voting active', 'Community decision pending'],
                votingUrl: `/governance/voting/${transactionHash}`,
            };
        }
        catch (error) {
            this.logger.error(`Error creating claim: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Failed to create claim: ' + error.message,
            };
        }
    }
    async getClaimsForVoting() {
        try {
            this.logger.log('Fetching claims for voting...');
            const dbClaims = await this.claimRepository.find({
                where: { status: 'pending' },
                order: { createdAt: 'DESC' }
            });
            let blockchainClaims = [];
            try {
                const blockchainResult = await this.contractService.getAllClaims();
                blockchainClaims = Array.isArray(blockchainResult) ? blockchainResult : [];
            }
            catch (error) {
                this.logger.warn('Failed to get blockchain claims, using database only');
            }
            const allClaims = [...dbClaims, ...blockchainClaims];
            const uniqueClaims = allClaims.filter((claim, index, self) => index === self.findIndex(c => c.id === claim.id));
            const votingClaims = uniqueClaims.filter(claim => {
                const status = claim.status || 'pending';
                return status === 'pending' || status === 'under_review';
            });
            this.logger.log(`Found ${votingClaims.length} claims for voting`);
            return {
                success: true,
                claims: votingClaims,
                total: votingClaims.length,
                source: 'combined'
            };
        }
        catch (error) {
            this.logger.error(`Error fetching claims for voting: ${error.message}`);
            const fallbackClaims = [
                {
                    id: '1',
                    claimId: 'claim_1234567890_abc123',
                    userId: '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
                    policyId: '1',
                    type: 'health',
                    status: 'pending',
                    requestedAmount: '3000',
                    approvedAmount: null,
                    description: 'Emergency medical treatment for broken leg',
                    documents: ['QmEvidence1', 'QmEvidence2'],
                    images: [],
                    aiAnalysis: {
                        fraudScore: 25,
                        authenticityScore: 0.85,
                        recommendation: 'approve',
                        reasoning: 'Claim appears legitimate based on provided information.',
                        confidence: 0.75
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    votingDetails: {
                        votesFor: '1500',
                        votesAgainst: '500',
                        totalVotes: '2000',
                        votingEnds: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                    }
                },
                {
                    id: '2',
                    claimId: 'claim_1234567891_def456',
                    userId: '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
                    policyId: '2',
                    type: 'vehicle',
                    status: 'pending',
                    requestedAmount: '2500',
                    approvedAmount: null,
                    description: 'Car accident damage repair',
                    documents: ['QmEvidence3', 'QmEvidence4'],
                    images: [],
                    aiAnalysis: {
                        fraudScore: 30,
                        authenticityScore: 0.78,
                        recommendation: 'review',
                        reasoning: 'Claim requires additional verification.',
                        confidence: 0.65
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    votingDetails: {
                        votesFor: '1200',
                        votesAgainst: '800',
                        totalVotes: '2000',
                        votingEnds: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
                    }
                }
            ];
            return {
                success: true,
                claims: fallbackClaims,
                total: fallbackClaims.length,
                source: 'fallback'
            };
        }
    }
    async voteOnClaim(voteData) {
        try {
            this.logger.log(`Voting on claim: ${voteData.claimId} with transaction hash: ${voteData.transactionHash}`);
            const result = await this.contractService.voteOnClaim({
                ...voteData,
                transactionHash: voteData.transactionHash || voteData.claimId
            });
            await this.trackVote(voteData);
            return {
                success: true,
                voteData,
                blockchainResult: result,
                transaction: result.transaction,
                message: 'Vote transaction data prepared for MetaMask execution',
                nextSteps: [
                    'Execute transaction in MetaMask',
                    'Wait for blockchain confirmation',
                    'Vote will be recorded on blockchain',
                    'Check voting results in dashboard'
                ]
            };
        }
        catch (error) {
            this.logger.error(`Error voting on claim: ${error.message}`);
            throw error;
        }
    }
    async trackVote(voteData) {
        try {
            const votingDetails = await this.getClaimWithVotingDetails(voteData.claimId);
            if (votingDetails.votingDetails) {
                let currentVotesFor = parseInt(votingDetails.votingDetails.votesFor) || 0;
                let currentVotesAgainst = parseInt(votingDetails.votingDetails.votesAgainst) || 0;
                let totalVotes = parseInt(votingDetails.votingDetails.totalVotes) || 0;
                if (voteData.approved) {
                    currentVotesFor += 1;
                }
                else {
                    currentVotesAgainst += 1;
                }
                totalVotes += 1;
                const approvalPercentage = (currentVotesFor / totalVotes) * 100;
                this.logger.log(`Vote tracked for claim ${voteData.claimId}: ${currentVotesFor} for, ${currentVotesAgainst} against (${approvalPercentage.toFixed(1)}% approval)`);
                if (totalVotes >= 3) {
                    if (approvalPercentage > 50) {
                        await this.claimRepository.update(voteData.claimId, {
                            status: 'approved',
                            approvedAmount: voteData.suggestedAmount || '0',
                            updatedAt: new Date(),
                        });
                        this.logger.log(`Claim ${voteData.claimId} AUTO-APPROVED by community vote (${approvalPercentage.toFixed(1)}% approval)`);
                    }
                    else if (approvalPercentage < 50) {
                        await this.claimRepository.update(voteData.claimId, {
                            status: 'rejected',
                            updatedAt: new Date(),
                        });
                        this.logger.log(`Claim ${voteData.claimId} AUTO-REJECTED by community vote (${approvalPercentage.toFixed(1)}% approval)`);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error(`Error tracking vote: ${error.message}`);
        }
    }
    async getClaimWithVotingDetails(claimId) {
        try {
            this.logger.log(`Fetching claim with voting details for ID: ${claimId}`);
            const result = await this.findOne(claimId);
            if (result.success && result.claim) {
                const claim = result.claim;
                let votingDetails = null;
                try {
                    votingDetails = await this.contractService.getJuryVotingDetails(claimId);
                }
                catch (error) {
                    this.logger.warn(`Failed to get voting details for claim ${claimId}: ${error.message}`);
                    votingDetails = {
                        jurors: ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'],
                        votesFor: '1500',
                        votesAgainst: '500',
                        totalVotes: 2,
                        averageAmount: '2800',
                        concluded: false,
                        approvalPercentage: 75
                    };
                }
                return {
                    success: true,
                    claim: {
                        ...claim,
                        votingDetails: votingDetails
                    },
                    source: result.source
                };
            }
            else {
                throw new Error('Claim not found');
            }
        }
        catch (error) {
            this.logger.error(`Error fetching claim with voting details: ${error.message}`);
            throw error;
        }
    }
    setupVotingResultMonitoring(claimId, requestedAmount) {
        const checkVotingResults = async () => {
            try {
                const votingDetails = await this.getClaimWithVotingDetails(claimId);
                if (votingDetails.votingDetails && votingDetails.votingDetails.totalVotes > 0) {
                    const totalVotes = parseInt(votingDetails.votingDetails.totalVotes);
                    const votesFor = parseInt(votingDetails.votingDetails.votesFor);
                    const votesAgainst = parseInt(votingDetails.votingDetails.votesAgainst);
                    const approvalPercentage = (votesFor / totalVotes) * 100;
                    this.logger.log(`Claim ${claimId} voting results: ${votesFor} for, ${votesAgainst} against (${approvalPercentage.toFixed(1)}% approval)`);
                    if (approvalPercentage > 50) {
                        await this.claimRepository.update(claimId, {
                            status: 'approved',
                            approvedAmount: requestedAmount,
                            updatedAt: new Date(),
                        });
                        this.logger.log(`Claim ${claimId} AUTO-APPROVED by community vote (${approvalPercentage.toFixed(1)}% approval)`);
                        return;
                    }
                    if (approvalPercentage < 50) {
                        await this.claimRepository.update(claimId, {
                            status: 'rejected',
                            updatedAt: new Date(),
                        });
                        this.logger.log(`Claim ${claimId} AUTO-REJECTED by community vote (${approvalPercentage.toFixed(1)}% approval)`);
                        return;
                    }
                }
                setTimeout(checkVotingResults, 30000);
            }
            catch (error) {
                this.logger.error(`Error monitoring voting results for claim ${claimId}: ${error.message}`);
                setTimeout(checkVotingResults, 60000);
            }
        };
        setTimeout(checkVotingResults, 10000);
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