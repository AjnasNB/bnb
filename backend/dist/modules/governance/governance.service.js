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
var GovernanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proposal_entity_1 = require("./entities/proposal.entity");
const vote_entity_1 = require("./entities/vote.entity");
const contract_service_1 = require("../blockchain/contract.service");
let GovernanceService = GovernanceService_1 = class GovernanceService {
    constructor(proposalRepository, voteRepository, contractService) {
        this.proposalRepository = proposalRepository;
        this.voteRepository = voteRepository;
        this.contractService = contractService;
        this.logger = new common_1.Logger(GovernanceService_1.name);
    }
    async getProposals() {
        try {
            const blockchainProposals = await this.contractService.getGovernanceProposals();
            return {
                proposals: blockchainProposals.proposals || [],
                total: blockchainProposals.totalProposals || 0,
                contractAddress: blockchainProposals.contractAddress,
                message: 'Governance proposals retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching governance proposals: ${error.message}`);
            return {
                proposals: [],
                total: 0,
                error: error.message,
            };
        }
    }
    async createClaimVotingProposal(proposalData) {
        try {
            this.logger.log(`Creating claim voting proposal for claim: ${proposalData.claimId}`);
            const blockchainResult = await this.contractService.createGovernanceProposal({
                title: proposalData.title,
                description: proposalData.description,
                votingPeriod: proposalData.votingPeriod,
                proposalType: 'claim_review',
                claimData: proposalData.claimData,
            });
            const proposal = this.proposalRepository.create({
                title: proposalData.title,
                description: proposalData.description,
                proposerId: proposalData.claimData.userId || 'system',
                status: proposal_entity_1.ProposalStatus.ACTIVE,
                startTime: new Date(),
                endTime: new Date(Date.now() + proposalData.votingPeriod * 1000),
                votesFor: '0',
                votesAgainst: '0',
                totalVotingPower: '0',
                metadata: {
                    proposalType: 'claim_review',
                    claimData: proposalData.claimData,
                    blockchainTransaction: blockchainResult.transaction,
                },
            });
            const savedProposal = await this.proposalRepository.save(proposal);
            return {
                success: true,
                proposal: savedProposal,
                blockchainResult,
                message: 'Claim voting proposal created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to create claim voting proposal: ${error.message}`);
            throw error;
        }
    }
    async voteOnProposal(proposalId, voteData) {
        try {
            this.logger.log(`Voting on proposal: ${proposalId} by ${voteData.voter}`);
            const proposal = await this.proposalRepository.findOne({ where: { id: proposalId } });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            if (new Date() > proposal.endTime) {
                throw new Error('Voting period has ended');
            }
            const existingVote = await this.voteRepository.findOne({
                where: { proposalId, userId: voteData.voter }
            });
            if (existingVote) {
                throw new Error('User has already voted on this proposal');
            }
            const votingPower = '1000000000000000000000';
            const vote = this.voteRepository.create({
                userId: voteData.voter,
                proposalId,
                choice: voteData.support ? vote_entity_1.VoteChoice.FOR : vote_entity_1.VoteChoice.AGAINST,
                reasoning: voteData.reason || '',
                votingPower,
            });
            await this.voteRepository.save(vote);
            if (voteData.support) {
                proposal.votesFor = (parseFloat(proposal.votesFor) + parseFloat(votingPower)).toString();
            }
            else {
                proposal.votesAgainst = (parseFloat(proposal.votesAgainst) + parseFloat(votingPower)).toString();
            }
            proposal.totalVotingPower = (parseFloat(proposal.totalVotingPower) + parseFloat(votingPower)).toString();
            await this.proposalRepository.save(proposal);
            const blockchainResult = await this.contractService.voteOnProposal({
                proposalId,
                voter: voteData.voter,
                support: voteData.support,
                reason: voteData.reason || '',
            });
            return {
                success: true,
                vote,
                proposal,
                blockchainResult,
                message: 'Vote submitted successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to vote on proposal: ${error.message}`);
            throw error;
        }
    }
    async processVotingResults(proposalId) {
        try {
            this.logger.log(`Processing voting results for proposal: ${proposalId}`);
            const proposal = await this.proposalRepository.findOne({ where: { id: proposalId } });
            if (!proposal) {
                throw new Error('Proposal not found');
            }
            if (new Date() < proposal.endTime) {
                throw new Error('Voting period has not ended yet');
            }
            const votesFor = parseFloat(proposal.votesFor);
            const votesAgainst = parseFloat(proposal.votesAgainst);
            const totalVotes = votesFor + votesAgainst;
            if (totalVotes === 0) {
                proposal.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await this.proposalRepository.save(proposal);
                return {
                    success: false,
                    message: 'No votes cast. Voting period extended by 1 day.',
                    proposal,
                };
            }
            const approvalPercentage = (votesFor / totalVotes) * 100;
            const isApproved = approvalPercentage >= 60;
            proposal.status = isApproved ? proposal_entity_1.ProposalStatus.PASSED : proposal_entity_1.ProposalStatus.REJECTED;
            await this.proposalRepository.save(proposal);
            if (proposal.metadata?.proposalType === 'claim_review') {
                const claimData = proposal.metadata.claimData;
                await this.processClaimDecision(claimData.claimId, isApproved, proposal);
            }
            return {
                success: true,
                proposal,
                votingResults: {
                    votesFor,
                    votesAgainst,
                    totalVotes,
                    approvalPercentage,
                    isApproved,
                },
                message: isApproved ? 'Proposal passed' : 'Proposal rejected',
            };
        }
        catch (error) {
            this.logger.error(`Failed to process voting results: ${error.message}`);
            throw error;
        }
    }
    async processClaimDecision(claimId, isApproved, proposal) {
        try {
            this.logger.log(`Processing claim decision for claim: ${claimId}, approved: ${isApproved}`);
            const result = await this.contractService.executeClaimDecision(claimId, isApproved);
            return {
                success: true,
                claimId,
                isApproved,
                blockchainResult: result,
                message: `Claim ${isApproved ? 'approved' : 'rejected'} successfully`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to process claim decision: ${error.message}`);
            throw error;
        }
    }
    async healthCheck() {
        try {
            const proposals = await this.getProposals();
            return {
                status: 'healthy',
                service: 'governance',
                proposalsCount: proposals.total,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Governance health check failed: ${error.message}`);
            return {
                status: 'unhealthy',
                service: 'governance',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = GovernanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proposal_entity_1.Proposal)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        contract_service_1.ContractService])
], GovernanceService);
//# sourceMappingURL=governance.service.js.map