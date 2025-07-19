import { ClaimType } from '../claim.schema';
export declare class CreateClaimDto {
    policyId: string;
    type: ClaimType;
    requestedAmount: number;
    description: string;
    incidentDate: Date;
    documents?: string[];
    images?: string[];
    claimSpecificData?: any;
    isUrgent?: boolean;
    tags?: string[];
    externalReferenceId?: string;
}
