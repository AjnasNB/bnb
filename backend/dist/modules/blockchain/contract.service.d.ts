import { BlockchainService } from './blockchain.service';
export declare class ContractService {
    private readonly blockchainService;
    private readonly logger;
    private contracts;
    constructor(blockchainService: BlockchainService);
    private initializeContracts;
    private initializeFallbackContracts;
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
            message: string;
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
        claimData: {
            claimId: string;
            policyId: any;
            claimType: any;
            amount: any;
            description: any;
            evidenceHashes: any;
            userAddress: any;
            submittedAt: string;
        };
        blockchainResult: {
            contractAddresses: {
                claimsEngine: string;
                governance: string;
            };
            transactions: {
                claimSubmission: {
                    to: string;
                    data: string;
                    value: string;
                    estimatedGas: string;
                };
                governanceProposal: {
                    to: string;
                    data: string;
                    value: string;
                    estimatedGas: string;
                };
            };
        };
        votingProposal: {
            title: string;
            description: string;
            votingPeriod: number;
            claimId: string;
        };
        nextSteps: string[];
        error?: undefined;
        note?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        claimData: {
            claimId: string;
            policyId: any;
            claimType: any;
            amount: any;
            description: any;
            evidenceHashes: any;
            userAddress: any;
            submittedAt: string;
        };
        blockchainResult: {
            contractAddresses: {
                claimsEngine: string;
                governance: string;
            };
            transactions: {
                claimSubmission: {
                    to: string;
                    data: string;
                    value: string;
                    estimatedGas: string;
                    error: string;
                };
                governanceProposal: {
                    to: string;
                    data: string;
                    value: string;
                    estimatedGas: string;
                    error: string;
                };
            };
        };
        note: string;
        votingProposal?: undefined;
        nextSteps?: undefined;
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
        message: string;
    }>;
    private getPolicyTypeName;
    private getCoverageAmount;
    private getPremiumAmount;
    private getCreationDate;
    private getExpiryDate;
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
    getGovernanceProposals(): Promise<({
        id: string;
        title: string;
        description: string;
        status: string;
        votesFor: string;
        votesAgainst: string;
        startTime: string;
        endTime: string;
        executed: boolean;
        metadata: {
            proposalType: string;
            claimData: {
                claimId: string;
                policyTokenId: string;
                amount: string;
                description: string;
            };
            action?: undefined;
            currentValue?: undefined;
            proposedValue?: undefined;
        };
    } | {
        id: string;
        title: string;
        description: string;
        status: string;
        votesFor: string;
        votesAgainst: string;
        startTime: string;
        endTime: string;
        executed: boolean;
        metadata: {
            proposalType: string;
            action: string;
            currentValue: string;
            proposedValue: string;
            claimData?: undefined;
        };
    })[]>;
    private getDummyGovernanceProposals;
    private getProposalsFromEvents;
    createGovernanceProposal(proposalData: any): Promise<{
        success: boolean;
        message: string;
        proposalData: any;
        transaction: {
            to: string;
            data: string;
            estimatedGas: string;
            value: string;
            mock?: undefined;
        };
        contractAddress: string;
        note: string;
    } | {
        success: boolean;
        message: string;
        proposalData: any;
        transaction: {
            to: string;
            data: string;
            estimatedGas: string;
            value: string;
            mock: boolean;
        };
        contractAddress: string;
        note: string;
    }>;
    voteOnProposal(voteData: any): Promise<{
        success: boolean;
        transaction: {
            to: string;
            data: string;
            value: string;
            estimatedGas: string;
            proposalId: any;
            support: any;
            reason: any;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        transaction?: undefined;
        message?: undefined;
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
        network: {
            name: string;
            chainId: string;
        };
        contracts: {
            stablecoin: string;
            governanceToken: string;
            policyNFT: string;
            claimsEngine: string;
            governance: string;
        };
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
        network?: undefined;
        contracts?: undefined;
    }>;
    private getClaimsFromEvents;
    voteOnClaim(voteData: any): Promise<{
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
    private getClaimTypeEnum;
    private getPolicyTypeNameFromType;
    private getPolicyStatusName;
    fetchAllData(userAddress?: string): Promise<{
        policies: any[];
        claims: any[];
        nfts: any[];
        governance: any[];
        sources: {
            blockchain: {
                policies: number;
                claims: number;
                nfts: number;
            };
            database: {
                policies: number;
                claims: number;
            };
            combined: {
                policies: number;
                claims: number;
                nfts: number;
            };
        };
        errors: any[];
    }>;
    getAllUserPolicies(userAddress: string): Promise<{
        policies: any[];
        total: number;
        source: string;
        userAddress: string;
        note: string;
        error?: undefined;
    } | {
        policies: any[];
        total: number;
        source: string;
        userAddress: string;
        error: any;
        note: string;
    }>;
    private getFallbackClaims;
}
