import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): Promise<{
        users: import("./entities/user.entity").User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByWalletAddress(walletAddress: string): Promise<{
        users: import("./entities/user.entity").User[];
        total: number;
        isNewUser: boolean;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    create(userData: any): Promise<{
        success: boolean;
        user: import("./entities/user.entity").User;
        message: string;
        isNewUser: boolean;
    } | {
        success: boolean;
        user: import("./entities/user.entity").User[];
        message: string;
        isNewUser: boolean;
    }>;
    update(id: string, userData: any): Promise<{
        success: boolean;
        user: any;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getUserPolicies(id: string): Promise<{
        userId: string;
        policies: any[];
        total: number;
    }>;
    getUserClaims(id: string): Promise<{
        userId: string;
        claims: any[];
        total: number;
    }>;
}
