import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClaimStatus } from './claim.schema';

@ApiTags('claims')
@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new insurance claim' })
  @ApiResponse({ status: 201, description: 'Claim submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createClaimDto: CreateClaimDto, @Request() req) {
    return this.claimsService.create(createClaimDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all claims' })
  @ApiResponse({ status: 200, description: 'Claims retrieved successfully' })
  findAll(@Query('userId') userId?: string) {
    return this.claimsService.findAll(userId);
  }

  @Get('my-claims')
  @ApiOperation({ summary: 'Get current user claims' })
  @ApiResponse({ status: 200, description: 'User claims retrieved successfully' })
  findUserClaims(@Request() req) {
    return this.claimsService.findUserClaims(req.user.id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get claim statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStatistics(@Query('userId') userId?: string) {
    return this.claimsService.getClaimStatistics(userId);
  }

  @Get('number/:claimNumber')
  @ApiOperation({ summary: 'Get claim by claim number' })
  @ApiResponse({ status: 200, description: 'Claim retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  findByClaimNumber(@Param('claimNumber') claimNumber: string) {
    return this.claimsService.findByClaimNumber(claimNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  @ApiResponse({ status: 200, description: 'Claim retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update claim' })
  @ApiResponse({ status: 200, description: 'Claim updated successfully' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(id, updateClaimDto);
  }

  @Post(':id/process-ai')
  @ApiOperation({ summary: 'Trigger AI analysis for claim' })
  @ApiResponse({ status: 200, description: 'AI analysis triggered' })
  processWithAI(@Param('id') id: string) {
    return this.claimsService.processWithAI(id);
  }

  @Post(':id/process-payment')
  @ApiOperation({ summary: 'Process payment for approved claim' })
  @ApiResponse({ status: 200, description: 'Payment processed' })
  @ApiResponse({ status: 400, description: 'Claim not approved' })
  processPayment(@Param('id') id: string) {
    return this.claimsService.processPayment(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update claim status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ClaimStatus,
    @Body('notes') notes?: string,
  ) {
    return this.claimsService.updateStatus(id, status, notes);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete claim' })
  @ApiResponse({ status: 200, description: 'Claim deleted successfully' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  remove(@Param('id') id: string) {
    return this.claimsService.remove(id);
  }
} 