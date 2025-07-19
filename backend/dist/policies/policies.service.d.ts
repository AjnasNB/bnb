import { Model } from 'mongoose';
import { Policy, PolicyDocument, PolicyStatus } from './policy.schema';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { UsersService } from '../users/users.service';
export declare class PoliciesService {
    private policyModel;
    private blockchainService;
    private usersService;
    constructor(policyModel: Model<PolicyDocument>, blockchainService: BlockchainService, usersService: UsersService);
    create(createPolicyDto: CreatePolicyDto, userId: string): Promise<Policy>;
    findAll(userId?: string): Promise<Policy[]>;
    findOne(id: string): Promise<Policy>;
    findByTokenId(tokenId: string): Promise<Policy>;
    findUserPolicies(userId: string): Promise<Policy[]>;
    update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<Policy>;
    updateStatus(id: string, status: PolicyStatus): Promise<Policy>;
    addClaim(policyId: string, claimAmount: number): Promise<Policy>;
    checkExpiredPolicies(): Promise<void>;
    transferPolicy(tokenId: string, fromUserId: string, toUserId: string): Promise<Policy>;
    private generateTokenId;
    remove(id: string): Promise<void>;
}
