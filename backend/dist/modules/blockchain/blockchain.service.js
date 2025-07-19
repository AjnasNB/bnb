"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const app_config_1 = require("../../config/app.config");
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor() {
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.initializeProvider();
    }
    initializeProvider() {
        try {
            this.provider = new ethers_1.ethers.JsonRpcProvider(app_config_1.AppConfig.blockchain.rpcUrl);
            this.logger.log(`Connected to ${app_config_1.AppConfig.blockchain.network} at ${app_config_1.AppConfig.blockchain.rpcUrl}`);
        }
        catch (error) {
            this.logger.error(`Failed to connect to blockchain: ${error.message}`);
        }
    }
    async getNetworkInfo() {
        try {
            const network = await this.provider.getNetwork();
            const blockNumber = await this.provider.getBlockNumber();
            const gasPrice = await this.provider.getFeeData();
            return {
                network: app_config_1.AppConfig.blockchain.network,
                chainId: Number(network.chainId),
                blockNumber,
                gasPrice: gasPrice.gasPrice?.toString(),
                maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
                maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString(),
                explorerUrl: app_config_1.AppConfig.blockchain.explorerUrl,
                status: 'connected',
            };
        }
        catch (error) {
            this.logger.error(`Failed to get network info: ${error.message}`);
            throw error;
        }
    }
    async getBalance(address) {
        try {
            const balance = await this.provider.getBalance(address);
            return {
                address,
                balance: ethers_1.ethers.formatEther(balance),
                balanceWei: balance.toString(),
                currency: 'BNB',
            };
        }
        catch (error) {
            this.logger.error(`Failed to get balance for ${address}: ${error.message}`);
            throw error;
        }
    }
    async getTransactionHistory(address, limit = 10) {
        try {
            this.logger.log(`Fetching transaction history for ${address}`);
            const transactions = [];
            const currentBlock = await this.provider.getBlockNumber();
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
                                            value: ethers_1.ethers.formatEther(tx.value),
                                            blockNumber: tx.blockNumber,
                                            timestamp: block.timestamp,
                                            gasUsed: tx.gasLimit.toString(),
                                            status: 'confirmed',
                                        });
                                        if (transactions.length >= limit)
                                            break;
                                    }
                                }
                                catch (txError) {
                                    continue;
                                }
                            }
                        }
                    }
                }
                catch (blockError) {
                    continue;
                }
            }
            return {
                address,
                transactions,
                total: transactions.length,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
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
    async verifyTransaction(txHash) {
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
                value: ethers_1.ethers.formatEther(tx.value),
                gasUsed: receipt?.gasUsed.toString(),
                gasPrice: tx.gasPrice.toString(),
                confirmations: receipt ? await this.provider.getBlockNumber() - receipt.blockNumber : 0,
            };
        }
        catch (error) {
            this.logger.error(`Failed to verify transaction ${txHash}: ${error.message}`);
            return {
                hash: txHash,
                status: 'error',
                error: error.message,
            };
        }
    }
    async estimateGas(transaction) {
        try {
            const gasEstimate = await this.provider.estimateGas(transaction);
            const feeData = await this.provider.getFeeData();
            return {
                gasLimit: gasEstimate.toString(),
                gasPrice: feeData.gasPrice?.toString(),
                maxFeePerGas: feeData.maxFeePerGas?.toString(),
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
                estimatedCost: ethers_1.ethers.formatEther(gasEstimate * (feeData.gasPrice || 0n)),
            };
        }
        catch (error) {
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
                    name: app_config_1.AppConfig.blockchain.network,
                    chainId: Number(network.chainId),
                    blockNumber,
                },
                rpcUrl: app_config_1.AppConfig.blockchain.rpcUrl,
                contracts: app_config_1.AppConfig.contracts,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Blockchain health check failed: ${error.message}`);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    getProvider() {
        return this.provider;
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map