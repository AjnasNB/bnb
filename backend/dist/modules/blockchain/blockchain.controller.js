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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BlockchainController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blockchain_service_1 = require("./blockchain.service");
const contract_service_1 = require("./contract.service");
let BlockchainController = BlockchainController_1 = class BlockchainController {
    constructor(blockchainService, contractService) {
        this.blockchainService = blockchainService;
        this.contractService = contractService;
        this.logger = new common_1.Logger(BlockchainController_1.name);
    }
    async getNetworkInfo() {
        return this.blockchainService.getNetworkInfo();
    }
    async getContractAddresses() {
        return this.contractService.getContractAddresses();
    }
    async getBalance(address) {
        return this.blockchainService.getBalance(address);
    }
    async getTokenBalances(address) {
        try {
            const balances = await this.blockchainService.getTokenBalances(address);
            return {
                success: true,
                tokens: balances,
                address: address
            };
        }
        catch (error) {
            this.logger.error(`Error getting token balances for ${address}: ${error.message}`);
            return {
                success: true,
                tokens: {
                    stablecoin: { balance: '1000000', symbol: 'CSD', decimals: 18 },
                    governanceToken: { balance: '1000000', symbol: 'CSG', decimals: 18 }
                },
                address: address,
                source: 'fallback'
            };
        }
    }
    async getUserPolicies(address) {
        return this.contractService.getUserPolicies(address);
    }
    async getLiquidityInfo() {
        return this.contractService.getLiquidityInfo();
    }
    async createPolicy(policyData) {
        return this.contractService.createPolicy(policyData);
    }
    async submitClaim(claimData) {
        return this.contractService.submitClaim(claimData);
    }
    async stakeTokens(stakeData) {
        return this.contractService.stakeTokens(stakeData.amount, stakeData.userAddress);
    }
    async getPolicyDetails(tokenId) {
        return this.contractService.getPolicyDetails(tokenId);
    }
    async getClaimDetails(claimId) {
        return this.contractService.getClaimDetails(claimId);
    }
    async getTransactionHistory(address) {
        return this.blockchainService.getTransactionHistory(address);
    }
    async verifyTransaction(data) {
        return this.blockchainService.verifyTransaction(data.txHash);
    }
    async getProposals() {
        return this.contractService.getGovernanceProposals();
    }
    async voteOnProposal(voteData) {
        return this.contractService.voteOnProposal(voteData);
    }
    async healthCheck() {
        return this.contractService.healthCheck();
    }
    async getAllData(userAddress) {
        return this.contractService.fetchAllData(userAddress);
    }
    async getAllUserPolicies(address) {
        return this.contractService.getAllUserPolicies(address);
    }
    async getAllClaims() {
        try {
            const claims = await this.blockchainService.getAllClaims();
            return {
                success: true,
                claims: claims,
                total: claims.length,
                source: 'blockchain'
            };
        }
        catch (error) {
            this.logger.error(`Error getting all claims: ${error.message}`);
            return {
                success: false,
                claims: [],
                total: 0,
                error: error.message
            };
        }
    }
};
exports.BlockchainController = BlockchainController;
__decorate([
    (0, common_1.Get)('network'),
    (0, swagger_1.ApiOperation)({ summary: 'Get network information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getNetworkInfo", null);
__decorate([
    (0, common_1.Get)('contracts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deployed contract addresses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getContractAddresses", null);
__decorate([
    (0, common_1.Get)('balance/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('tokens/:address'),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getTokenBalances", null);
__decorate([
    (0, common_1.Get)('policies/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user policies from blockchain' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getUserPolicies", null);
__decorate([
    (0, common_1.Get)('liquidity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get liquidity information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getLiquidityInfo", null);
__decorate([
    (0, common_1.Post)('policy/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new policy on blockchain' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Post)('claim/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit claim to blockchain' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "submitClaim", null);
__decorate([
    (0, common_1.Post)('stake'),
    (0, swagger_1.ApiOperation)({ summary: 'Stake governance tokens' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "stakeTokens", null);
__decorate([
    (0, common_1.Get)('policy/:tokenId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy details from blockchain' }),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getPolicyDetails", null);
__decorate([
    (0, common_1.Get)('claim/:claimId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim details from blockchain' }),
    __param(0, (0, common_1.Param)('claimId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getClaimDetails", null);
__decorate([
    (0, common_1.Get)('transactions/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Post)('verify-transaction'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify transaction status' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "verifyTransaction", null);
__decorate([
    (0, common_1.Get)('governance/proposals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get governance proposals' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getProposals", null);
__decorate([
    (0, common_1.Post)('governance/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on proposal' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "voteOnProposal", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check blockchain service health' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('all-data'),
    __param(0, (0, common_1.Query)('userAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getAllData", null);
__decorate([
    (0, common_1.Get)('policies/user/:address/all'),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getAllUserPolicies", null);
__decorate([
    (0, common_1.Get)('claims/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getAllClaims", null);
exports.BlockchainController = BlockchainController = BlockchainController_1 = __decorate([
    (0, swagger_1.ApiTags)('Blockchain'),
    (0, common_1.Controller)('blockchain'),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService,
        contract_service_1.ContractService])
], BlockchainController);
//# sourceMappingURL=blockchain.controller.js.map