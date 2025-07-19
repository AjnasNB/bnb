import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { ContractService } from './contract.service';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly contractService: ContractService,
  ) {}

  @Get('network-info')
  @ApiOperation({ summary: 'Get network information' })
  async getNetworkInfo() {
    return this.blockchainService.getNetworkInfo();
  }

  @Get('contract-addresses')
  @ApiOperation({ summary: 'Get deployed contract addresses' })
  async getContractAddresses() {
    return this.contractService.getContractAddresses();
  }

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@Param('address') address: string) {
    return this.blockchainService.getBalance(address);
  }

  @Get('token-balances/:address')
  @ApiOperation({ summary: 'Get token balances for address' })
  async getTokenBalances(@Param('address') address: string) {
    return this.contractService.getTokenBalances(address);
  }

  @Post('create-policy')
  @ApiOperation({ summary: 'Create new policy on blockchain' })
  async createPolicy(@Body() policyData: any) {
    return this.contractService.createPolicy(policyData);
  }

  @Post('submit-claim')
  @ApiOperation({ summary: 'Submit claim to blockchain' })
  async submitClaim(@Body() claimData: any) {
    return this.contractService.submitClaim(claimData);
  }

  @Post('stake-tokens')
  @ApiOperation({ summary: 'Stake governance tokens' })
  async stakeTokens(@Body() stakeData: { amount: string; userAddress: string }) {
    return this.contractService.stakeTokens(stakeData.amount, stakeData.userAddress);
  }

  @Get('policy/:tokenId')
  @ApiOperation({ summary: 'Get policy details from blockchain' })
  async getPolicyDetails(@Param('tokenId') tokenId: string) {
    return this.contractService.getPolicyDetails(tokenId);
  }

  @Get('claim/:claimId')
  @ApiOperation({ summary: 'Get claim details from blockchain' })
  async getClaimDetails(@Param('claimId') claimId: string) {
    return this.contractService.getClaimDetails(claimId);
  }

  @Get('transactions/:address')
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactionHistory(@Param('address') address: string) {
    return this.blockchainService.getTransactionHistory(address);
  }

  @Post('verify-transaction')
  @ApiOperation({ summary: 'Verify transaction status' })
  async verifyTransaction(@Body() data: { txHash: string }) {
    return this.blockchainService.verifyTransaction(data.txHash);
  }

  @Get('governance/proposals')
  @ApiOperation({ summary: 'Get governance proposals' })
  async getProposals() {
    return this.contractService.getGovernanceProposals();
  }

  @Post('governance/vote')
  @ApiOperation({ summary: 'Vote on proposal' })
  async voteOnProposal(@Body() voteData: any) {
    return this.contractService.voteOnProposal(voteData);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check blockchain service health' })
  async healthCheck() {
    return this.blockchainService.healthCheck();
  }
} 