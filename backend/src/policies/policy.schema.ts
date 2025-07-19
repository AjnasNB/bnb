import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PolicyDocument = Policy & Document;

export enum PolicyType {
  HEALTH = 'health',
  VEHICLE = 'vehicle',
  TRAVEL = 'travel',
  PRODUCT_WARRANTY = 'product_warranty',
  PET = 'pet',
  AGRICULTURAL = 'agricultural',
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  CLAIMED = 'claimed',
}

@Schema({ timestamps: true })
export class Policy {
  _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  tokenId: string; // NFT Token ID

  @Prop({ required: true, enum: PolicyType })
  type: PolicyType;

  @Prop({ required: true })
  coverageAmount: number; // In Wei

  @Prop({ required: true })
  premiumAmount: number; // In Wei

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: PolicyStatus, default: PolicyStatus.ACTIVE })
  status: PolicyStatus;

  @Prop({ required: true })
  terms: string; // IPFS hash of terms and conditions

  @Prop()
  description?: string;

  // Type-specific fields
  @Prop({ type: Object })
  typeSpecificData?: {
    // Health insurance
    medicalHistory?: string[];
    preExistingConditions?: string[];
    
    // Vehicle insurance
    vehicleVin?: string;
    vehicleModel?: string;
    vehicleYear?: number;
    driverLicenseNumber?: string;
    
    // Travel insurance
    destination?: string;
    travelDates?: { start: Date; end: Date };
    
    // Product warranty
    productSerialNumber?: string;
    productModel?: string;
    purchaseDate?: Date;
    retailer?: string;
    
    // Pet insurance
    petType?: string;
    petBreed?: string;
    petAge?: number;
    petName?: string;
    
    // Agricultural insurance
    farmLocation?: string;
    cropType?: string;
    farmSize?: number;
  };

  @Prop({ default: 0 })
  claimsCount: number;

  @Prop({ default: 0 })
  totalClaimedAmount: number;

  @Prop()
  blockchainTxHash?: string; // Transaction hash of policy creation

  @Prop({ default: false })
  isTransferable: boolean;

  @Prop({ type: [String] })
  attachments?: string[]; // IPFS hashes of policy documents

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const PolicySchema = SchemaFactory.createForClass(Policy); 