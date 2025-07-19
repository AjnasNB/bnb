import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateWalletSignature(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  async login(walletAddress: string, signature: string, message: string) {
    const isValidSignature = await this.validateWalletSignature(
      walletAddress,
      signature,
      message,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid wallet signature');
    }

    // Find or create user
    let user;
    try {
      user = await this.usersService.findByWalletAddress(walletAddress);
    } catch (error) {
      // User doesn't exist, this is handled in the controller
      throw new UnauthorizedException('User not found. Please register first.');
    }

    // Update last login
    await this.usersService.updateLastLogin(user._id);

    const payload = { 
      sub: user._id, 
      walletAddress: user.walletAddress,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async register(
    createUserDto: CreateUserDto,
    signature: string,
    message: string,
  ) {
    const isValidSignature = await this.validateWalletSignature(
      createUserDto.walletAddress,
      signature,
      message,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid wallet signature');
    }

    const user = await this.usersService.create(createUserDto);

    const payload = { 
      sub: user._id, 
      walletAddress: user.walletAddress,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async validateUser(payload: any) {
    return this.usersService.findOne(payload.sub);
  }
} 