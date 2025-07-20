import { GovernanceService } from './governance.service';
export declare class GovernanceController {
    private readonly governanceService;
    constructor(governanceService: GovernanceService);
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
    voteOnProposal(proposalId: string, voteData: {
        voter: string;
        support: boolean;
        reason?: string;
    }): Promise<{
        success: boolean;
        vote: import("./entities/vote.entity").Vote;
        proposal: import("./entities/proposal.entity").Proposal;
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
        proposal: import("./entities/proposal.entity").Proposal;
        votingResults?: undefined;
    } | {
        success: boolean;
        proposal: import("./entities/proposal.entity").Proposal;
        votingResults: {
            votesFor: number;
            votesAgainst: number;
            totalVotes: number;
            approvalPercentage: number;
            isApproved: boolean;
        };
        message: string;
    }>;
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
