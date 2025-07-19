import { CreateClaimDto } from './create-claim.dto';
import { ClaimStatus } from '../claim.schema';
declare const UpdateClaimDto_base: import("@nestjs/common").Type<Partial<CreateClaimDto>>;
export declare class UpdateClaimDto extends UpdateClaimDto_base {
    status?: ClaimStatus;
    approvedAmount?: number;
    aiAnalysis?: any;
    humanReview?: any;
}
export {};
