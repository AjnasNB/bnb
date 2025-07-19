import { Document, Types } from 'mongoose';
export type ClaimDocument = Claim & Document;
export declare enum ClaimStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    AI_VALIDATED = "ai_validated",
    AI_REJECTED = "ai_rejected",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid",
    DISPUTED = "disputed"
}
export declare enum ClaimType {
    HEALTH = "health",
    VEHICLE = "vehicle",
    TRAVEL = "travel",
    PRODUCT_WARRANTY = "product_warranty",
    PET = "pet",
    AGRICULTURAL = "agricultural"
}
export declare class Claim {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    policyId: Types.ObjectId;
    claimNumber: string;
    type: ClaimType;
    requestedAmount: number;
    approvedAmount: number;
    description: string;
    status: ClaimStatus;
    documents: string[];
    images: string[];
    incidentDate: Date;
    reportedDate: Date;
    aiAnalysis?: {
        fraudScore: number;
        authenticityScore: number;
        estimatedAmount: number;
        confidence: number;
        detectedIssues: string[];
        ocrResults?: any;
        imageAnalysis?: any;
    };
    humanReview?: {
        reviewerId: string;
        reviewDate: Date;
        notes: string;
        decision: 'approve' | 'reject' | 'request_more_info';
        adjustedAmount?: number;
    };
    blockchainTxHash?: string;
    paymentTxHash?: string;
    claimSpecificData?: {
        hospitalName?: string;
        doctorName?: string;
        diagnosis?: string;
        treatmentType?: string;
        accidentLocation?: string;
        policeReportNumber?: string;
        otherPartyDetails?: any;
        repairShopEstimate?: number;
        flightNumber?: string;
        delayDuration?: number;
        cancellationReason?: string;
        defectDescription?: string;
        warrantyType?: string;
        repairOrReplace?: 'repair' | 'replace';
        veterinarianName?: string;
        treatmentDetails?: string;
        emergencyTreatment?: boolean;
        cropDamageArea?: number;
        weatherConditions?: string;
        estimatedLoss?: number;
    };
    isUrgent: boolean;
    tags?: string[];
    externalReferenceId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ClaimSchema: import("mongoose").Schema<Claim, import("mongoose").Model<Claim, any, any, any, Document<unknown, any, Claim> & Claim & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Claim, Document<unknown, {}, import("mongoose").FlatRecord<Claim>> & import("mongoose").FlatRecord<Claim> & Required<{
    _id: Types.ObjectId;
}>>;
