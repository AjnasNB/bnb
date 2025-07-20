import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';
import { ContractService } from '../blockchain/contract.service';
import { GovernanceService } from '../governance/governance.service';
export declare class ClaimsService {
    private readonly claimRepository;
    private readonly contractService;
    private readonly governanceService;
    private readonly logger;
    constructor(claimRepository: Repository<Claim>, contractService: ContractService, governanceService: GovernanceService);
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
    create(claimData: any): Promise<{
        success: boolean;
        claim: Claim;
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
    getClaimWithVotingDetails(claimId: string): Promise<{
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
}
