import { BlockchainService } from './blockchain.service';
import { ContractService } from './contract.service';
export declare class BlockchainController {
    private readonly blockchainService;
    private readonly contractService;
    constructor(blockchainService: BlockchainService, contractService: ContractService);
    getNetworkInfo(): Promise<{
        network: string;
        chainId: number;
        blockNumber: number;
        gasPrice: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        explorerUrl: string;
        status: string;
    }>;
    getContractAddresses(): Promise<{
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
    }>;
    getBalance(address: string): Promise<{
        address: string;
        balance: string;
        balanceWei: string;
        currency: string;
    }>;
    getTokenBalances(address: string): Promise<{
        address: string;
        balances: {
            stablecoin: any;
            governanceToken: any;
            policyNFT: any;
        };
    }>;
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
    stakeTokens(stakeData: {
        amount: string;
        userAddress: string;
    }): Promise<{
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
    getTransactionHistory(address: string): Promise<{
        address: string;
        transactions: any[];
        total: number;
        timestamp: string;
        error?: undefined;
    } | {
        address: string;
        transactions: any[];
        total: number;
        error: any;
        timestamp: string;
    }>;
    verifyTransaction(data: {
        txHash: string;
    }): Promise<{
        hash: string;
        status: string;
        message: string;
        blockNumber?: undefined;
        from?: undefined;
        to?: undefined;
        value?: undefined;
        gasUsed?: undefined;
        gasPrice?: undefined;
        confirmations?: undefined;
        error?: undefined;
    } | {
        hash: string;
        status: string;
        blockNumber: number;
        from: string;
        to: string;
        value: string;
        gasUsed: string;
        gasPrice: string;
        confirmations: number;
        message?: undefined;
        error?: undefined;
    } | {
        hash: string;
        status: string;
        error: any;
        message?: undefined;
        blockNumber?: undefined;
        from?: undefined;
        to?: undefined;
        value?: undefined;
        gasUsed?: undefined;
        gasPrice?: undefined;
        confirmations?: undefined;
    }>;
    getProposals(): Promise<{
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
        network: {
            name: string;
            chainId: number;
            blockNumber: number;
        };
        rpcUrl: string;
        contracts: {
            stablecoin: string;
            governanceToken: string;
            policyNFT: string;
            claimsEngine: string;
            surplusDistributor: string;
            governance: string;
        };
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
        network?: undefined;
        rpcUrl?: undefined;
        contracts?: undefined;
    }>;
}
