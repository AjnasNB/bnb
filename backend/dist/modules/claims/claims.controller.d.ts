import { ClaimsService } from './claims.service';
export declare class ClaimsController {
    private readonly claimsService;
    constructor(claimsService: ClaimsService);
    findAll(status?: string): Promise<{
        claims: any[];
        total: number;
        status: string;
        error?: undefined;
    } | {
        claims: any[];
        total: number;
        status: string;
        error: any;
    }>;
    getClaimsForVoting(): Promise<{
        claims: any[];
        total: number;
        message: string;
        error?: undefined;
    } | {
        claims: any[];
        total: number;
        error: any;
        message?: undefined;
    }>;
    findOne(id: string): Promise<{
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
    }>;
    getClaimWithVotingDetails(id: string): Promise<{
        claim: {
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
        votingDetails: any;
    }>;
    create(claimData: any): Promise<{
        success: boolean;
        claim: import("./entities/claim.entity").Claim;
        blockchainResult: {
            success: boolean;
            message: string;
            claimData: any;
            transaction: {
                to: string;
                data: string;
                estimatedGas: string;
                value: string;
            };
            contractAddress: string;
            note: string;
        };
        votingProposal: {
            success: boolean;
            proposal: import("../governance/entities/proposal.entity").Proposal;
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
        };
        message: string;
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
                estimatedGas: string;
                value: string;
            };
            contractAddress: string;
            note: string;
        };
        message: string;
    }>;
}
