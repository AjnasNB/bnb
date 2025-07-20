import { ClaimsService } from './claims.service';
export declare class ClaimsController {
    private readonly claimsService;
    constructor(claimsService: ClaimsService);
    findAll(status?: string): Promise<{
        error: any;
        claims: any;
        total: any;
        source: any;
    }>;
    getClaimsForVoting(): Promise<{
        success: boolean;
        claims: any[];
        total: number;
        source: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        claim: {
            votingDetails: {
                votesFor: string;
                votesAgainst: string;
                totalVotes: string;
                votingEnds: string;
            };
            id: string;
            userId: string;
            policyId: string;
            type: string;
            status: string;
            requestedAmount: string;
            approvedAmount: string;
            description: string;
            documents: string[];
            images: string[];
            aiAnalysis: any;
            reviewNotes: any;
            transactionHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } | {
        success: boolean;
        claim: {
            votingDetails: {
                votesFor: string;
                votesAgainst: string;
                totalVotes: string;
                votingEnds: string;
            };
            claimId: string;
            policyId: any;
            claimant: any;
            requestedAmount: string;
            approvedAmount: string;
            description: any;
            status: string;
            submittedAt: string;
            fraudScore: number;
            claimType: string;
            evidenceHashes: any;
            contractAddress: string;
            explorerUrl: string;
        };
    } | {
        success: boolean;
        claim: {
            id: string;
            claimId: string;
            policyTokenId: string;
            claimant: string;
            amount: string;
            description: string;
            status: string;
            submittedAt: string;
            evidenceHashes: string[];
            aiAnalysis: {
                fraudScore: number;
                authenticityScore: number;
                recommendation: string;
                reasoning: string;
                confidence: number;
            };
            votingDetails: {
                votesFor: string;
                votesAgainst: string;
                totalVotes: string;
                votingEnds: string;
            };
        };
    }>;
    getClaimWithVotingDetails(id: string): Promise<{
        success: boolean;
        claim: {
            votingDetails: any;
            id: string;
            claimId: string;
            policyTokenId: string;
            claimant: string;
            amount: string;
            description: string;
            status: string;
            submittedAt: string;
            evidenceHashes: string[];
            aiAnalysis: {
                fraudScore: number;
                authenticityScore: number;
                recommendation: string;
                reasoning: string;
                confidence: number;
            };
        } | {
            votingDetails: any;
            id: string;
            userId: string;
            policyId: string;
            type: string;
            status: string;
            requestedAmount: string;
            approvedAmount: string;
            description: string;
            documents: string[];
            images: string[];
            aiAnalysis: any;
            reviewNotes: any;
            transactionHash: string;
            createdAt: Date;
            updatedAt: Date;
        } | {
            votingDetails: any;
            claimId: string;
            policyId: any;
            claimant: any;
            requestedAmount: string;
            approvedAmount: string;
            description: any;
            status: string;
            submittedAt: string;
            fraudScore: number;
            claimType: string;
            evidenceHashes: any;
            contractAddress: string;
            explorerUrl: string;
        };
        source: any;
    }>;
    create(claimData: any): Promise<{
        success: boolean;
        claim: {
            transactionHash: string;
            id: string;
            userId: string;
            policyId: string;
            type: string;
            status: string;
            requestedAmount: string;
            approvedAmount: string;
            description: string;
            documents: string[];
            images: string[];
            aiAnalysis: any;
            reviewNotes: any;
            createdAt: Date;
            updatedAt: Date;
        };
        blockchainResult: any;
        votingProposal: any;
        blockchainSuccess: boolean;
        transactionHash: string;
        message: string;
        nextSteps: string[];
        votingUrl: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        claim?: undefined;
        blockchainResult?: undefined;
        votingProposal?: undefined;
        blockchainSuccess?: undefined;
        transactionHash?: undefined;
        nextSteps?: undefined;
        votingUrl?: undefined;
    }>;
    voteOnClaim(voteData: any): Promise<{
        success: boolean;
        voteData: any;
        blockchainResult: {
            success: boolean;
            message: string;
            voteData: any;
            transaction: {
                to: string;
                data: string;
                value: string;
                estimatedGas: string;
            };
            contractAddress: string;
            note: string;
            nextSteps: string[];
        };
        transaction: {
            to: string;
            data: string;
            value: string;
            estimatedGas: string;
        };
        message: string;
        nextSteps: string[];
    }>;
}
