import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimType } from '../claim.schema';

export class CreateClaimDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  policyId: string;

  @ApiProperty({ enum: ClaimType, example: ClaimType.HEALTH })
  @IsEnum(ClaimType)
  type: ClaimType;

  @ApiProperty({ example: 500000000000000000, description: 'Requested amount in Wei' })
  @IsNumber()
  requestedAmount: number;

  @ApiProperty({ example: 'Hospital treatment for accident injuries' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  @Type(() => Date)
  @IsDate()
  incidentDate: Date;

  @ApiProperty({
    example: ['QmDoc1...', 'QmDoc2...'],
    required: false,
    description: 'IPFS hashes of claim documents',
  })
  @IsOptional()
  @IsArray()
  documents?: string[];

  @ApiProperty({
    example: ['QmImg1...', 'QmImg2...'],
    required: false,
    description: 'IPFS hashes of claim images',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({
    example: {
      hospitalName: 'City General Hospital',
      doctorName: 'Dr. Smith',
      diagnosis: 'Fractured arm',
      treatmentType: 'Emergency treatment',
    },
    required: false,
    description: 'Claim-specific data object',
  })
  @IsOptional()
  @IsObject()
  claimSpecificData?: any;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiProperty({
    example: ['emergency', 'accident'],
    required: false,
    description: 'Tags for categorization',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: 'EXT-REF-123', required: false })
  @IsOptional()
  @IsString()
  externalReferenceId?: string;
} 