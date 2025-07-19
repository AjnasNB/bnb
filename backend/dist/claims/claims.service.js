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
exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const claim_schema_1 = require("./claim.schema");
const policies_service_1 = require("../policies/policies.service");
const users_service_1 = require("../users/users.service");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ClaimsService = class ClaimsService {
    constructor(claimModel, policiesService, usersService, blockchainService, httpService, configService) {
        this.claimModel = claimModel;
        this.policiesService = policiesService;
        this.usersService = usersService;
        this.blockchainService = blockchainService;
        this.httpService = httpService;
        this.configService = configService;
    }
    async create(createClaimDto, userId) {
        const policy = await this.policiesService.findOne(createClaimDto.policyId);
        if (policy.userId.toString() !== userId) {
            throw new common_1.BadRequestException('Policy does not belong to the user');
        }
        const claimNumber = await this.generateClaimNumber();
        const claimData = {
            ...createClaimDto,
            userId,
            claimNumber,
            reportedDate: new Date(),
        };
        const createdClaim = new this.claimModel(claimData);
        const savedClaim = await createdClaim.save();
        await this.usersService.addClaim(userId, savedClaim._id.toString());
        if (createClaimDto.documents?.length || createClaimDto.images?.length) {
            this.processWithAI(savedClaim._id.toString()).catch(console.error);
        }
        return savedClaim;
    }
    async findAll(userId) {
        const filter = userId ? { userId } : {};
        return this.claimModel
            .find(filter)
            .populate('userId')
            .populate('policyId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const claim = await this.claimModel
            .findById(id)
            .populate('userId')
            .populate('policyId')
            .exec();
        if (!claim) {
            throw new common_1.NotFoundException(`Claim with ID ${id} not found`);
        }
        return claim;
    }
    async findUserClaims(userId) {
        return this.claimModel
            .find({ userId })
            .populate('userId')
            .populate('policyId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByClaimNumber(claimNumber) {
        const claim = await this.claimModel
            .findOne({ claimNumber })
            .populate('userId')
            .populate('policyId')
            .exec();
        if (!claim) {
            throw new common_1.NotFoundException(`Claim with number ${claimNumber} not found`);
        }
        return claim;
    }
    async update(id, updateClaimDto) {
        const claim = await this.claimModel.findById(id);
        if (!claim) {
            throw new common_1.NotFoundException(`Claim with ID ${id} not found`);
        }
        if (claim.status === claim_schema_1.ClaimStatus.PAID || claim.status === claim_schema_1.ClaimStatus.REJECTED) {
            throw new common_1.BadRequestException('Cannot update finalized claim');
        }
        const updatedClaim = await this.claimModel
            .findByIdAndUpdate(id, updateClaimDto, { new: true })
            .populate('userId')
            .populate('policyId')
            .exec();
        return updatedClaim;
    }
    async updateStatus(id, status, adminNotes) {
        const updateData = { status };
        if (adminNotes) {
            updateData['humanReview.notes'] = adminNotes;
            updateData['humanReview.reviewDate'] = new Date();
        }
        const claim = await this.claimModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('userId')
            .populate('policyId')
            .exec();
        if (!claim) {
            throw new common_1.NotFoundException(`Claim with ID ${id} not found`);
        }
        if (status === claim_schema_1.ClaimStatus.APPROVED && claim.approvedAmount > 0) {
            this.processPayment(id).catch(console.error);
        }
        return claim;
    }
    async processWithAI(claimId) {
        const claim = await this.findOne(claimId);
        try {
            const aiServiceUrl = this.configService.get('AI_SERVICE_URL');
            const aiApiKey = this.configService.get('AI_SERVICE_API_KEY');
            const aiRequest = {
                claimId: claim._id,
                claimType: claim.type,
                documents: claim.documents,
                images: claim.images,
                requestedAmount: claim.requestedAmount,
                description: claim.description,
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${aiServiceUrl}/analyze-claim`, aiRequest, {
                headers: {
                    'Authorization': `Bearer ${aiApiKey}`,
                    'Content-Type': 'application/json',
                },
            }));
            const aiAnalysis = response.data;
            await this.claimModel.findByIdAndUpdate(claimId, {
                aiAnalysis,
                status: aiAnalysis.fraudScore > 0.7 ? claim_schema_1.ClaimStatus.AI_REJECTED : claim_schema_1.ClaimStatus.AI_VALIDATED,
                approvedAmount: Math.min(aiAnalysis.estimatedAmount, claim.requestedAmount),
            });
            console.log(`AI analysis completed for claim ${claim.claimNumber}`);
        }
        catch (error) {
            console.error(`AI analysis failed for claim ${claim.claimNumber}:`, error);
            await this.claimModel.findByIdAndUpdate(claimId, {
                status: claim_schema_1.ClaimStatus.UNDER_REVIEW,
            });
        }
    }
    async processPayment(claimId) {
        const claim = await this.findOne(claimId);
        if (claim.status !== claim_schema_1.ClaimStatus.APPROVED) {
            throw new common_1.BadRequestException('Claim must be approved before payment');
        }
        try {
            const txHash = await this.blockchainService.processClaimPayment(claim.policyId.toString(), claim.approvedAmount, claim.userId.toString());
            await this.claimModel.findByIdAndUpdate(claimId, {
                status: claim_schema_1.ClaimStatus.PAID,
                paymentTxHash: txHash,
            });
            await this.policiesService.addClaim(claim.policyId.toString(), claim.approvedAmount);
            console.log(`Payment processed for claim ${claim.claimNumber}, tx: ${txHash}`);
        }
        catch (error) {
            console.error(`Payment failed for claim ${claim.claimNumber}:`, error);
            throw error;
        }
    }
    async getClaimStatistics(userId) {
        const filter = userId ? { userId } : {};
        const totalClaims = await this.claimModel.countDocuments(filter);
        const pendingClaims = await this.claimModel.countDocuments({
            ...filter,
            status: { $in: [claim_schema_1.ClaimStatus.SUBMITTED, claim_schema_1.ClaimStatus.UNDER_REVIEW, claim_schema_1.ClaimStatus.AI_VALIDATED] },
        });
        const approvedClaims = await this.claimModel.countDocuments({
            ...filter,
            status: claim_schema_1.ClaimStatus.APPROVED,
        });
        const paidClaims = await this.claimModel.countDocuments({
            ...filter,
            status: claim_schema_1.ClaimStatus.PAID,
        });
        const totalPaidAmount = await this.claimModel.aggregate([
            { $match: { ...filter, status: claim_schema_1.ClaimStatus.PAID } },
            { $group: { _id: null, total: { $sum: '$approvedAmount' } } },
        ]);
        return {
            totalClaims,
            pendingClaims,
            approvedClaims,
            paidClaims,
            totalPaidAmount: totalPaidAmount[0]?.total || 0,
            approvalRate: totalClaims > 0 ? (approvedClaims + paidClaims) / totalClaims : 0,
        };
    }
    async generateClaimNumber() {
        const count = await this.claimModel.countDocuments();
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `CL${year}${month}${String(count + 1).padStart(6, '0')}`;
    }
    async remove(id) {
        const result = await this.claimModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Claim with ID ${id} not found`);
        }
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(claim_schema_1.Claim.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        policies_service_1.PoliciesService,
        users_service_1.UsersService,
        blockchain_service_1.BlockchainService,
        axios_1.HttpService,
        config_1.ConfigService])
], ClaimsService);
//# sourceMappingURL=claims.service.js.map