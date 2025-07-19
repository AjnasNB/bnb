import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    _id?: Types.ObjectId;
    walletAddress: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    isVerified: boolean;
    role: string;
    policies: Types.ObjectId[];
    claims: Types.ObjectId[];
    totalPremiumPaid: number;
    totalClaimsPaid: number;
    riskScore: number;
    lastLoginAt?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}>>;
