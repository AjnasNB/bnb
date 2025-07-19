import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByWalletAddress(walletAddress: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    updateLastLogin(id: string): Promise<void>;
    addPolicy(userId: string, policyId: string): Promise<User>;
    addClaim(userId: string, claimId: string): Promise<User>;
    updateRiskScore(userId: string, riskScore: number): Promise<User>;
    remove(id: string): Promise<void>;
}
