import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  profileImage?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'user', enum: ['user', 'admin', 'agent'] })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Policy' }] })
  policies: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Claim' }] })
  claims: Types.ObjectId[];

  @Prop({ default: 0 })
  totalPremiumPaid: number;

  @Prop({ default: 0 })
  totalClaimsPaid: number;

  @Prop({ default: 5 })
  riskScore: number; // 1-10 scale

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: true })
  isActive: boolean;

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); 