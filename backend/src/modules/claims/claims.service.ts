import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaimsService {
  async findAll() {
    return {
      claims: [
        {
          id: 'claim_1',
          userId: 'user_1',
          policyId: 'pol_1',
          type: 'health',
          status: 'approved',
          requestedAmount: '1250',
          description: 'Emergency room visit',
        },
      ],
    };
  }

  async findOne(id: string) {
    return {
      id,
      userId: 'user_1',
      policyId: 'pol_1',
      type: 'health',
      status: 'approved',
      requestedAmount: '1250',
      description: 'Emergency room visit',
    };
  }

  async create(claimData: any) {
    return {
      success: true,
      claim: { id: `claim_${Date.now()}`, ...claimData },
    };
  }
} 