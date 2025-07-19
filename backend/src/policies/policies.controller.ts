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
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('policies')
@Controller('policies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new insurance policy' })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPolicyDto: CreatePolicyDto, @Request() req) {
    return this.policiesService.create(createPolicyDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  @ApiResponse({ status: 200, description: 'Policies retrieved successfully' })
  findAll(@Query('userId') userId?: string) {
    return this.policiesService.findAll(userId);
  }

  @Get('my-policies')
  @ApiOperation({ summary: 'Get current user policies' })
  @ApiResponse({ status: 200, description: 'User policies retrieved successfully' })
  findUserPolicies(@Request() req) {
    return this.policiesService.findUserPolicies(req.user.id);
  }

  @Get('token/:tokenId')
  @ApiOperation({ summary: 'Get policy by token ID' })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  findByTokenId(@Param('tokenId') tokenId: string) {
    return this.policiesService.findByTokenId(tokenId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update policy' })
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policiesService.update(id, updatePolicyDto);
  }

  @Post(':tokenId/transfer')
  @ApiOperation({ summary: 'Transfer policy to another user' })
  @ApiResponse({ status: 200, description: 'Policy transferred successfully' })
  @ApiResponse({ status: 400, description: 'Transfer not allowed' })
  transferPolicy(
    @Param('tokenId') tokenId: string,
    @Body('toUserId') toUserId: string,
    @Request() req,
  ) {
    return this.policiesService.transferPolicy(tokenId, req.user.id, toUserId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete policy' })
  @ApiResponse({ status: 200, description: 'Policy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }
} 