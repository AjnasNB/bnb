import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';
import { ContractService } from '../blockchain/contract.service';
import { GovernanceService } from '../governance/governance.service';

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    private readonly contractService: ContractService,
    private readonly governanceService: GovernanceService,
  ) {}

  async findAll(status?: string) {
    try {
      // Get claims from blockchain
      const blockchainClaims = await this.contractService.getAllClaims();
      
      // Filter by status if provided
      let filteredClaims = blockchainClaims;
      if (status) {
        filteredClaims = blockchainClaims.filter(claim => 
          claim.status.toLowerCase() === status.toLowerCase()
        );
      }

      return {
        claims: filteredClaims,
        total: filteredClaims.length,
        status: status || 'all',
      };
    } catch (error) {
      this.logger.error(`Error fetching claims: ${error.message}`);
      return {
        claims: [],
        total: 0,
        status: status || 'all',
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      // Get claim from blockchain
      const claim = await this.contractService.getClaimDetails(id);
      return claim;
    } catch (error) {
      this.logger.error(`Error fetching claim ${id}: ${error.message}`);
      throw error;
    }
  }

  async create(claimData: any) {
    try {
      this.logger.log(`Creating claim: ${claimData.policyTokenId}`);
      
      // Submit claim to blockchain
      const result = await this.contractService.submitClaim(claimData);
      
      // Save to database for tracking
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
        transactionHash: null, // Will be updated when transaction is executed
      });

      const savedClaim = await this.claimRepository.save(claim);
      
      // Create voting proposal for the claim
      const votingProposal = await this.governanceService.createClaimVotingProposal({
        claimId: savedClaim.id,
        title: `Claim Review: ${claimData.claimType || 'General'} Claim`,
        description: `Review claim for policy ${claimData.policyTokenId}. Amount: ${claimData.amount}. Description: ${claimData.description}`,
        votingPeriod: 3 * 24 * 60 * 60, // 3 days in seconds
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
    } catch (error) {
      this.logger.error(`Error creating claim: ${error.message}`);
      throw error;
    }
  }

  async getClaimsForVoting() {
    try {
      // Get all pending claims that need community voting
      const claims = await this.contractService.getAllClaims();
      const votingClaims = claims.filter(claim => 
        claim.status === 'pending' || claim.status === 'under_review'
      );

      return {
        claims: votingClaims,
        total: votingClaims.length,
        message: 'Claims ready for community voting',
      };
    } catch (error) {
      this.logger.error(`Error fetching claims for voting: ${error.message}`);
      return {
        claims: [],
        total: 0,
        error: error.message,
      };
    }
  }

  async voteOnClaim(voteData: any) {
    try {
      this.logger.log(`Voting on claim: ${voteData.claimId}`);
      
      // Submit vote to blockchain
      const result = await this.contractService.voteOnClaim(voteData);
      
      return {
        success: true,
        voteData,
        blockchainResult: result,
        message: 'Vote submitted successfully',
      };
    } catch (error) {
      this.logger.error(`Error voting on claim: ${error.message}`);
      throw error;
    }
  }

  async getClaimWithVotingDetails(claimId: string) {
    try {
      // Get claim details
      const claim = await this.contractService.getClaimDetails(claimId);
      
      // Get voting details if claim is under review
      let votingDetails = null;
      if (claim.status === 'under_review') {
        votingDetails = await this.contractService.getJuryVotingDetails(claimId);
      }

      return {
        claim,
        votingDetails,
      };
    } catch (error) {
      this.logger.error(`Error fetching claim with voting details: ${error.message}`);
      throw error;
    }
  }
} 