import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

export enum ClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  AI_VALIDATED = 'ai_validated',
  AI_REJECTED = 'ai_rejected',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  DISPUTED = 'disputed',
}

export enum ClaimType {
  HEALTH = 'health',
  VEHICLE = 'vehicle',
  TRAVEL = 'travel',
  PRODUCT_WARRANTY = 'product_warranty',
  PET = 'pet',
  AGRICULTURAL = 'agricultural',
}

@Schema({ timestamps: true })
export class Claim {
  _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Policy' })
  policyId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  claimNumber: string;

  @Prop({ required: true, enum: ClaimType })
  type: ClaimType;

  @Prop({ required: true })
  requestedAmount: number; // In Wei

  @Prop({ default: 0 })
  approvedAmount: number; // In Wei

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ClaimStatus, default: ClaimStatus.SUBMITTED })
  status: ClaimStatus;

  @Prop({ type: [String] })
  documents: string[]; // IPFS hashes of claim documents

  @Prop({ type: [String] })
  images: string[]; // IPFS hashes of claim images

  @Prop()
  incidentDate: Date;

  @Prop()
  reportedDate: Date;

  // AI Analysis Results
  @Prop({ type: Object })
  aiAnalysis?: {
    fraudScore: number; // 0-1 scale
    authenticityScore: number; // 0-1 scale
    estimatedAmount: number;
    confidence: number;
    detectedIssues: string[];
    ocrResults?: any;
    imageAnalysis?: any;
  };

  // Admin/Agent Review
  @Prop({ type: Object })
  humanReview?: {
    reviewerId: string;
    reviewDate: Date;
    notes: string;
    decision: 'approve' | 'reject' | 'request_more_info';
    adjustedAmount?: number;
  };

  // Blockchain transaction details
  @Prop()
  blockchainTxHash?: string;

  @Prop()
  paymentTxHash?: string;

  // Additional claim-specific data
  @Prop({ type: Object })
  claimSpecificData?: {
    // Health claims
    hospitalName?: string;
    doctorName?: string;
    diagnosis?: string;
    treatmentType?: string;
    
    // Vehicle claims
    accidentLocation?: string;
    policeReportNumber?: string;
    otherPartyDetails?: any;
    repairShopEstimate?: number;
    
    // Travel claims
    flightNumber?: string;
    delayDuration?: number;
    cancellationReason?: string;
    
    // Product warranty claims
    defectDescription?: string;
    warrantyType?: string;
    repairOrReplace?: 'repair' | 'replace';
    
    // Pet claims
    veterinarianName?: string;
    treatmentDetails?: string;
    emergencyTreatment?: boolean;
    
    // Agricultural claims
    cropDamageArea?: number;
    weatherConditions?: string;
    estimatedLoss?: number;
  };

  @Prop({ default: false })
  isUrgent: boolean;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop()
  externalReferenceId?: string; // For integration with external systems

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim); 