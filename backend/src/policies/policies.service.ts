import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument, PolicyStatus } from './policy.schema';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy.name) private policyModel: Model<PolicyDocument>,
    private blockchainService: BlockchainService,
    private usersService: UsersService,
  ) {}

  async create(createPolicyDto: CreatePolicyDto, userId: string): Promise<Policy> {
    // Generate unique token ID
    const tokenId = await this.generateTokenId();

    // Create policy NFT on blockchain
    const txHash = await this.blockchainService.mintPolicyNFT(
      userId,
      tokenId,
      createPolicyDto.coverageAmount,
      createPolicyDto.terms,
    );

    const policyData = {
      ...createPolicyDto,
      userId,
      tokenId,
      blockchainTxHash: txHash,
    };

    const createdPolicy = new this.policyModel(policyData);
    const savedPolicy = await createdPolicy.save();

    // Update user's policies array
    await this.usersService.addPolicy(userId, savedPolicy._id.toString());

    return savedPolicy;
  }

  async findAll(userId?: string): Promise<Policy[]> {
    const filter = userId ? { userId } : {};
    return this.policyModel.find(filter).populate('userId').exec();
  }

  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyModel.findById(id).populate('userId').exec();
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    return policy;
  }

  async findByTokenId(tokenId: string): Promise<Policy> {
    const policy = await this.policyModel.findOne({ tokenId }).populate('userId').exec();
    if (!policy) {
      throw new NotFoundException(`Policy with token ID ${tokenId} not found`);
    }
    return policy;
  }

  async findUserPolicies(userId: string): Promise<Policy[]> {
    return this.policyModel.find({ userId }).populate('userId').exec();
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<Policy> {
    const policy = await this.policyModel.findById(id);
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Check if policy can be updated
    if (policy.status === PolicyStatus.EXPIRED || policy.status === PolicyStatus.CLAIMED) {
      throw new BadRequestException('Cannot update expired or claimed policy');
    }

    const updatedPolicy = await this.policyModel
      .findByIdAndUpdate(id, updatePolicyDto, { new: true })
      .populate('userId')
      .exec();

    return updatedPolicy;
  }

  async updateStatus(id: string, status: PolicyStatus): Promise<Policy> {
    const policy = await this.policyModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId')
      .exec();

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return policy;
  }

  async addClaim(policyId: string, claimAmount: number): Promise<Policy> {
    const policy = await this.policyModel.findById(policyId);
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found`);
    }

    const updatedPolicy = await this.policyModel
      .findByIdAndUpdate(
        policyId,
        {
          $inc: {
            claimsCount: 1,
            totalClaimedAmount: claimAmount,
          },
        },
        { new: true }
      )
      .populate('userId')
      .exec();

    return updatedPolicy;
  }

  async checkExpiredPolicies(): Promise<void> {
    const expiredPolicies = await this.policyModel.find({
      endDate: { $lt: new Date() },
      status: PolicyStatus.ACTIVE,
    });

    for (const policy of expiredPolicies) {
      await this.updateStatus(policy._id.toString(), PolicyStatus.EXPIRED);
    }
  }

  async transferPolicy(tokenId: string, fromUserId: string, toUserId: string): Promise<Policy> {
    const policy = await this.policyModel.findOne({ tokenId });
    if (!policy) {
      throw new NotFoundException(`Policy with token ID ${tokenId} not found`);
    }

    if (!policy.isTransferable) {
      throw new BadRequestException('This policy is not transferable');
    }

    if (policy.userId.toString() !== fromUserId) {
      throw new BadRequestException('You do not own this policy');
    }

    // Transfer NFT on blockchain
    await this.blockchainService.transferPolicyNFT(tokenId, fromUserId, toUserId);

    // Update policy ownership
    const updatedPolicy = await this.policyModel
      .findByIdAndUpdate(policy._id, { userId: toUserId }, { new: true })
      .populate('userId')
      .exec();

    return updatedPolicy;
  }

  private async generateTokenId(): Promise<string> {
    const count = await this.policyModel.countDocuments();
    return (count + 1).toString();
  }

  async remove(id: string): Promise<void> {
    const result = await this.policyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
  }
} 