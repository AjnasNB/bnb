import { PolicyType } from '../policy.schema';
export declare class CreatePolicyDto {
    type: PolicyType;
    coverageAmount: number;
    premiumAmount: number;
    startDate: Date;
    endDate: Date;
    terms: string;
    description?: string;
    typeSpecificData?: any;
    isTransferable?: boolean;
    attachments?: string[];
}
