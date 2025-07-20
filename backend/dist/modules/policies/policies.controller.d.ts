import { PoliciesService } from './policies.service';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    getTypes(): Promise<{
        types: {
            id: string;
            name: string;
            basePremium: number;
            description: string;
            minCoverage: number;
            maxCoverage: number;
            premiumRate: number;
            duration: number;
        }[];
    }>;
    getAvailableTypes(): Promise<{
        types: {
            id: string;
            name: string;
            basePremium: number;
            description: string;
            minCoverage: number;
            maxCoverage: number;
            premiumRate: number;
            duration: number;
        }[];
        error?: undefined;
    } | {
        types: any[];
        error: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        policies: import("./entities/policy.entity").Policy[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        error?: undefined;
    } | {
        policies: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        error: any;
    }>;
    findUserPolicies(userId: string): Promise<{
        error: any;
        policies: any[];
        total: number;
        source: string;
        userAddress: string;
    }>;
    findOne(id: string): Promise<import("./entities/policy.entity").Policy | {
        id: string;
        userId: string;
        type: string;
        status: string;
        coverageAmount: string;
        premiumAmount: string;
        startDate: Date;
        endDate: Date;
        nftTokenId: string;
        terms: {
            deductible: string;
            maxClaim: string;
        };
        metadata: {
            riskScore: string;
        };
        createdAt: string;
    }>;
    create(policyData: any): Promise<{
        success: boolean;
        policy: import("./entities/policy.entity").Policy;
        blockchainResult: {
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
        };
        message: string;
    }>;
    update(id: string, policyData: any): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getQuote(quoteData: any): Promise<{
        quote: {
            type: any;
            coverageAmount: any;
            premiumAmount: string;
            estimatedPayout: string;
            validUntil: string;
        };
    }>;
}
