import { IsNotEmpty, IsString, IsNumber, IsDate, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyType } from '../policy.schema';

export class CreatePolicyDto {
  @ApiProperty({ enum: PolicyType, example: PolicyType.HEALTH })
  @IsEnum(PolicyType)
  type: PolicyType;

  @ApiProperty({ example: 1000000000000000000, description: 'Coverage amount in Wei' })
  @IsNumber()
  coverageAmount: number;

  @ApiProperty({ example: 100000000000000000, description: 'Premium amount in Wei' })
  @IsNumber()
  premiumAmount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: 'QmHash123...', description: 'IPFS hash of terms and conditions' })
  @IsString()
  terms: string;

  @ApiProperty({ example: 'Comprehensive health insurance policy', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: { 
      medicalHistory: ['diabetes', 'hypertension'],
      preExistingConditions: ['allergies'] 
    },
    required: false,
    description: 'Type-specific data object'
  })
  @IsOptional()
  @IsObject()
  typeSpecificData?: any;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isTransferable?: boolean;

  @ApiProperty({ 
    example: ['QmDoc1...', 'QmDoc2...'], 
    required: false,
    description: 'IPFS hashes of policy documents'
  })
  @IsOptional()
  attachments?: string[];
} 