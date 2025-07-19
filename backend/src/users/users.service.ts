import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ walletAddress: createUserDto.walletAddress })
      .exec();

    if (existingUser) {
      return existingUser;
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('policies').populate('claims').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('policies')
      .populate('claims')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.userModel
      .findOne({ walletAddress })
      .populate('policies')
      .populate('claims')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('policies')
      .populate('claims')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async addPolicy(userId: string, policyId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { policies: policyId } },
        { new: true }
      )
      .exec();
  }

  async addClaim(userId: string, claimId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { claims: claimId } },
        { new: true }
      )
      .exec();
  }

  async updateRiskScore(userId: string, riskScore: number): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { riskScore }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
} 