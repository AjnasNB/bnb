import { ethers } from 'ethers';
export declare class BlockchainService {
    private readonly logger;
    private provider;
    constructor();
    private initializeProvider;
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
    getBalance(address: string): Promise<{
        address: string;
        balance: string;
        balanceWei: string;
        currency: string;
    }>;
    getTransactionHistory(address: string, limit?: number): Promise<{
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
    verifyTransaction(txHash: string): Promise<{
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
    estimateGas(transaction: any): Promise<{
        gasLimit: string;
        gasPrice: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        estimatedCost: string;
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
    getProvider(): ethers.JsonRpcProvider;
    getConfig(): {
        network: string;
        chainId: number;
        rpcUrl: string;
        contracts: {
            stablecoin: string;
            governanceToken: string;
            policyNFT: string;
            claimsEngine: string;
            surplusDistributor: string;
            governance: string;
        };
        explorerUrl: string;
    };
    getAllClaims(): Promise<{
        id: string;
        claimId: string;
        userId: string;
        policyId: string;
        type: string;
        status: string;
        requestedAmount: string;
        approvedAmount: any;
        description: string;
        documents: string[];
        images: any[];
        aiAnalysis: {
            fraudScore: number;
            authenticityScore: number;
            recommendation: string;
            reasoning: string;
            confidence: number;
        };
        createdAt: string;
        updatedAt: string;
        votingDetails: {
            votesFor: string;
            votesAgainst: string;
            totalVotes: string;
            votingEnds: string;
        };
    }[]>;
    private getFallbackClaims;
    getTokenBalances(address: string): Promise<{
        stablecoin: {
            balance: string;
            symbol: string;
            decimals: number;
        };
        governanceToken: {
            balance: string;
            symbol: string;
            decimals: number;
        };
    }>;
}
