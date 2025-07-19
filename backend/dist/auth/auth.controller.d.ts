import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
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
    register(registerDto: RegisterDto): Promise<{
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
}
