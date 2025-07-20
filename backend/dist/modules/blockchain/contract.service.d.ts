import { BlockchainService } from './blockchain.service';
export declare class ContractService {
    private readonly blockchainService;
    private readonly logger;
    private contracts;
    constructor(blockchainService: BlockchainService);
    private initializeContracts;
    getContractAddresses(): {
        stablecoin: string;
        governanceToken: string;
        policyNFT: string;
        claimsEngine: string;
        governance: string;
        surplusDistributor: string;
        network: string;
        chainId: number;
        rpcUrl: string;
    };
    getTokenBalances(address: string): Promise<{
        address: string;
        tokens: {
            stablecoin: any;
            governanceToken: any;
        };
        nftPolicies: {
            success: boolean;
            policies: any[];
            totalPolicies: number;
            note: string;
        } | {
            success: boolean;
            policies: any[];
            totalPolicies: number;
            note?: undefined;
        };
        timestamp: string;
    }>;
    private getTokenInfo;
    createPolicy(policyData: any): Promise<{
        success: boolean;
        message: string;
        policyData: any;
        transactions: {
            approval: any;
            createPolicy: {
                to: string;
                data: string;
                estimatedGas: string;
                value: string;
                note: string;
            };
        };
        contractAddress: string;
        note: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        policyData: any;
        note: string;
        transactions?: undefined;
        contractAddress?: undefined;
    }>;
    submitClaim(claimData: any): Promise<{
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
    }>;
    stakeTokens(amount: string, userAddress: string): Promise<{
        success: boolean;
        message: string;
        amount: string;
        userAddress: string;
        transaction: {
            to: string;
            data: string;
            estimatedGas: string;
            value: string;
        };
        contractAddress: string;
        note: string;
    }>;
    getPolicyDetails(tokenId: string): Promise<{
        tokenId: string;
        owner: any;
        exists: boolean;
        contractAddress: string;
        explorerUrl: string;
        details: {
            policyType: string;
            status: string;
            policyholder: any;
            beneficiary: any;
            coverageAmount: string;
            premium: string;
            creationDate: string;
            expiryDate: string;
            claimedAmount: string;
            coverageTerms: any;
            ipfsHash: any;
        };
        error?: undefined;
    } | {
        tokenId: string;
        error: any;
        exists: boolean;
        owner?: undefined;
        contractAddress?: undefined;
        explorerUrl?: undefined;
        details?: undefined;
    }>;
    getUserPolicies(userAddress: string): Promise<{
        success: boolean;
        policies: any[];
        totalPolicies: number;
        note: string;
    } | {
        success: boolean;
        policies: any[];
        totalPolicies: number;
        note?: undefined;
    }>;
    getClaimDetails(claimId: string): Promise<{
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
    private getClaimStatus;
    getGovernanceProposals(): Promise<{
        proposals: any[];
        contractAddress: string;
        totalProposals: number;
    }>;
    createGovernanceProposal(proposalData: any): Promise<{
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
    }>;
    voteOnProposal(voteData: any): Promise<{
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
    }>;
    getLiquidityInfo(): Promise<{
        stablecoin: {
            totalSupply: string;
            symbol: any;
        };
        governanceToken: {
            totalSupply: string;
            symbol: any;
        };
        network: string;
        timestamp: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        contracts: {
            stablecoin: {
                address: string;
                name: any;
                connected: boolean;
            };
            governanceToken: {
                address: string;
                name: any;
                connected: boolean;
            };
            policyNFT: {
                address: string;
                name: any;
                connected: boolean;
            };
        };
        network: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
        contracts?: undefined;
        network?: undefined;
    }>;
    getAllClaims(): Promise<any[]>;
    voteOnClaim(voteData: any): Promise<{
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
    }>;
    getJuryVotingDetails(claimId: string): Promise<{
        jurors: any;
        votesFor: string;
        votesAgainst: string;
        totalVotes: number;
        averageAmount: string;
        concluded: any;
        approvalPercentage: number;
    }>;
    executeClaimDecision(claimId: string, isApproved: boolean): Promise<{
        success: boolean;
        message: string;
        claimId: string;
        isApproved: boolean;
        transaction: {
            to: string;
            data: string;
            estimatedGas: string;
            value: string;
        };
        contractAddress: string;
        note: string;
    }>;
    private getClaimType;
    private getPolicyTypeName;
    private getPolicyStatusName;
}
