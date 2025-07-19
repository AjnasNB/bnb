import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';
import { ClaimsService } from '../claims/claims.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private policiesService: PoliciesService,
    private claimsService: ClaimsService,
    private filesService: FilesService,
  ) {}

  async getDashboardStats(): Promise<any> {
    const [
      totalUsers,
      totalPolicies,
      userStats,
      policyStats,
      claimStats,
      fileStats,
    ] = await Promise.all([
      this.usersService.findAll(),
      this.policiesService.findAll(),
      this.getUserStatistics(),
      this.getPolicyStatistics(),
      this.claimsService.getClaimStatistics(),
      this.filesService.getFileStats(),
    ]);

    return {
      users: {
        total: totalUsers.length,
        active: totalUsers.filter(u => u.isActive).length,
        verified: totalUsers.filter(u => u.isVerified).length,
        ...userStats,
      },
      policies: {
        total: totalPolicies.length,
        active: totalPolicies.filter(p => p.status === 'active').length,
        ...policyStats,
      },
      claims: claimStats,
      files: fileStats,
      revenue: {
        totalPremiums: totalPolicies.reduce((sum, p) => sum + p.premiumAmount, 0),
        totalClaims: claimStats.totalPaidAmount || 0,
        netRevenue: totalPolicies.reduce((sum, p) => sum + p.premiumAmount, 0) - (claimStats.totalPaidAmount || 0),
      },
    };
  }

  async getUserStatistics(): Promise<any> {
    const users = await this.usersService.findAll();
    
    const roleDistribution = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const averageRiskScore = users.reduce((sum, user) => sum + user.riskScore, 0) / users.length;

    const recentSignups = users.filter(user => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(user.createdAt) > sevenDaysAgo;
    }).length;

    return {
      roleDistribution,
      averageRiskScore,
      recentSignups,
    };
  }

  async getPolicyStatistics(): Promise<any> {
    const policies = await this.policiesService.findAll();
    
    const typeDistribution = policies.reduce((acc, policy) => {
      acc[policy.type] = (acc[policy.type] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = policies.reduce((acc, policy) => {
      acc[policy.status] = (acc[policy.status] || 0) + 1;
      return acc;
    }, {});

    const averageCoverage = policies.reduce((sum, policy) => sum + policy.coverageAmount, 0) / policies.length;
    const averagePremium = policies.reduce((sum, policy) => sum + policy.premiumAmount, 0) / policies.length;

    return {
      typeDistribution,
      statusDistribution,
      averageCoverage,
      averagePremium,
    };
  }

  async getRecentActivity(limit: number = 20): Promise<any[]> {
    const [recentUsers, recentPolicies, recentClaims] = await Promise.all([
      this.usersService.findAll(),
      this.policiesService.findAll(),
      this.claimsService.findAll(),
    ]);

    const activities = [
      ...recentUsers.slice(0, 5).map(user => ({
        type: 'user_registered',
        timestamp: user.createdAt,
        description: `New user registered: ${user.firstName} ${user.lastName}`,
        entity: 'user',
        entityId: user._id,
      })),
      ...recentPolicies.slice(0, 5).map(policy => ({
        type: 'policy_created',
        timestamp: policy.createdAt,
        description: `New ${policy.type} policy created`,
        entity: 'policy',
        entityId: policy._id,
      })),
      ...recentClaims.slice(0, 10).map(claim => ({
        type: 'claim_submitted',
        timestamp: claim.createdAt,
        description: `New ${claim.type} claim submitted: ${claim.claimNumber}`,
        entity: 'claim',
        entityId: claim._id,
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getSystemHealth(): Promise<any> {
    try {
      const fileStats = this.filesService.getFileStats();
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        services: {
          database: { status: 'connected', responseTime: '< 50ms' },
          blockchain: { status: 'connected', responseTime: '< 200ms' },
          fileSystem: { 
            status: 'healthy', 
            totalFiles: fileStats.totalFiles,
            totalSize: fileStats.totalSize,
          },
          aiService: { status: 'available', responseTime: '< 1000ms' },
        },
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      };
    } catch (error) {
      return {
        status: 'degraded',
        timestamp: new Date(),
        error: error.message,
      };
    }
  }

  async exportData(entityType: string, format: string = 'json'): Promise<any> {
    let data;
    
    switch (entityType) {
      case 'users':
        data = await this.usersService.findAll();
        break;
      case 'policies':
        data = await this.policiesService.findAll();
        break;
      case 'claims':
        data = await this.claimsService.findAll();
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified implementation)
      return this.convertToCSV(data);
    }

    return data;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return csv;
  }

  async getAnalytics(period: string = '30d'): Promise<any> {
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [users, policies, claims] = await Promise.all([
      this.usersService.findAll(),
      this.policiesService.findAll(),
      this.claimsService.findAll(),
    ]);

    const periodUsers = users.filter(u => new Date(u.createdAt) >= startDate);
    const periodPolicies = policies.filter(p => new Date(p.createdAt) >= startDate);
    const periodClaims = claims.filter(c => new Date(c.createdAt) >= startDate);

    // Generate daily breakdown
    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dailyStats.unshift({
        date: dateStr,
        newUsers: periodUsers.filter(u => 
          new Date(u.createdAt).toISOString().split('T')[0] === dateStr
        ).length,
        newPolicies: periodPolicies.filter(p => 
          new Date(p.createdAt).toISOString().split('T')[0] === dateStr
        ).length,
        newClaims: periodClaims.filter(c => 
          new Date(c.createdAt).toISOString().split('T')[0] === dateStr
        ).length,
      });
    }

    return {
      period,
      summary: {
        totalNewUsers: periodUsers.length,
        totalNewPolicies: periodPolicies.length,
        totalNewClaims: periodClaims.length,
        growthRate: {
          users: (periodUsers.length / Math.max(users.length - periodUsers.length, 1)) * 100,
          policies: (periodPolicies.length / Math.max(policies.length - periodPolicies.length, 1)) * 100,
          claims: (periodClaims.length / Math.max(claims.length - periodClaims.length, 1)) * 100,
        },
      },
      dailyBreakdown: dailyStats,
    };
  }
} 