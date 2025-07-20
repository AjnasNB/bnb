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
        stablecoin: string;
        governanceToken: string;
        policyNFT: string;
        claimsEngine: string;
        governance: string;
        surplusDistributor: string;
        network: string;
        chainId: number;
        rpcUrl: string;
    }>;
    getBalance(address: string): Promise<{
        address: string;
        balance: string;
        balanceWei: string;
        currency: string;
    }>;
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
    getUserPolicies(address: string): Promise<{
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
    stakeTokens(stakeData: {
        amount: string;
        userAddress: string;
    }): Promise<{
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
        proposals: any[];
        contractAddress: string;
        totalProposals: number;
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
