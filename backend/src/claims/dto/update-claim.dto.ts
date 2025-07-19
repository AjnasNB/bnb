import { PartialType } from '@nestjs/swagger';
import { CreateClaimDto } from './create-claim.dto';
import { IsOptional, IsEnum, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimStatus } from '../claim.schema';

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @ApiProperty({ enum: ClaimStatus, required: false })
  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus;

  @ApiProperty({ example: 400000000000000000, required: false, description: 'Approved amount in Wei' })
  @IsOptional()
  @IsNumber()
  approvedAmount?: number;

  @ApiProperty({
    example: {
      fraudScore: 0.1,
      authenticityScore: 0.9,
      estimatedAmount: 450000000000000000,
      confidence: 0.85,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  aiAnalysis?: any;

  @ApiProperty({
    example: {
      reviewerId: '507f1f77bcf86cd799439012',
      notes: 'Claim approved after document verification',
      decision: 'approve',
      adjustedAmount: 400000000000000000,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  humanReview?: any;
} 