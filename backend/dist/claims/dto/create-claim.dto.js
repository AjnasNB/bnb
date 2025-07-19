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
exports.CreateClaimDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const claim_schema_1 = require("../claim.schema");
class CreateClaimDto {
}
exports.CreateClaimDto = CreateClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "policyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: claim_schema_1.ClaimType, example: claim_schema_1.ClaimType.HEALTH }),
    (0, class_validator_1.IsEnum)(claim_schema_1.ClaimType),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000000000000000, description: 'Requested amount in Wei' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateClaimDto.prototype, "requestedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hospital treatment for accident injuries' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T10:30:00.000Z' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateClaimDto.prototype, "incidentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['QmDoc1...', 'QmDoc2...'],
        required: false,
        description: 'IPFS hashes of claim documents',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateClaimDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['QmImg1...', 'QmImg2...'],
        required: false,
        description: 'IPFS hashes of claim images',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateClaimDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            hospitalName: 'City General Hospital',
            doctorName: 'Dr. Smith',
            diagnosis: 'Fractured arm',
            treatmentType: 'Emergency treatment',
        },
        required: false,
        description: 'Claim-specific data object',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateClaimDto.prototype, "claimSpecificData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateClaimDto.prototype, "isUrgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['emergency', 'accident'],
        required: false,
        description: 'Tags for categorization',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateClaimDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EXT-REF-123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "externalReferenceId", void 0);
//# sourceMappingURL=create-claim.dto.js.map