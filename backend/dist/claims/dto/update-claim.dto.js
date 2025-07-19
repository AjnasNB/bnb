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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClaimDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_claim_dto_1 = require("./create-claim.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const claim_schema_1 = require("../claim.schema");
class UpdateClaimDto extends (0, swagger_1.PartialType)(create_claim_dto_1.CreateClaimDto) {
}
exports.UpdateClaimDto = UpdateClaimDto;
__decorate([
    (0, swagger_2.ApiProperty)({ enum: claim_schema_1.ClaimStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(claim_schema_1.ClaimStatus),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 400000000000000000, required: false, description: 'Approved amount in Wei' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateClaimDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        example: {
            fraudScore: 0.1,
            authenticityScore: 0.9,
            estimatedAmount: 450000000000000000,
            confidence: 0.85,
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateClaimDto.prototype, "aiAnalysis", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        example: {
            reviewerId: '507f1f77bcf86cd799439012',
            notes: 'Claim approved after document verification',
            decision: 'approve',
            adjustedAmount: 400000000000000000,
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateClaimDto.prototype, "humanReview", void 0);
//# sourceMappingURL=update-claim.dto.js.map