import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(AppConfig.blockchain.rpcUrl);
      this.logger.log(`Connected to ${AppConfig.blockchain.network} at ${AppConfig.blockchain.rpcUrl}`);
    } catch (error) {
      this.logger.error(`Failed to connect to blockchain: ${error.message}`);
    }
  }

  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return {
        network: AppConfig.blockchain.network,
        chainId: Number(network.chainId),
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString(),
        explorerUrl: AppConfig.blockchain.explorerUrl,
        status: 'connected',
      };
    } catch (error) {
      this.logger.error(`Failed to get network info: ${error.message}`);
      throw error;
    }
  }

  async getBalance(address: string) {
    try {
      const balance = await this.provider.getBalance(address);
      return {
        address,
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
        currency: 'BNB',
      };
    } catch (error) {
      this.logger.error(`Failed to get balance for ${address}: ${error.message}`);
      throw error;
    }
  }

  async getTransactionHistory(address: string, limit: number = 10) {
    try {
      this.logger.log(`Fetching transaction history for ${address}`);
      
      const transactions = [];
      const currentBlock = await this.provider.getBlockNumber();
      
      // Get recent blocks (last 50 blocks for efficiency)
      const blocksToCheck = Math.min(50, currentBlock);
      
      for (let i = 0; i < blocksToCheck && transactions.length < limit; i++) {
        const blockNumber = currentBlock - i;
        
        try {
          const block = await this.provider.getBlock(blockNumber, true);
          
          if (block && block.transactions) {
            for (const txHash of block.transactions) {
              if (typeof txHash === 'string') {
                try {
                  const tx = await this.provider.getTransaction(txHash);
                  if (tx && 
                      tx.from && 
                      tx.to && 
                      tx.hash &&
                      tx.value !== undefined &&
                      tx.blockNumber !== undefined &&
                      tx.gasLimit &&
                      (tx.from.toLowerCase() === address.toLowerCase() || 
                       tx.to.toLowerCase() === address.toLowerCase())) {
                    
                    transactions.push({
                      hash: tx.hash,
                      from: tx.from,
                      to: tx.to,
                      value: ethers.formatEther(tx.value),
                      blockNumber: tx.blockNumber,
                      timestamp: block.timestamp,
                      gasUsed: tx.gasLimit.toString(),
                      status: 'confirmed',
                    });
                    
                    if (transactions.length >= limit) break;
                  }
                } catch (txError) {
                  // Skip individual transaction errors
                  continue;
                }
              }
            }
          }
        } catch (blockError) {
          // Skip individual block errors
          continue;
        }
      }

      return {
        address,
        transactions,
        total: transactions.length,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      this.logger.error(`Failed to get transaction history: ${error.message}`);
      return {
        address,
        transactions: [],
        total: 0,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async verifyTransaction(txHash: string) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!tx) {
        return {
          hash: txHash,
          status: 'not_found',
          message: 'Transaction not found',
        };
      }

      return {
        hash: txHash,
        status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        gasUsed: receipt?.gasUsed.toString(),
        gasPrice: tx.gasPrice.toString(),
        confirmations: receipt ? await this.provider.getBlockNumber() - receipt.blockNumber : 0,
      };
    } catch (error) {
      this.logger.error(`Failed to verify transaction ${txHash}: ${error.message}`);
      return {
        hash: txHash,
        status: 'error',
        error: error.message,
      };
    }
  }

  async estimateGas(transaction: any) {
    try {
      const gasEstimate = await this.provider.estimateGas(transaction);
      const feeData = await this.provider.getFeeData();

      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        estimatedCost: ethers.formatEther(gasEstimate * (feeData.gasPrice || 0n)),
      };
    } catch (error) {
      this.logger.error(`Failed to estimate gas: ${error.message}`);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();

      return {
        status: 'healthy',
        network: {
          name: AppConfig.blockchain.network,
          chainId: Number(network.chainId),
          blockNumber,
        },
        rpcUrl: AppConfig.blockchain.rpcUrl,
        contracts: AppConfig.contracts,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Blockchain health check failed: ${error.message}`);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }
} 