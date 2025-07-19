import { PoliciesService } from './policies.service';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    findAll(page?: number, limit?: number): Promise<{
        policies: {
            id: string;
            userId: string;
            type: string;
            status: string;
            coverageAmount: string;
            premiumAmount: string;
            startDate: string;
            endDate: string;
            nftTokenId: string;
            createdAt: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        type: string;
        status: string;
        coverageAmount: string;
        premiumAmount: string;
        startDate: string;
        endDate: string;
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
        policy: any;
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
    getAvailableTypes(): Promise<{
        types: {
            id: string;
            name: string;
            basePremium: number;
            description: string;
        }[];
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
