import { CreatePolicyDto } from './create-policy.dto';
import { PolicyStatus } from '../policy.schema';
declare const UpdatePolicyDto_base: import("@nestjs/common").Type<Partial<CreatePolicyDto>>;
export declare class UpdatePolicyDto extends UpdatePolicyDto_base {
    status?: PolicyStatus;
}
export {};
