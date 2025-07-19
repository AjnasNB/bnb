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
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const policy_schema_1 = require("./policy.schema");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const users_service_1 = require("../users/users.service");
let PoliciesService = class PoliciesService {
    constructor(policyModel, blockchainService, usersService) {
        this.policyModel = policyModel;
        this.blockchainService = blockchainService;
        this.usersService = usersService;
    }
    async create(createPolicyDto, userId) {
        const tokenId = await this.generateTokenId();
        const txHash = await this.blockchainService.mintPolicyNFT(userId, tokenId, createPolicyDto.coverageAmount, createPolicyDto.terms);
        const policyData = {
            ...createPolicyDto,
            userId,
            tokenId,
            blockchainTxHash: txHash,
        };
        const createdPolicy = new this.policyModel(policyData);
        const savedPolicy = await createdPolicy.save();
        await this.usersService.addPolicy(userId, savedPolicy._id.toString());
        return savedPolicy;
    }
    async findAll(userId) {
        const filter = userId ? { userId } : {};
        return this.policyModel.find(filter).populate('userId').exec();
    }
    async findOne(id) {
        const policy = await this.policyModel.findById(id).populate('userId').exec();
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return policy;
    }
    async findByTokenId(tokenId) {
        const policy = await this.policyModel.findOne({ tokenId }).populate('userId').exec();
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with token ID ${tokenId} not found`);
        }
        return policy;
    }
    async findUserPolicies(userId) {
        return this.policyModel.find({ userId }).populate('userId').exec();
    }
    async update(id, updatePolicyDto) {
        const policy = await this.policyModel.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        if (policy.status === policy_schema_1.PolicyStatus.EXPIRED || policy.status === policy_schema_1.PolicyStatus.CLAIMED) {
            throw new common_1.BadRequestException('Cannot update expired or claimed policy');
        }
        const updatedPolicy = await this.policyModel
            .findByIdAndUpdate(id, updatePolicyDto, { new: true })
            .populate('userId')
            .exec();
        return updatedPolicy;
    }
    async updateStatus(id, status) {
        const policy = await this.policyModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('userId')
            .exec();
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return policy;
    }
    async addClaim(policyId, claimAmount) {
        const policy = await this.policyModel.findById(policyId);
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${policyId} not found`);
        }
        const updatedPolicy = await this.policyModel
            .findByIdAndUpdate(policyId, {
            $inc: {
                claimsCount: 1,
                totalClaimedAmount: claimAmount,
            },
        }, { new: true })
            .populate('userId')
            .exec();
        return updatedPolicy;
    }
    async checkExpiredPolicies() {
        const expiredPolicies = await this.policyModel.find({
            endDate: { $lt: new Date() },
            status: policy_schema_1.PolicyStatus.ACTIVE,
        });
        for (const policy of expiredPolicies) {
            await this.updateStatus(policy._id.toString(), policy_schema_1.PolicyStatus.EXPIRED);
        }
    }
    async transferPolicy(tokenId, fromUserId, toUserId) {
        const policy = await this.policyModel.findOne({ tokenId });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with token ID ${tokenId} not found`);
        }
        if (!policy.isTransferable) {
            throw new common_1.BadRequestException('This policy is not transferable');
        }
        if (policy.userId.toString() !== fromUserId) {
            throw new common_1.BadRequestException('You do not own this policy');
        }
        await this.blockchainService.transferPolicyNFT(tokenId, fromUserId, toUserId);
        const updatedPolicy = await this.policyModel
            .findByIdAndUpdate(policy._id, { userId: toUserId }, { new: true })
            .populate('userId')
            .exec();
        return updatedPolicy;
    }
    async generateTokenId() {
        const count = await this.policyModel.countDocuments();
        return (count + 1).toString();
    }
    async remove(id) {
        const result = await this.policyModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(policy_schema_1.Policy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        blockchain_service_1.BlockchainService,
        users_service_1.UsersService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map