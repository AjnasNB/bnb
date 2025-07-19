import { ClaimsService } from './claims.service';
export declare class ClaimsController {
    private readonly claimsService;
    constructor(claimsService: ClaimsService);
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
