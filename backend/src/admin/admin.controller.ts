import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';
import { ClaimsService } from '../claims/claims.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly policiesService: PoliciesService,
    private readonly claimsService: ClaimsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  getAnalytics(@Query('period') period: string = '30d') {
    return this.adminService.getAnalytics(period);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent platform activity' })
  @ApiResponse({ status: 200, description: 'Activity retrieved' })
  getRecentActivity(@Query('limit') limit: number = 20) {
    return this.adminService.getRecentActivity(limit);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved' })
  getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('export/:entityType')
  @ApiOperation({ summary: 'Export platform data' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  exportData(
    @Param('entityType') entityType: string,
    @Query('format') format: string = 'json',
  ) {
    return this.adminService.exportData(entityType, format);
  }

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin view)' })
  @ApiResponse({ status: 200, description: 'Users retrieved' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Verify user account' })
  @ApiResponse({ status: 200, description: 'User verified' })
  verifyUser(@Param('id') id: string) {
    return this.usersService.update(id, { isVerified: true });
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend user account' })
  @ApiResponse({ status: 200, description: 'User suspended' })
  suspendUser(@Param('id') id: string) {
    return this.usersService.update(id, { isActive: false });
  }

  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({ status: 200, description: 'User activated' })
  activateUser(@Param('id') id: string) {
    return this.usersService.update(id, { isActive: true });
  }

  @Patch('users/:id/risk-score')
  @ApiOperation({ summary: 'Update user risk score' })
  @ApiResponse({ status: 200, description: 'Risk score updated' })
  updateRiskScore(@Param('id') id: string, @Body('riskScore') riskScore: number) {
    return this.usersService.updateRiskScore(id, riskScore);
  }

  // Policy Management
  @Get('policies')
  @ApiOperation({ summary: 'Get all policies (admin view)' })
  @ApiResponse({ status: 200, description: 'Policies retrieved' })
  getAllPolicies() {
    return this.policiesService.findAll();
  }

  @Patch('policies/:id/status')
  @ApiOperation({ summary: 'Update policy status' })
  @ApiResponse({ status: 200, description: 'Policy status updated' })
  updatePolicyStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.policiesService.updateStatus(id, status as any);
  }

  // Claims Management
  @Get('claims')
  @ApiOperation({ summary: 'Get all claims (admin view)' })
  @ApiResponse({ status: 200, description: 'Claims retrieved' })
  getAllClaims() {
    return this.claimsService.findAll();
  }

  @Get('claims/pending')
  @ApiOperation({ summary: 'Get pending claims for review' })
  @ApiResponse({ status: 200, description: 'Pending claims retrieved' })
  getPendingClaims() {
    return this.claimsService.findAll();
  }

  @Patch('claims/:id/review')
  @ApiOperation({ summary: 'Review and update claim' })
  @ApiResponse({ status: 200, description: 'Claim reviewed' })
  reviewClaim(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes: string,
    @Body('adjustedAmount') adjustedAmount?: number,
  ) {
    const updateData: any = { status };
    if (adjustedAmount !== undefined) {
      updateData.approvedAmount = adjustedAmount;
    }
    if (notes) {
      updateData['humanReview.notes'] = notes;
      updateData['humanReview.reviewDate'] = new Date();
    }
    return this.claimsService.update(id, updateData);
  }

  @Post('claims/:id/approve')
  @ApiOperation({ summary: 'Approve claim' })
  @ApiResponse({ status: 200, description: 'Claim approved' })
  approveClaim(@Param('id') id: string, @Body('notes') notes?: string) {
    return this.claimsService.updateStatus(id, 'approved' as any, notes);
  }

  @Post('claims/:id/reject')
  @ApiOperation({ summary: 'Reject claim' })
  @ApiResponse({ status: 200, description: 'Claim rejected' })
  rejectClaim(@Param('id') id: string, @Body('notes') notes?: string) {
    return this.claimsService.updateStatus(id, 'rejected' as any, notes);
  }

  @Post('claims/:id/pay')
  @ApiOperation({ summary: 'Process claim payment' })
  @ApiResponse({ status: 200, description: 'Payment processed' })
  processClaim(@Param('id') id: string) {
    return this.claimsService.processPayment(id);
  }
} 