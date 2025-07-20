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
            this.logger.log('Fetching governance proposals from database and blockchain');
            const dbProposals = await this.proposalRepository.find({
                order: { createdAt: 'DESC' }
            });
            let blockchainProposals = [];
            try {
                const blockchainResult = await this.contractService.getGovernanceProposals();
                blockchainProposals = blockchainResult.proposals || [];
                this.logger.log(`Found ${blockchainProposals.length} proposals from blockchain`);
            }
            catch (error) {
                this.logger.warn(`Failed to get blockchain proposals: ${error.message}`);
            }
            const allProposals = [...dbProposals];
            blockchainProposals.forEach(bcProposal => {
                const exists = dbProposals.find(dbProposal => dbProposal.id === bcProposal.id);
                if (!exists) {
                    allProposals.push({
                        id: bcProposal.id,
                        title: bcProposal.title,
                        description: bcProposal.description,
                        proposerId: 'blockchain',
                        status: bcProposal.status === 'active' ? proposal_entity_1.ProposalStatus.ACTIVE :
                            bcProposal.status === 'executed' ? proposal_entity_1.ProposalStatus.EXECUTED :
                                proposal_entity_1.ProposalStatus.REJECTED,
                        startTime: new Date(bcProposal.startTime),
                        endTime: new Date(bcProposal.endTime),
                        votesFor: bcProposal.votesFor || '0',
                        votesAgainst: bcProposal.votesAgainst || '0',
                        totalVotingPower: '0',
                        metadata: {
                            proposalType: 'blockchain_proposal',
                            blockchainData: bcProposal,
                            contractAddress: bcProposal.contractAddress,
                        },
                        createdAt: new Date(bcProposal.startTime),
                        updatedAt: new Date(),
                        votes: [],
                    });
                }
            });
            this.logger.log(`Total proposals found: ${allProposals.length} (${dbProposals.length} from DB, ${blockchainProposals.length} from blockchain)`);
            return {
                proposals: allProposals,
                total: allProposals.length,
                contractAddress: blockchainProposals[0]?.contractAddress,
                message: 'Governance proposals retrieved successfully from database and blockchain',
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
            const proposal = this.proposalRepository.create({
                title: proposalData.title,
                description: proposalData.description,
                proposerId: proposalData.claimData.userAddress || 'system',
                status: proposal_entity_1.ProposalStatus.ACTIVE,
                startTime: new Date(),
                endTime: new Date(Date.now() + proposalData.votingPeriod * 1000),
                votesFor: '0',
                votesAgainst: '0',
                totalVotingPower: '0',
                metadata: {
                    proposalType: 'claim_review',
                    claimId: proposalData.claimId,
                    claimData: proposalData.claimData,
                    blockchainTransaction: null,
                    votingThreshold: 50,
                    minimumVotes: 3,
                },
                votes: [],
            });
            const savedProposal = await this.proposalRepository.save(proposal);
            this.logger.log(`Claim voting proposal saved to database with ID: ${savedProposal.id}`);
            let blockchainResult = null;
            try {
                this.logger.log(`Creating mock blockchain proposal for claim ${proposalData.claimId}`);
                blockchainResult = await this.contractService.createGovernanceProposal({
                    title: proposalData.title,
                    description: proposalData.description,
                    votingPeriod: proposalData.votingPeriod,
                    proposalType: 'claim_review',
                    claimData: proposalData.claimData,
                });
                savedProposal.metadata.blockchainTransaction = {
                    ...blockchainResult.transaction,
                    hash: 'mock_proposal_tx_' + Date.now(),
                    mock: true
                };
                await this.proposalRepository.save(savedProposal);
                this.logger.log(`Mock blockchain proposal creation successful for claim ${proposalData.claimId}`);
            }
            catch (blockchainError) {
                this.logger.warn(`Mock blockchain proposal creation failed for claim ${proposalData.claimId}: ${blockchainError.message}`);
            }
            this.setupVotingResultProcessing(savedProposal.id, proposalData.claimId);
            return {
                success: true,
                proposal: savedProposal,
                blockchainResult,
                message: blockchainResult
                    ? 'Claim voting proposal created successfully on blockchain and database'
                    : 'Proposal saved to database. Blockchain integration pending.',
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
    setupVotingResultProcessing(proposalId, claimId) {
        const checkVotingResults = async () => {
            try {
                const proposal = await this.proposalRepository.findOne({ where: { id: proposalId } });
                if (!proposal) {
                    this.logger.warn(`Proposal ${proposalId} not found for voting result processing`);
                    return;
                }
                const votes = await this.voteRepository.find({ where: { proposalId } });
                if (votes.length >= proposal.metadata.minimumVotes) {
                    const votesFor = votes.filter(v => v.choice === vote_entity_1.VoteChoice.FOR).length;
                    const votesAgainst = votes.filter(v => v.choice === vote_entity_1.VoteChoice.AGAINST).length;
                    const totalVotes = votes.length;
                    const approvalPercentage = (votesFor / totalVotes) * 100;
                    this.logger.log(`Proposal ${proposalId} voting results: ${votesFor} for, ${votesAgainst} against (${approvalPercentage.toFixed(1)}% approval)`);
                    if (approvalPercentage >= proposal.metadata.votingThreshold) {
                        await this.processClaimDecision(claimId, true, proposal);
                        this.logger.log(`Claim ${claimId} AUTO-APPROVED by governance vote (${approvalPercentage.toFixed(1)}% approval)`);
                        return;
                    }
                    else if (approvalPercentage < proposal.metadata.votingThreshold) {
                        await this.processClaimDecision(claimId, false, proposal);
                        this.logger.log(`Claim ${claimId} AUTO-REJECTED by governance vote (${approvalPercentage.toFixed(1)}% approval)`);
                        return;
                    }
                }
                setTimeout(checkVotingResults, 30000);
            }
            catch (error) {
                this.logger.error(`Error processing voting results for proposal ${proposalId}: ${error.message}`);
                setTimeout(checkVotingResults, 60000);
            }
        };
        setTimeout(checkVotingResults, 10000);
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