import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Claim, ClaimDocument, ClaimStatus } from './claim.schema';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { PoliciesService } from '../policies/policies.service';
import { UsersService } from '../users/users.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { PolicyDocument } from '../policies/policy.schema';
import { UserDocument } from '../users/user.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface AIAnalysisResponse {
  fraudScore: number;
  authenticityScore: number;
  estimatedAmount: number;
  confidence: number;
  detectedIssues: string[];
  ocrResults?: any;
  imageAnalysis?: any;
}

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    private policiesService: PoliciesService,
    private usersService: UsersService,
    private blockchainService: BlockchainService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(createClaimDto: CreateClaimDto, userId: string): Promise<Claim> {
    // Verify policy exists and belongs to user
    const policy = await this.policiesService.findOne(createClaimDto.policyId);
    if (policy.userId.toString() !== userId) {
      throw new BadRequestException('Policy does not belong to the user');
    }

    // Generate unique claim number
    const claimNumber = await this.generateClaimNumber();

    const claimData = {
      ...createClaimDto,
      userId,
      claimNumber,
      reportedDate: new Date(),
    };

    const createdClaim = new this.claimModel(claimData);
    const savedClaim = await createdClaim.save();

    // Update user's claims array
    await this.usersService.addClaim(userId, savedClaim._id.toString());

    // Trigger AI analysis if documents/images are provided
    if (createClaimDto.documents?.length || createClaimDto.images?.length) {
      this.processWithAI(savedClaim._id.toString()).catch(console.error);
    }

    return savedClaim;
  }

  async findAll(userId?: string): Promise<Claim[]> {
    const filter = userId ? { userId } : {};
    return this.claimModel
      .find(filter)
      .populate('userId')
      .populate('policyId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel
      .findById(id)
      .populate('userId')
      .populate('policyId')
      .exec();
    
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    
    return claim;
  }

  async findUserClaims(userId: string): Promise<Claim[]> {
    return this.claimModel
      .find({ userId })
      .populate('userId')
      .populate('policyId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByClaimNumber(claimNumber: string): Promise<Claim> {
    const claim = await this.claimModel
      .findOne({ claimNumber })
      .populate('userId')
      .populate('policyId')
      .exec();
    
    if (!claim) {
      throw new NotFoundException(`Claim with number ${claimNumber} not found`);
    }
    
    return claim;
  }

  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<Claim> {
    const claim = await this.claimModel.findById(id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    // Check if claim can be updated
    if (claim.status === ClaimStatus.PAID || claim.status === ClaimStatus.REJECTED) {
      throw new BadRequestException('Cannot update finalized claim');
    }

    const updatedClaim = await this.claimModel
      .findByIdAndUpdate(id, updateClaimDto, { new: true })
      .populate('userId')
      .populate('policyId')
      .exec();

    return updatedClaim;
  }

  async updateStatus(id: string, status: ClaimStatus, adminNotes?: string): Promise<Claim> {
    const updateData: any = { status };
    
    if (adminNotes) {
      updateData['humanReview.notes'] = adminNotes;
      updateData['humanReview.reviewDate'] = new Date();
    }

    const claim = await this.claimModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId')
      .populate('policyId')
      .exec();

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    // If approved, trigger blockchain payment
    if (status === ClaimStatus.APPROVED && claim.approvedAmount > 0) {
      this.processPayment(id).catch(console.error);
    }

    return claim;
  }

  async processWithAI(claimId: string): Promise<void> {
    const claim = await this.findOne(claimId);
    
    try {
      const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL');
      const aiApiKey = this.configService.get<string>('AI_SERVICE_API_KEY');

      const aiRequest = {
        claimId: claim._id,
        claimType: claim.type,
        documents: claim.documents,
        images: claim.images,
        requestedAmount: claim.requestedAmount,
        description: claim.description,
      };

      const response: AxiosResponse<AIAnalysisResponse> = await firstValueFrom(
        this.httpService.post(`${aiServiceUrl}/analyze-claim`, aiRequest, {
          headers: {
            'Authorization': `Bearer ${aiApiKey}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const aiAnalysis = response.data;

      // Update claim with AI analysis
      await this.claimModel.findByIdAndUpdate(claimId, {
        aiAnalysis,
        status: aiAnalysis.fraudScore > 0.7 ? ClaimStatus.AI_REJECTED : ClaimStatus.AI_VALIDATED,
        approvedAmount: Math.min(aiAnalysis.estimatedAmount, claim.requestedAmount),
      });

      console.log(`AI analysis completed for claim ${claim.claimNumber}`);
    } catch (error) {
      console.error(`AI analysis failed for claim ${claim.claimNumber}:`, error);
      // Set status to under review if AI fails
      await this.claimModel.findByIdAndUpdate(claimId, {
        status: ClaimStatus.UNDER_REVIEW,
      });
    }
  }

  async processPayment(claimId: string): Promise<void> {
    const claim = await this.findOne(claimId);
    
    if (claim.status !== ClaimStatus.APPROVED) {
      throw new BadRequestException('Claim must be approved before payment');
    }

    try {
      // Process payment through smart contract
      const txHash = await this.blockchainService.processClaimPayment(
        claim.policyId.toString(),
        claim.approvedAmount,
        claim.userId.toString(),
      );

      // Update claim with payment transaction
      await this.claimModel.findByIdAndUpdate(claimId, {
        status: ClaimStatus.PAID,
        paymentTxHash: txHash,
      });

      // Update policy with claim information
      await this.policiesService.addClaim(
        claim.policyId.toString(),
        claim.approvedAmount,
      );

      console.log(`Payment processed for claim ${claim.claimNumber}, tx: ${txHash}`);
    } catch (error) {
      console.error(`Payment failed for claim ${claim.claimNumber}:`, error);
      throw error;
    }
  }

  async getClaimStatistics(userId?: string): Promise<any> {
    const filter = userId ? { userId } : {};
    
    const totalClaims = await this.claimModel.countDocuments(filter);
    const pendingClaims = await this.claimModel.countDocuments({
      ...filter,
      status: { $in: [ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.AI_VALIDATED] },
    });
    const approvedClaims = await this.claimModel.countDocuments({
      ...filter,
      status: ClaimStatus.APPROVED,
    });
    const paidClaims = await this.claimModel.countDocuments({
      ...filter,
      status: ClaimStatus.PAID,
    });

    const totalPaidAmount = await this.claimModel.aggregate([
      { $match: { ...filter, status: ClaimStatus.PAID } },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } },
    ]);

    return {
      totalClaims,
      pendingClaims,
      approvedClaims,
      paidClaims,
      totalPaidAmount: totalPaidAmount[0]?.total || 0,
      approvalRate: totalClaims > 0 ? (approvedClaims + paidClaims) / totalClaims : 0,
    };
  }

  private async generateClaimNumber(): Promise<string> {
    const count = await this.claimModel.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `CL${year}${month}${String(count + 1).padStart(6, '0')}`;
  }

  async remove(id: string): Promise<void> {
    const result = await this.claimModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
  }
} 