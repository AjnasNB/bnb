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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blockchain_service_1 = require("./blockchain.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BlockchainController = class BlockchainController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    getNetworkInfo() {
        return this.blockchainService.getNetworkInfo();
    }
    getPolicyDetails(tokenId) {
        return this.blockchainService.getPolicyDetails(tokenId);
    }
    getClaimDetails(claimId) {
        return this.blockchainService.getClaimDetails(claimId);
    }
    getUserPolicyCount(address) {
        return this.blockchainService.getUserPolicyCount(address);
    }
    estimateGas(method, params) {
        return this.blockchainService.estimateGas(method, params);
    }
    getExternalData(dataType, parameters) {
        return this.blockchainService.getExternalData(dataType, parameters);
    }
    transferPolicy(tokenId, fromAddress, toAddress) {
        return this.blockchainService.transferPolicyNFT(tokenId, fromAddress, toAddress);
    }
    submitClaim(policyTokenId, amount, aiScoreHash) {
        return this.blockchainService.submitClaim(policyTokenId, amount, aiScoreHash);
    }
};
exports.BlockchainController = BlockchainController;
__decorate([
    (0, common_1.Get)('network-info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blockchain network information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Network information retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getNetworkInfo", null);
__decorate([
    (0, common_1.Get)('policy/:tokenId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy details from blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy details retrieved' }),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getPolicyDetails", null);
__decorate([
    (0, common_1.Get)('claim/:claimId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get claim details from blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim details retrieved' }),
    __param(0, (0, common_1.Param)('claimId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getClaimDetails", null);
__decorate([
    (0, common_1.Get)('user/:address/policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user policy count from blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy count retrieved' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getUserPolicyCount", null);
__decorate([
    (0, common_1.Post)('estimate-gas'),
    (0, swagger_1.ApiOperation)({ summary: 'Estimate gas for a transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gas estimation provided' }),
    __param(0, (0, common_1.Body)('method')),
    __param(1, (0, common_1.Body)('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "estimateGas", null);
__decorate([
    (0, common_1.Post)('external-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch external data via oracles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External data retrieved' }),
    __param(0, (0, common_1.Body)('dataType')),
    __param(1, (0, common_1.Body)('parameters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getExternalData", null);
__decorate([
    (0, common_1.Post)('transfer-policy'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer policy NFT' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy transferred successfully' }),
    __param(0, (0, common_1.Body)('tokenId')),
    __param(1, (0, common_1.Body)('fromAddress')),
    __param(2, (0, common_1.Body)('toAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "transferPolicy", null);
__decorate([
    (0, common_1.Post)('submit-claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit claim to blockchain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim submitted successfully' }),
    __param(0, (0, common_1.Body)('policyTokenId')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('aiScoreHash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "submitClaim", null);
exports.BlockchainController = BlockchainController = __decorate([
    (0, swagger_1.ApiTags)('blockchain'),
    (0, common_1.Controller)('blockchain'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], BlockchainController);
//# sourceMappingURL=blockchain.controller.js.map