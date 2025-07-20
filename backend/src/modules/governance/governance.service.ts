import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { Vote, VoteChoice } from './entities/vote.entity';
import { ContractService } from '../blockchain/contract.service';

@Injectable()
export class GovernanceService {
  private readonly logger = new Logger(GovernanceService.name);

  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly contractService: ContractService,
  ) {}

  async getProposals() {
    try {
      // Get proposals from blockchain
      const blockchainProposals = await this.contractService.getGovernanceProposals();
      
      return {
        proposals: blockchainProposals.proposals || [],
        total: blockchainProposals.totalProposals || 0,
        contractAddress: blockchainProposals.contractAddress,
        message: 'Governance proposals retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Error fetching governance proposals: ${error.message}`);
      return {
        proposals: [],
        total: 0,
        error: error.message,
      };
    }
  }

  async createClaimVotingProposal(proposalData: any) {
    try {
      this.logger.log(`Creating claim voting proposal for claim: ${proposalData.claimId}`);
      
      // Create proposal on blockchain
      const blockchainResult = await this.contractService.createGovernanceProposal({
        title: proposalData.title,
        description: proposalData.description,
        votingPeriod: proposalData.votingPeriod,
        proposalType: 'claim_review',
        claimData: proposalData.claimData,
      });
      
      // Save proposal to database
      const proposal = this.proposalRepository.create({
        title: proposalData.title,
        description: proposalData.description,
        proposerId: proposalData.claimData.userId || 'system',
        status: ProposalStatus.ACTIVE,
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
    } catch (error) {
      this.logger.error(`Failed to create claim voting proposal: ${error.message}`);
      throw error;
    }
  }

  async voteOnProposal(proposalId: string, voteData: any) {
    try {
      this.logger.log(`Voting on proposal: ${proposalId} by ${voteData.voter}`);
      
      const proposal = await this.proposalRepository.findOne({ where: { id: proposalId } });
      if (!proposal) {
        throw new Error('Proposal not found');
      }

      // Check if voting period is still active
      if (new Date() > proposal.endTime) {
        throw new Error('Voting period has ended');
      }

      // Check if user has already voted
      const existingVote = await this.voteRepository.findOne({
        where: { proposalId, userId: voteData.voter }
      });
      if (existingVote) {
        throw new Error('User has already voted on this proposal');
      }

      // Get user's voting power (this would typically come from token balance)
      const votingPower = '1000000000000000000000'; // 1000 tokens (mock value)

      // Create vote record
      const vote = this.voteRepository.create({
        userId: voteData.voter,
        proposalId,
        choice: voteData.support ? VoteChoice.FOR : VoteChoice.AGAINST,
        reasoning: voteData.reason || '',
        votingPower,
      });

      await this.voteRepository.save(vote);

      // Update proposal vote counts
      if (voteData.support) {
        proposal.votesFor = (parseFloat(proposal.votesFor) + parseFloat(votingPower)).toString();
      } else {
        proposal.votesAgainst = (parseFloat(proposal.votesAgainst) + parseFloat(votingPower)).toString();
      }
      proposal.totalVotingPower = (parseFloat(proposal.totalVotingPower) + parseFloat(votingPower)).toString();

      await this.proposalRepository.save(proposal);

      // Submit vote to blockchain
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
    } catch (error) {
      this.logger.error(`Failed to vote on proposal: ${error.message}`);
      throw error;
    }
  }

  async processVotingResults(proposalId: string) {
    try {
      this.logger.log(`Processing voting results for proposal: ${proposalId}`);
      
      const proposal = await this.proposalRepository.findOne({ where: { id: proposalId } });
      if (!proposal) {
        throw new Error('Proposal not found');
      }

      // Check if voting period has ended
      if (new Date() < proposal.endTime) {
        throw new Error('Voting period has not ended yet');
      }

      // Calculate voting results
      const votesFor = parseFloat(proposal.votesFor);
      const votesAgainst = parseFloat(proposal.votesAgainst);
      const totalVotes = votesFor + votesAgainst;

      if (totalVotes === 0) {
        // No votes cast, extend voting period
        proposal.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend by 1 day
        await this.proposalRepository.save(proposal);
        return {
          success: false,
          message: 'No votes cast. Voting period extended by 1 day.',
          proposal,
        };
      }

      const approvalPercentage = (votesFor / totalVotes) * 100;
      const isApproved = approvalPercentage >= 60; // 60% threshold

      // Update proposal status
      proposal.status = isApproved ? ProposalStatus.PASSED : ProposalStatus.REJECTED;
      await this.proposalRepository.save(proposal);

      // If this is a claim review proposal, process the claim
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
    } catch (error) {
      this.logger.error(`Failed to process voting results: ${error.message}`);
      throw error;
    }
  }

  private async processClaimDecision(claimId: string, isApproved: boolean, proposal: any) {
    try {
      this.logger.log(`Processing claim decision for claim: ${claimId}, approved: ${isApproved}`);
      
      // Update claim status in database
      // This would typically update the claim entity status
      
      // Execute the decision on blockchain
      const result = await this.contractService.executeClaimDecision(claimId, isApproved);
      
      return {
        success: true,
        claimId,
        isApproved,
        blockchainResult: result,
        message: `Claim ${isApproved ? 'approved' : 'rejected'} successfully`,
      };
    } catch (error) {
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
    } catch (error) {
      this.logger.error(`Governance health check failed: ${error.message}`);
      return {
        status: 'unhealthy',
        service: 'governance',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
} 