import { Document, Types } from 'mongoose';
export type PolicyDocument = Policy & Document;
export declare enum PolicyType {
    HEALTH = "health",
    VEHICLE = "vehicle",
    TRAVEL = "travel",
    PRODUCT_WARRANTY = "product_warranty",
    PET = "pet",
    AGRICULTURAL = "agricultural"
}
export declare enum PolicyStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    SUSPENDED = "suspended",
    CLAIMED = "claimed"
}
export declare class Policy {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    tokenId: string;
    type: PolicyType;
    coverageAmount: number;
    premiumAmount: number;
    startDate: Date;
    endDate: Date;
    status: PolicyStatus;
    terms: string;
    description?: string;
    typeSpecificData?: {
        medicalHistory?: string[];
        preExistingConditions?: string[];
        vehicleVin?: string;
        vehicleModel?: string;
        vehicleYear?: number;
        driverLicenseNumber?: string;
        destination?: string;
        travelDates?: {
            start: Date;
            end: Date;
        };
        productSerialNumber?: string;
        productModel?: string;
        purchaseDate?: Date;
        retailer?: string;
        petType?: string;
        petBreed?: string;
        petAge?: number;
        petName?: string;
        farmLocation?: string;
        cropType?: string;
        farmSize?: number;
    };
    claimsCount: number;
    totalClaimedAmount: number;
    blockchainTxHash?: string;
    isTransferable: boolean;
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PolicySchema: import("mongoose").Schema<Policy, import("mongoose").Model<Policy, any, any, any, Document<unknown, any, Policy> & Policy & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Policy, Document<unknown, {}, import("mongoose").FlatRecord<Policy>> & import("mongoose").FlatRecord<Policy> & Required<{
    _id: Types.ObjectId;
}>>;
