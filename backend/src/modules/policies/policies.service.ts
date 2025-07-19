import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger(PoliciesService.name);

  async findAll(pagination: { page: number; limit: number }) {
    const mockPolicies = [
      {
        id: 'pol_1',
        userId: 'user_1',
        type: 'health',
        status: 'active',
        coverageAmount: '50000',
        premiumAmount: '150',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        nftTokenId: '1',
        createdAt: new Date().toISOString(),
      },
    ];

    const { page, limit } = pagination;
    return {
      policies: mockPolicies,
      total: mockPolicies.length,
      page,
      limit,
      totalPages: Math.ceil(mockPolicies.length / limit),
    };
  }

  async findOne(id: string) {
    return {
      id,
      userId: 'user_1',
      type: 'health',
      status: 'active',
      coverageAmount: '50000',
      premiumAmount: '150',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      nftTokenId: '1',
      terms: { deductible: '500', maxClaim: '10000' },
      metadata: { riskScore: 'low' },
      createdAt: new Date().toISOString(),
    };
  }

  async create(policyData: any) {
    this.logger.log(`Creating policy for user: ${policyData.userId}`);
    return {
      success: true,
      policy: { id: `pol_${Date.now()}`, ...policyData },
      message: 'Policy created successfully',
    };
  }

  async update(id: string, policyData: any) {
    return { success: true, id, message: 'Policy updated successfully' };
  }

  async remove(id: string) {
    return { success: true, id, message: 'Policy deleted successfully' };
  }

  async getAvailableTypes() {
    return {
      types: [
        { id: 'health', name: 'Health Insurance', basePremium: 150, description: 'Comprehensive health coverage' },
        { id: 'vehicle', name: 'Vehicle Insurance', basePremium: 200, description: 'Auto insurance coverage' },
        { id: 'travel', name: 'Travel Insurance', basePremium: 50, description: 'Travel protection' },
        { id: 'pet', name: 'Pet Insurance', basePremium: 75, description: 'Pet health coverage' },
      ],
    };
  }

  async getQuote(quoteData: any) {
    return {
      quote: {
        type: quoteData.type,
        coverageAmount: quoteData.coverageAmount,
        premiumAmount: (parseFloat(quoteData.coverageAmount) * 0.003).toString(),
        estimatedPayout: '30 seconds',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }
} 