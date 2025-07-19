import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

// Smart contract ABIs (simplified for demo)
const INSURANCE_CONTRACT_ABI = [
  'function mintPolicy(address to, uint256 tokenId, uint256 coverageAmount, string memory terms) external returns (bool)',
  'function transferPolicy(uint256 tokenId, address to) external returns (bool)',
  'function submitClaim(uint256 policyTokenId, uint256 amount, bytes32 aiScoreHash) external returns (uint256)',
  'function approveClaim(uint256 claimId, uint256 amount) external returns (bool)',
  'function processClaim(uint256 claimId) external returns (bool)',
  'function getPolicyDetails(uint256 tokenId) external view returns (tuple(address owner, uint256 coverage, bool active))',
  'function getClaimDetails(uint256 claimId) external view returns (tuple(uint256 policyId, uint256 amount, uint8 status))',
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'event PolicyMinted(address indexed owner, uint256 indexed tokenId, uint256 coverage)',
  'event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, uint256 amount)',
  'event ClaimProcessed(uint256 indexed claimId, uint256 amount, address recipient)',
];

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private insuranceContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    try {
      // Initialize provider
      const rpcUrl = this.configService.get<string>('BSC_TESTNET_RPC_URL');
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize wallet
      const privateKey = this.configService.get<string>('DEPLOYER_PRIVATE_KEY');
      this.wallet = new ethers.Wallet(privateKey, this.provider);

      // Initialize contract
      const contractAddress = this.configService.get<string>('INSURANCE_CONTRACT_ADDRESS');
      if (contractAddress && contractAddress !== '0x...') {
        this.insuranceContract = new ethers.Contract(
          contractAddress,
          INSURANCE_CONTRACT_ABI,
          this.wallet,
        );
      }

      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
    }
  }

  async mintPolicyNFT(
    userAddress: string,
    tokenId: string,
    coverageAmount: number,
    terms: string,
  ): Promise<string> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const tx = await this.insuranceContract.mintPolicy(
        userAddress,
        tokenId,
        coverageAmount.toString(),
        terms,
        {
          gasLimit: 500000,
        },
      );

      await tx.wait();
      this.logger.log(`Policy NFT minted: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      this.logger.error('Failed to mint policy NFT:', error);
      throw error;
    }
  }

  async transferPolicyNFT(
    tokenId: string,
    fromAddress: string,
    toAddress: string,
  ): Promise<string> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      // Verify ownership
      const owner = await this.insuranceContract.ownerOf(tokenId);
      if (owner.toLowerCase() !== fromAddress.toLowerCase()) {
        throw new Error('Sender does not own this policy');
      }

      const tx = await this.insuranceContract.transferPolicy(tokenId, toAddress, {
        gasLimit: 300000,
      });

      await tx.wait();
      this.logger.log(`Policy transferred: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      this.logger.error('Failed to transfer policy NFT:', error);
      throw error;
    }
  }

  async submitClaim(
    policyTokenId: string,
    amount: number,
    aiScoreHash: string,
  ): Promise<string> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const scoreHashBytes = ethers.keccak256(ethers.toUtf8Bytes(aiScoreHash));

      const tx = await this.insuranceContract.submitClaim(
        policyTokenId,
        amount.toString(),
        scoreHashBytes,
        {
          gasLimit: 400000,
        },
      );

      await tx.wait();
      this.logger.log(`Claim submitted: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      this.logger.error('Failed to submit claim:', error);
      throw error;
    }
  }

  async processClaimPayment(
    policyId: string,
    amount: number,
    recipientAddress: string,
  ): Promise<string> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      // For demo purposes, we'll use a simple transfer
      // In production, this would involve more complex claim processing logic
      const tx = await this.wallet.sendTransaction({
        to: recipientAddress,
        value: amount.toString(),
        gasLimit: 21000,
      });

      await tx.wait();
      this.logger.log(`Claim payment processed: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      this.logger.error('Failed to process claim payment:', error);
      throw error;
    }
  }

  async getPolicyDetails(tokenId: string): Promise<any> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const details = await this.insuranceContract.getPolicyDetails(tokenId);
      return {
        owner: details[0],
        coverage: details[1].toString(),
        active: details[2],
      };
    } catch (error) {
      this.logger.error('Failed to get policy details:', error);
      throw error;
    }
  }

  async getClaimDetails(claimId: string): Promise<any> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const details = await this.insuranceContract.getClaimDetails(claimId);
      return {
        policyId: details[0].toString(),
        amount: details[1].toString(),
        status: details[2],
      };
    } catch (error) {
      this.logger.error('Failed to get claim details:', error);
      throw error;
    }
  }

  async getUserPolicyCount(userAddress: string): Promise<number> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const balance = await this.insuranceContract.balanceOf(userAddress);
      return parseInt(balance.toString());
    } catch (error) {
      this.logger.error('Failed to get user policy count:', error);
      throw error;
    }
  }

  async getNetworkInfo(): Promise<any> {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
      };
    } catch (error) {
      this.logger.error('Failed to get network info:', error);
      throw error;
    }
  }

  async estimateGas(method: string, params: any[]): Promise<string> {
    try {
      if (!this.insuranceContract) {
        throw new Error('Insurance contract not initialized');
      }

      const estimatedGas = await this.insuranceContract[method].estimateGas(...params);
      return estimatedGas.toString();
    } catch (error) {
      this.logger.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  // Oracle integration for external data
  async getExternalData(dataType: string, parameters: any): Promise<any> {
    try {
      switch (dataType) {
        case 'flight_status':
          return this.getFlightStatus(parameters.flightNumber, parameters.date);
        case 'weather_data':
          return this.getWeatherData(parameters.location, parameters.date);
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }
    } catch (error) {
      this.logger.error('Failed to fetch external data:', error);
      throw error;
    }
  }

  private async getFlightStatus(flightNumber: string, date: string): Promise<any> {
    // Integration with flight status API
    // This is a mock implementation
    return {
      flightNumber,
      date,
      status: 'on_time', // or 'delayed', 'cancelled'
      delay: 0,
      gate: 'A1',
    };
  }

  private async getWeatherData(location: string, date: string): Promise<any> {
    // Integration with weather API
    // This is a mock implementation
    return {
      location,
      date,
      temperature: 25,
      humidity: 60,
      conditions: 'clear',
      windSpeed: 10,
    };
  }
} 