import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    findAll(pagination: {
        page: number;
        limit: number;
    }): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<User>;
    findByWalletAddress(walletAddress: string): Promise<User>;
    create(userData: any): Promise<{
        success: boolean;
        user: User;
        message: string;
        isNewUser: boolean;
    } | {
        success: boolean;
        user: User[];
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
    getUserPolicies(userId: string): Promise<{
        userId: string;
        policies: any[];
        total: number;
    }>;
    getUserClaims(userId: string): Promise<{
        userId: string;
        claims: any[];
        total: number;
    }>;
}
