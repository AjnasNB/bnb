import { PartialType } from '@nestjs/swagger';
import { CreatePolicyDto } from './create-policy.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyStatus } from '../policy.schema';

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {
  @ApiProperty({ enum: PolicyStatus, required: false })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;
} 