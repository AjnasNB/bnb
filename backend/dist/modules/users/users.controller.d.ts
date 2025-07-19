import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            walletAddress: string;
            isActive: boolean;
            isVerified: boolean;
            createdAt: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        walletAddress: string;
        isActive: boolean;
        isVerified: boolean;
        avatar: any;
        phone: any;
        preferences: {
            notifications: {
                email: boolean;
                push: boolean;
            };
            currency: string;
            language: string;
        };
        createdAt: string;
    }>;
    create(userData: any): Promise<{
        success: boolean;
        user: any;
        message: string;
    }>;
    update(id: string, userData: any): Promise<{
        success: boolean;
        id: string;
        updatedData: any;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getUserPolicies(id: string): Promise<{
        userId: string;
        policies: {
            id: string;
            type: string;
            status: string;
            coverageAmount: string;
            premiumAmount: string;
            startDate: string;
            endDate: string;
            nftTokenId: string;
        }[];
        total: number;
    }>;
    getUserClaims(id: string): Promise<{
        userId: string;
        claims: {
            id: string;
            policyId: string;
            type: string;
            status: string;
            requestedAmount: string;
            approvedAmount: string;
            description: string;
            createdAt: string;
        }[];
        total: number;
    }>;
}
