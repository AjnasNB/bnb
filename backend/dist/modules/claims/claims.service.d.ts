export declare class ClaimsService {
    findAll(): Promise<{
        claims: {
            id: string;
            userId: string;
            policyId: string;
            type: string;
            status: string;
            requestedAmount: string;
            description: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        policyId: string;
        type: string;
        status: string;
        requestedAmount: string;
        description: string;
    }>;
    create(claimData: any): Promise<{
        success: boolean;
        claim: any;
    }>;
}
