import { BlockchainService } from './blockchain.service';
import { ContractService } from './contract.service';
export declare class BlockchainController {
    private readonly blockchainService;
    private readonly contractService;
    private readonly logger;
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
        success: boolean;
        tokens: {
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
        };
        address: string;
        source?: undefined;
    } | {
        success: boolean;
        tokens: {
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
        };
        address: string;
        source: string;
    }>;
    getUserPolicies(address: string): Promise<{
        success: boolean;
        policies: any[];
        totalPolicies: number;
        message: string;
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
    getProposals(): Promise<({
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
    getAllData(userAddress?: string): Promise<{
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
    getAllUserPolicies(address: string): Promise<{
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
    getAllClaims(): Promise<{
        success: boolean;
        claims: {
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
        }[];
        total: number;
        source: string;
        error?: undefined;
    } | {
        success: boolean;
        claims: any[];
        total: number;
        error: any;
        source?: undefined;
    }>;
    getAllPolicies(): Promise<{
        success: boolean;
        policies: any[];
        total: number;
        source: string;
        error?: undefined;
    } | {
        success: boolean;
        policies: any[];
        total: number;
        error: any;
        source?: undefined;
    }>;
    getEverything(): Promise<{
        success: boolean;
        data: {
            claims: {
                total: number;
                items: {
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
                }[];
                source: string;
            };
            policies: {
                total: number;
                items: any[];
                source: string;
            };
            userPolicies: {
                total: any;
                items: {
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
                };
                source: string;
            };
        };
        summary: {
            totalClaims: number;
            totalPolicies: number;
            totalUserPolicies: any;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data: {
            claims: {
                total: number;
                items: any[];
                source: string;
            };
            policies: {
                total: number;
                items: any[];
                source: string;
            };
            userPolicies: {
                total: number;
                items: any[];
                source: string;
            };
        };
        summary?: undefined;
    }>;
}
