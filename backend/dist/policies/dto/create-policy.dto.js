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
exports.CreatePolicyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const policy_schema_1 = require("../policy.schema");
class CreatePolicyDto {
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: policy_schema_1.PolicyType, example: policy_schema_1.PolicyType.HEALTH }),
    (0, class_validator_1.IsEnum)(policy_schema_1.PolicyType),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000000000000000, description: 'Coverage amount in Wei' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "coverageAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000000000000000, description: 'Premium amount in Wei' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "premiumAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePolicyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePolicyDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'QmHash123...', description: 'IPFS hash of terms and conditions' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Comprehensive health insurance policy', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            medicalHistory: ['diabetes', 'hypertension'],
            preExistingConditions: ['allergies']
        },
        required: false,
        description: 'Type-specific data object'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePolicyDto.prototype, "typeSpecificData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePolicyDto.prototype, "isTransferable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['QmDoc1...', 'QmDoc2...'],
        required: false,
        description: 'IPFS hashes of policy documents'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePolicyDto.prototype, "attachments", void 0);
//# sourceMappingURL=create-policy.dto.js.map