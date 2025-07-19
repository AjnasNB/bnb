import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppConfig } from '../../config/app.config';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private contracts: { [key: string]: ethers.Contract } = {};

  constructor(private readonly blockchainService: BlockchainService) {
    this.initializeContracts();
  }

  private async initializeContracts() {
    try {
      const provider = this.blockchainService.getProvider();
      
      // Load contract ABIs (simplified - in production, load from files)
      const erc20Abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
      ];

      const erc721Abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function approve(address to, uint256 tokenId)",
        "function getApproved(uint256 tokenId) view returns (address)",
        "function setApprovalForAll(address operator, bool approved)",
        "function isApprovedForAll(address owner, address operator) view returns (bool)",
        "function transferFrom(address from, address to, uint256 tokenId)",
        "function safeTransferFrom(address from, address to, uint256 tokenId)"
      ];

      // Initialize contract instances
      this.contracts.stablecoin = new ethers.Contract(
        AppConfig.contracts.stablecoin,
        erc20Abi,
        provider
      );

      this.contracts.governanceToken = new ethers.Contract(
        AppConfig.contracts.governanceToken,
        erc20Abi,
        provider
      );

      this.contracts.policyNFT = new ethers.Contract(
        AppConfig.contracts.policyNFT,
        erc721Abi,
        provider
      );

      this.logger.log('Smart contracts initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize contracts: ${error.message}`);
    }
  }

  getContractAddresses() {
    return {
      network: AppConfig.blockchain.network,
      chainId: AppConfig.blockchain.chainId,
      addresses: AppConfig.contracts,
      explorerUrls: {
        stablecoin: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.stablecoin}`,
        governanceToken: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.governanceToken}`,
        policyNFT: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.policyNFT}`,
        claimsEngine: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.claimsEngine}`,
        surplusDistributor: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.surplusDistributor}`,
        governance: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.governance}`,
      },
    };
  }

  async getTokenBalances(address: string) {
    try {
      const [stablecoinBalance, governanceBalance, policyBalance] = await Promise.all([
        this.contracts.stablecoin.balanceOf(address),
        this.contracts.governanceToken.balanceOf(address),
        this.contracts.policyNFT.balanceOf(address),
      ]);

      const [stablecoinInfo, governanceInfo, policyInfo] = await Promise.all([
        this.getTokenInfo('stablecoin'),
        this.getTokenInfo('governanceToken'),
        this.getTokenInfo('policyNFT'),
      ]);

      return {
        address,
        balances: {
          stablecoin: {
            balance: ethers.formatEther(stablecoinBalance),
            balanceWei: stablecoinBalance.toString(),
            ...stablecoinInfo,
          },
          governanceToken: {
            balance: ethers.formatEther(governanceBalance),
            balanceWei: governanceBalance.toString(),
            ...governanceInfo,
          },
          policyNFT: {
            balance: policyBalance.toString(),
            ...policyInfo,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get token balances for ${address}: ${error.message}`);
      throw error;
    }
  }

  private async getTokenInfo(contractKey: string) {
    try {
      const contract = this.contracts[contractKey];
      const [name, symbol] = await Promise.all([
        contract.name(),
        contract.symbol(),
      ]);

      const result: any = { name, symbol };

      // Add total supply for ERC20 tokens
      if (contractKey !== 'policyNFT') {
        const totalSupply = await contract.totalSupply();
        result.totalSupply = ethers.formatEther(totalSupply);
        result.totalSupplyWei = totalSupply.toString();
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to get token info for ${contractKey}: ${error.message}`);
      return {
        name: 'Unknown',
        symbol: 'UNKNOWN',
        totalSupply: '0',
      };
    }
  }

  async createPolicy(policyData: any) {
    try {
      // This would typically require a signer with private key
      // For now, return a mock response
      this.logger.log(`Creating policy for ${policyData.holder}`);
      
      return {
        success: true,
        message: 'Policy creation initiated',
        policyData,
        estimatedGas: '150000',
        contractAddress: AppConfig.contracts.policyNFT,
        note: 'This requires wallet connection to complete the transaction'
      };
    } catch (error) {
      this.logger.error(`Failed to create policy: ${error.message}`);
      throw error;
    }
  }

  async submitClaim(claimData: any) {
    try {
      this.logger.log(`Submitting claim ${claimData.claimId}`);
      
      return {
        success: true,
        message: 'Claim submission initiated',
        claimData,
        estimatedGas: '120000',
        contractAddress: AppConfig.contracts.claimsEngine,
        note: 'This requires wallet connection to complete the transaction'
      };
    } catch (error) {
      this.logger.error(`Failed to submit claim: ${error.message}`);
      throw error;
    }
  }

  async stakeTokens(amount: string, userAddress: string) {
    try {
      this.logger.log(`Staking ${amount} tokens for ${userAddress}`);
      
      return {
        success: true,
        message: 'Token staking initiated',
        amount,
        userAddress,
        estimatedGas: '100000',
        contractAddress: AppConfig.contracts.governanceToken,
        note: 'This requires wallet connection to complete the transaction'
      };
    } catch (error) {
      this.logger.error(`Failed to stake tokens: ${error.message}`);
      throw error;
    }
  }

  async getPolicyDetails(tokenId: string) {
    try {
      const owner = await this.contracts.policyNFT.ownerOf(tokenId);
      
      return {
        tokenId,
        owner,
        contractAddress: AppConfig.contracts.policyNFT,
        explorerUrl: `${AppConfig.blockchain.explorerUrl}/token/${AppConfig.contracts.policyNFT}?a=${tokenId}`,
        // Additional policy details would be fetched from the contract
        details: {
          active: true,
          coverageAmount: 'TBD', // Would fetch from contract
          premiumPaid: 'TBD',
          expiryDate: 'TBD',
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get policy details for token ${tokenId}: ${error.message}`);
      return {
        tokenId,
        error: error.message,
        exists: false,
      };
    }
  }

  async getClaimDetails(claimId: string) {
    try {
      // Mock implementation - would fetch from claims engine contract
      return {
        claimId,
        status: 'under_review',
        contractAddress: AppConfig.contracts.claimsEngine,
        explorerUrl: `${AppConfig.blockchain.explorerUrl}/address/${AppConfig.contracts.claimsEngine}`,
        details: {
          submittedAt: new Date().toISOString(),
          amount: 'TBD',
          claimType: 'TBD',
          evidenceHashes: [],
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get claim details for ${claimId}: ${error.message}`);
      throw error;
    }
  }

  async getGovernanceProposals() {
    try {
      // Mock implementation - would fetch from governance contract
      return {
        proposals: [
          {
            id: '1',
            title: 'Increase Coverage Limits',
            description: 'Proposal to increase maximum coverage limits for health insurance',
            status: 'active',
            votesFor: '150000',
            votesAgainst: '50000',
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ],
        contractAddress: AppConfig.contracts.governance,
        totalProposals: 1,
      };
    } catch (error) {
      this.logger.error(`Failed to get governance proposals: ${error.message}`);
      throw error;
    }
  }

  async voteOnProposal(voteData: any) {
    try {
      this.logger.log(`Voting on proposal ${voteData.proposalId} by ${voteData.voter}`);
      
      return {
        success: true,
        message: 'Vote submission initiated',
        voteData,
        estimatedGas: '80000',
        contractAddress: AppConfig.contracts.governance,
        note: 'This requires wallet connection to complete the transaction'
      };
    } catch (error) {
      this.logger.error(`Failed to vote on proposal: ${error.message}`);
      throw error;
    }
  }

  async healthCheck() {
    try {
      // Test contract connectivity
      const [stablecoinName, governanceName, policyName] = await Promise.all([
        this.contracts.stablecoin.name().catch(() => 'Connection Failed'),
        this.contracts.governanceToken.name().catch(() => 'Connection Failed'),
        this.contracts.policyNFT.name().catch(() => 'Connection Failed'),
      ]);

      return {
        status: 'healthy',
        contracts: {
          stablecoin: {
            address: AppConfig.contracts.stablecoin,
            name: stablecoinName,
            connected: stablecoinName !== 'Connection Failed',
          },
          governanceToken: {
            address: AppConfig.contracts.governanceToken,
            name: governanceName,
            connected: governanceName !== 'Connection Failed',
          },
          policyNFT: {
            address: AppConfig.contracts.policyNFT,
            name: policyName,
            connected: policyName !== 'Connection Failed',
          },
        },
        network: AppConfig.blockchain.network,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Contract health check failed: ${error.message}`);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
} 