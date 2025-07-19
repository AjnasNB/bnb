import { BlockchainService } from './blockchain.service';
export declare class ContractService {
    private readonly blockchainService;
    private readonly logger;
    private contracts;
    constructor(blockchainService: BlockchainService);
    private initializeContracts;
    getContractAddresses(): {
        network: string;
        chainId: number;
        addresses: {
            stablecoin: string;
            governanceToken: string;
            policyNFT: string;
            claimsEngine: string;
            surplusDistributor: string;
            governance: string;
        };
        explorerUrls: {
            stablecoin: string;
            governanceToken: string;
            policyNFT: string;
            claimsEngine: string;
            surplusDistributor: string;
            governance: string;
        };
    };
    getTokenBalances(address: string): Promise<{
        address: string;
        balances: {
            stablecoin: any;
            governanceToken: any;
            policyNFT: any;
        };
    }>;
    private getTokenInfo;
    createPolicy(policyData: any): Promise<{
        success: boolean;
        message: string;
        policyData: any;
        estimatedGas: string;
        contractAddress: string;
        note: string;
    }>;
    submitClaim(claimData: any): Promise<{
        success: boolean;
        message: string;
        claimData: any;
        estimatedGas: string;
        contractAddress: string;
        note: string;
    }>;
    stakeTokens(amount: string, userAddress: string): Promise<{
        success: boolean;
        message: string;
        amount: string;
        userAddress: string;
        estimatedGas: string;
        contractAddress: string;
        note: string;
    }>;
    getPolicyDetails(tokenId: string): Promise<{
        tokenId: string;
        owner: any;
        contractAddress: string;
        explorerUrl: string;
        details: {
            active: boolean;
            coverageAmount: string;
            premiumPaid: string;
            expiryDate: string;
        };
        error?: undefined;
        exists?: undefined;
    } | {
        tokenId: string;
        error: any;
        exists: boolean;
        owner?: undefined;
        contractAddress?: undefined;
        explorerUrl?: undefined;
        details?: undefined;
    }>;
    getClaimDetails(claimId: string): Promise<{
        claimId: string;
        status: string;
        contractAddress: string;
        explorerUrl: string;
        details: {
            submittedAt: string;
            amount: string;
            claimType: string;
            evidenceHashes: any[];
        };
    }>;
    getGovernanceProposals(): Promise<{
        proposals: {
            id: string;
            title: string;
            description: string;
            status: string;
            votesFor: string;
            votesAgainst: string;
            endTime: string;
        }[];
        contractAddress: string;
        totalProposals: number;
    }>;
    voteOnProposal(voteData: any): Promise<{
        success: boolean;
        message: string;
        voteData: any;
        estimatedGas: string;
        contractAddress: string;
        note: string;
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
}
