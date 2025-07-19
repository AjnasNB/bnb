import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findAll(pagination: { page: number; limit: number }) {
    // Mock data - in real implementation, fetch from database
    const mockUsers = [
      {
        id: '1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        walletAddress: '0x742d35Cc9A9A2A3B9b1C53B59FF75aC8A24B23c0',
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'sarah.smith@example.com',
        firstName: 'Sarah',
        lastName: 'Smith',
        walletAddress: '0x8ba1f109551bD432803012645Hac136c20F0288e',
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      users: mockUsers.slice(startIndex, endIndex),
      total: mockUsers.length,
      page,
      limit,
      totalPages: Math.ceil(mockUsers.length / limit),
    };
  }

  async findOne(id: string) {
    return {
      id,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      walletAddress: '0x742d35Cc9A9A2A3B9b1C53B59FF75aC8A24B23c0',
      isActive: true,
      isVerified: true,
      avatar: null,
      phone: null,
      preferences: {
        notifications: { email: true, push: true },
        currency: 'USD',
        language: 'en',
      },
      createdAt: new Date().toISOString(),
    };
  }

  async create(userData: any) {
    this.logger.log(`Creating user: ${userData.email}`);
    
    const user = {
      id: `user_${Date.now()}`,
      ...userData,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      user,
      message: 'User created successfully',
    };
  }

  async update(id: string, userData: any) {
    this.logger.log(`Updating user: ${id}`);
    
    return {
      success: true,
      id,
      updatedData: userData,
      message: 'User updated successfully',
    };
  }

  async remove(id: string) {
    this.logger.log(`Deleting user: ${id}`);
    
    return {
      success: true,
      id,
      message: 'User deleted successfully',
    };
  }

  async getUserPolicies(userId: string) {
    return {
      userId,
      policies: [
        {
          id: 'pol_1',
          type: 'health',
          status: 'active',
          coverageAmount: '50000',
          premiumAmount: '150',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          nftTokenId: '1',
        },
        {
          id: 'pol_2',
          type: 'vehicle',
          status: 'active',
          coverageAmount: '25000',
          premiumAmount: '200',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          nftTokenId: '2',
        },
      ],
      total: 2,
    };
  }

  async getUserClaims(userId: string) {
    return {
      userId,
      claims: [
        {
          id: 'claim_1',
          policyId: 'pol_1',
          type: 'health',
          status: 'approved',
          requestedAmount: '1250',
          approvedAmount: '1250',
          description: 'Emergency room visit',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'claim_2',
          policyId: 'pol_2',
          type: 'vehicle',
          status: 'under_review',
          requestedAmount: '3500',
          approvedAmount: null,
          description: 'Accident damage repair',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      total: 2,
    };
  }
} 