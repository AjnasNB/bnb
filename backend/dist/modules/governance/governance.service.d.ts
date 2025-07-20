import { Repository } from 'typeorm';
import { Proposal } from './entities/proposal.entity';
import { Vote } from './entities/vote.entity';
import { ContractService } from '../blockchain/contract.service';
export declare class GovernanceService {
    private readonly proposalRepository;
    private readonly voteRepository;
    private readonly contractService;
    private readonly logger;
    constructor(proposalRepository: Repository<Proposal>, voteRepository: Repository<Vote>, contractService: ContractService);
    getProposals(): Promise<{
        proposals: any[];
        total: number;
        contractAddress: string;
        message: string;
        error?: undefined;
    } | {
        proposals: any[];
        total: number;
        error: any;
        contractAddress?: undefined;
        message?: undefined;
    }>;
    createClaimVotingProposal(proposalData: any): Promise<{
        success: boolean;
        proposal: Proposal;
        blockchainResult: {
            success: boolean;
            message: string;
            proposalData: any;
            transaction: {
                to: string;
                data: string;
                estimatedGas: string;
                value: string;
            };
            contractAddress: string;
            note: string;
        };
        message: string;
    }>;
    voteOnProposal(proposalId: string, voteData: any): Promise<{
        success: boolean;
        vote: Vote;
        proposal: Proposal;
        blockchainResult: {
            success: boolean;
            message: string;
            voteData: any;
            transaction: {
                to: string;
                data: string;
                estimatedGas: string;
                value: string;
            };
            contractAddress: string;
            note: string;
        };
        message: string;
    }>;
    processVotingResults(proposalId: string): Promise<{
        success: boolean;
        message: string;
        proposal: Proposal;
        votingResults?: undefined;
    } | {
        success: boolean;
        proposal: Proposal;
        votingResults: {
            votesFor: number;
            votesAgainst: number;
            totalVotes: number;
            approvalPercentage: number;
            isApproved: boolean;
        };
        message: string;
    }>;
    private processClaimDecision;
    healthCheck(): Promise<{
        status: string;
        service: string;
        proposalsCount: number;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        service: string;
        error: any;
        timestamp: string;
        proposalsCount?: undefined;
    }>;
}
