import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('blockchain')
@Controller('blockchain')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('network-info')
  @ApiOperation({ summary: 'Get blockchain network information' })
  @ApiResponse({ status: 200, description: 'Network information retrieved' })
  getNetworkInfo() {
    return this.blockchainService.getNetworkInfo();
  }

  @Get('policy/:tokenId')
  @ApiOperation({ summary: 'Get policy details from blockchain' })
  @ApiResponse({ status: 200, description: 'Policy details retrieved' })
  getPolicyDetails(@Param('tokenId') tokenId: string) {
    return this.blockchainService.getPolicyDetails(tokenId);
  }

  @Get('claim/:claimId')
  @ApiOperation({ summary: 'Get claim details from blockchain' })
  @ApiResponse({ status: 200, description: 'Claim details retrieved' })
  getClaimDetails(@Param('claimId') claimId: string) {
    return this.blockchainService.getClaimDetails(claimId);
  }

  @Get('user/:address/policies')
  @ApiOperation({ summary: 'Get user policy count from blockchain' })
  @ApiResponse({ status: 200, description: 'Policy count retrieved' })
  getUserPolicyCount(@Param('address') address: string) {
    return this.blockchainService.getUserPolicyCount(address);
  }

  @Post('estimate-gas')
  @ApiOperation({ summary: 'Estimate gas for a transaction' })
  @ApiResponse({ status: 200, description: 'Gas estimation provided' })
  estimateGas(
    @Body('method') method: string,
    @Body('params') params: any[],
  ) {
    return this.blockchainService.estimateGas(method, params);
  }

  @Post('external-data')
  @ApiOperation({ summary: 'Fetch external data via oracles' })
  @ApiResponse({ status: 200, description: 'External data retrieved' })
  getExternalData(
    @Body('dataType') dataType: string,
    @Body('parameters') parameters: any,
  ) {
    return this.blockchainService.getExternalData(dataType, parameters);
  }

  @Post('transfer-policy')
  @ApiOperation({ summary: 'Transfer policy NFT' })
  @ApiResponse({ status: 200, description: 'Policy transferred successfully' })
  transferPolicy(
    @Body('tokenId') tokenId: string,
    @Body('fromAddress') fromAddress: string,
    @Body('toAddress') toAddress: string,
  ) {
    return this.blockchainService.transferPolicyNFT(tokenId, fromAddress, toAddress);
  }

  @Post('submit-claim')
  @ApiOperation({ summary: 'Submit claim to blockchain' })
  @ApiResponse({ status: 200, description: 'Claim submitted successfully' })
  submitClaim(
    @Body('policyTokenId') policyTokenId: string,
    @Body('amount') amount: number,
    @Body('aiScoreHash') aiScoreHash: string,
  ) {
    return this.blockchainService.submitClaim(policyTokenId, amount, aiScoreHash);
  }
} 