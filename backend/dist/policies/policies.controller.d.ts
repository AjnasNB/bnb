import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    create(createPolicyDto: CreatePolicyDto, req: any): Promise<import("./policy.schema").Policy>;
    findAll(userId?: string): Promise<import("./policy.schema").Policy[]>;
    findUserPolicies(req: any): Promise<import("./policy.schema").Policy[]>;
    findByTokenId(tokenId: string): Promise<import("./policy.schema").Policy>;
    findOne(id: string): Promise<import("./policy.schema").Policy>;
    update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<import("./policy.schema").Policy>;
    transferPolicy(tokenId: string, toUserId: string, req: any): Promise<import("./policy.schema").Policy>;
    remove(id: string): Promise<void>;
}
