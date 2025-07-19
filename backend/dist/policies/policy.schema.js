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
exports.PolicySchema = exports.Policy = exports.PolicyStatus = exports.PolicyType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PolicyType;
(function (PolicyType) {
    PolicyType["HEALTH"] = "health";
    PolicyType["VEHICLE"] = "vehicle";
    PolicyType["TRAVEL"] = "travel";
    PolicyType["PRODUCT_WARRANTY"] = "product_warranty";
    PolicyType["PET"] = "pet";
    PolicyType["AGRICULTURAL"] = "agricultural";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["EXPIRED"] = "expired";
    PolicyStatus["SUSPENDED"] = "suspended";
    PolicyStatus["CLAIMED"] = "claimed";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
let Policy = class Policy {
};
exports.Policy = Policy;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Policy.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Policy.prototype, "tokenId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PolicyType }),
    __metadata("design:type", String)
], Policy.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Policy.prototype, "coverageAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Policy.prototype, "premiumAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Policy.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Policy.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PolicyStatus, default: PolicyStatus.ACTIVE }),
    __metadata("design:type", String)
], Policy.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Policy.prototype, "terms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Policy.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Policy.prototype, "typeSpecificData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Policy.prototype, "claimsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Policy.prototype, "totalClaimedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Policy.prototype, "blockchainTxHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Policy.prototype, "isTransferable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Policy.prototype, "attachments", void 0);
exports.Policy = Policy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Policy);
exports.PolicySchema = mongoose_1.SchemaFactory.createForClass(Policy);
//# sourceMappingURL=policy.schema.js.map