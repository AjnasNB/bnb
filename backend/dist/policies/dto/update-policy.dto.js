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
exports.UpdatePolicyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_policy_dto_1 = require("./create-policy.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const policy_schema_1 = require("../policy.schema");
class UpdatePolicyDto extends (0, swagger_1.PartialType)(create_policy_dto_1.CreatePolicyDto) {
}
exports.UpdatePolicyDto = UpdatePolicyDto;
__decorate([
    (0, swagger_2.ApiProperty)({ enum: policy_schema_1.PolicyStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(policy_schema_1.PolicyStatus),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "status", void 0);
//# sourceMappingURL=update-policy.dto.js.map