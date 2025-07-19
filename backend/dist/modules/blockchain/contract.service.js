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
var ContractService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const app_config_1 = require("../../config/app.config");
const blockchain_service_1 = require("./blockchain.service");
let ContractService = ContractService_1 = class ContractService {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
        this.logger = new common_1.Logger(ContractService_1.name);
        this.contracts = {};
        this.initializeContracts();
    }
    async initializeContracts() {
        try {
            const provider = this.blockchainService.getProvider();
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
            this.contracts.stablecoin = new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.stablecoin, erc20Abi, provider);
            this.contracts.governanceToken = new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.governanceToken, erc20Abi, provider);
            this.contracts.policyNFT = new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.policyNFT, erc721Abi, provider);
            this.logger.log('Smart contracts initialized successfully');
        }
        catch (error) {
            this.logger.error(`Failed to initialize contracts: ${error.message}`);
        }
    }
    getContractAddresses() {
        return {
            network: app_config_1.AppConfig.blockchain.network,
            chainId: app_config_1.AppConfig.blockchain.chainId,
            addresses: app_config_1.AppConfig.contracts,
            explorerUrls: {
                stablecoin: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.stablecoin}`,
                governanceToken: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.governanceToken}`,
                policyNFT: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.policyNFT}`,
                claimsEngine: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.claimsEngine}`,
                surplusDistributor: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.surplusDistributor}`,
                governance: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.governance}`,
            },
        };
    }
    async getTokenBalances(address) {
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
                        balance: ethers_1.ethers.formatEther(stablecoinBalance),
                        balanceWei: stablecoinBalance.toString(),
                        ...stablecoinInfo,
                    },
                    governanceToken: {
                        balance: ethers_1.ethers.formatEther(governanceBalance),
                        balanceWei: governanceBalance.toString(),
                        ...governanceInfo,
                    },
                    policyNFT: {
                        balance: policyBalance.toString(),
                        ...policyInfo,
                    },
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get token balances for ${address}: ${error.message}`);
            throw error;
        }
    }
    async getTokenInfo(contractKey) {
        try {
            const contract = this.contracts[contractKey];
            const [name, symbol] = await Promise.all([
                contract.name(),
                contract.symbol(),
            ]);
            const result = { name, symbol };
            if (contractKey !== 'policyNFT') {
                const totalSupply = await contract.totalSupply();
                result.totalSupply = ethers_1.ethers.formatEther(totalSupply);
                result.totalSupplyWei = totalSupply.toString();
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to get token info for ${contractKey}: ${error.message}`);
            return {
                name: 'Unknown',
                symbol: 'UNKNOWN',
                totalSupply: '0',
            };
        }
    }
    async createPolicy(policyData) {
        try {
            this.logger.log(`Creating policy for ${policyData.holder}`);
            return {
                success: true,
                message: 'Policy creation initiated',
                policyData,
                estimatedGas: '150000',
                contractAddress: app_config_1.AppConfig.contracts.policyNFT,
                note: 'This requires wallet connection to complete the transaction'
            };
        }
        catch (error) {
            this.logger.error(`Failed to create policy: ${error.message}`);
            throw error;
        }
    }
    async submitClaim(claimData) {
        try {
            this.logger.log(`Submitting claim ${claimData.claimId}`);
            return {
                success: true,
                message: 'Claim submission initiated',
                claimData,
                estimatedGas: '120000',
                contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                note: 'This requires wallet connection to complete the transaction'
            };
        }
        catch (error) {
            this.logger.error(`Failed to submit claim: ${error.message}`);
            throw error;
        }
    }
    async stakeTokens(amount, userAddress) {
        try {
            this.logger.log(`Staking ${amount} tokens for ${userAddress}`);
            return {
                success: true,
                message: 'Token staking initiated',
                amount,
                userAddress,
                estimatedGas: '100000',
                contractAddress: app_config_1.AppConfig.contracts.governanceToken,
                note: 'This requires wallet connection to complete the transaction'
            };
        }
        catch (error) {
            this.logger.error(`Failed to stake tokens: ${error.message}`);
            throw error;
        }
    }
    async getPolicyDetails(tokenId) {
        try {
            const owner = await this.contracts.policyNFT.ownerOf(tokenId);
            return {
                tokenId,
                owner,
                contractAddress: app_config_1.AppConfig.contracts.policyNFT,
                explorerUrl: `${app_config_1.AppConfig.blockchain.explorerUrl}/token/${app_config_1.AppConfig.contracts.policyNFT}?a=${tokenId}`,
                details: {
                    active: true,
                    coverageAmount: 'TBD',
                    premiumPaid: 'TBD',
                    expiryDate: 'TBD',
                }
            };
        }
        catch (error) {
            this.logger.error(`Failed to get policy details for token ${tokenId}: ${error.message}`);
            return {
                tokenId,
                error: error.message,
                exists: false,
            };
        }
    }
    async getClaimDetails(claimId) {
        try {
            return {
                claimId,
                status: 'under_review',
                contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                explorerUrl: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.claimsEngine}`,
                details: {
                    submittedAt: new Date().toISOString(),
                    amount: 'TBD',
                    claimType: 'TBD',
                    evidenceHashes: [],
                }
            };
        }
        catch (error) {
            this.logger.error(`Failed to get claim details for ${claimId}: ${error.message}`);
            throw error;
        }
    }
    async getGovernanceProposals() {
        try {
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
                contractAddress: app_config_1.AppConfig.contracts.governance,
                totalProposals: 1,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get governance proposals: ${error.message}`);
            throw error;
        }
    }
    async voteOnProposal(voteData) {
        try {
            this.logger.log(`Voting on proposal ${voteData.proposalId} by ${voteData.voter}`);
            return {
                success: true,
                message: 'Vote submission initiated',
                voteData,
                estimatedGas: '80000',
                contractAddress: app_config_1.AppConfig.contracts.governance,
                note: 'This requires wallet connection to complete the transaction'
            };
        }
        catch (error) {
            this.logger.error(`Failed to vote on proposal: ${error.message}`);
            throw error;
        }
    }
    async healthCheck() {
        try {
            const [stablecoinName, governanceName, policyName] = await Promise.all([
                this.contracts.stablecoin.name().catch(() => 'Connection Failed'),
                this.contracts.governanceToken.name().catch(() => 'Connection Failed'),
                this.contracts.policyNFT.name().catch(() => 'Connection Failed'),
            ]);
            return {
                status: 'healthy',
                contracts: {
                    stablecoin: {
                        address: app_config_1.AppConfig.contracts.stablecoin,
                        name: stablecoinName,
                        connected: stablecoinName !== 'Connection Failed',
                    },
                    governanceToken: {
                        address: app_config_1.AppConfig.contracts.governanceToken,
                        name: governanceName,
                        connected: governanceName !== 'Connection Failed',
                    },
                    policyNFT: {
                        address: app_config_1.AppConfig.contracts.policyNFT,
                        name: policyName,
                        connected: policyName !== 'Connection Failed',
                    },
                },
                network: app_config_1.AppConfig.blockchain.network,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Contract health check failed: ${error.message}`);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = ContractService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], ContractService);
//# sourceMappingURL=contract.service.js.map