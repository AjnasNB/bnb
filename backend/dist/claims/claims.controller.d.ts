import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { ClaimStatus } from './claim.schema';
export declare class ClaimsController {
    private readonly claimsService;
    constructor(claimsService: ClaimsService);
    create(createClaimDto: CreateClaimDto, req: any): Promise<import("./claim.schema").Claim>;
    findAll(userId?: string): Promise<import("./claim.schema").Claim[]>;
    findUserClaims(req: any): Promise<import("./claim.schema").Claim[]>;
    getStatistics(userId?: string): Promise<any>;
    findByClaimNumber(claimNumber: string): Promise<import("./claim.schema").Claim>;
    findOne(id: string): Promise<import("./claim.schema").Claim>;
    update(id: string, updateClaimDto: UpdateClaimDto): Promise<import("./claim.schema").Claim>;
    processWithAI(id: string): Promise<void>;
    processPayment(id: string): Promise<void>;
    updateStatus(id: string, status: ClaimStatus, notes?: string): Promise<import("./claim.schema").Claim>;
    remove(id: string): Promise<void>;
}
