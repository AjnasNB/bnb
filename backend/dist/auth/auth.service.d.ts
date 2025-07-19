import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateWalletSignature(walletAddress: string, signature: string, message: string): Promise<boolean>;
    login(walletAddress: string, signature: string, message: string): Promise<{
        access_token: string;
        user: {
            id: any;
            walletAddress: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            isVerified: any;
        };
    }>;
    register(createUserDto: CreateUserDto, signature: string, message: string): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            walletAddress: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            isVerified: boolean;
        };
    }>;
    validateUser(payload: any): Promise<import("../users/user.schema").User>;
}
