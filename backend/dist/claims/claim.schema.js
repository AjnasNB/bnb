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
exports.ClaimSchema = exports.Claim = exports.ClaimType = exports.ClaimStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["SUBMITTED"] = "submitted";
    ClaimStatus["UNDER_REVIEW"] = "under_review";
    ClaimStatus["AI_VALIDATED"] = "ai_validated";
    ClaimStatus["AI_REJECTED"] = "ai_rejected";
    ClaimStatus["APPROVED"] = "approved";
    ClaimStatus["REJECTED"] = "rejected";
    ClaimStatus["PAID"] = "paid";
    ClaimStatus["DISPUTED"] = "disputed";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
var ClaimType;
(function (ClaimType) {
    ClaimType["HEALTH"] = "health";
    ClaimType["VEHICLE"] = "vehicle";
    ClaimType["TRAVEL"] = "travel";
    ClaimType["PRODUCT_WARRANTY"] = "product_warranty";
    ClaimType["PET"] = "pet";
    ClaimType["AGRICULTURAL"] = "agricultural";
})(ClaimType || (exports.ClaimType = ClaimType = {}));
let Claim = class Claim {
};
exports.Claim = Claim;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Claim.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Policy' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Claim.prototype, "policyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Claim.prototype, "claimNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ClaimType }),
    __metadata("design:type", String)
], Claim.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Claim.prototype, "requestedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Claim.prototype, "approvedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Claim.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ClaimStatus, default: ClaimStatus.SUBMITTED }),
    __metadata("design:type", String)
], Claim.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Claim.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Claim.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Claim.prototype, "incidentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Claim.prototype, "reportedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Claim.prototype, "aiAnalysis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Claim.prototype, "humanReview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Claim.prototype, "blockchainTxHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Claim.prototype, "paymentTxHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Claim.prototype, "claimSpecificData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Claim.prototype, "isUrgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Claim.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Claim.prototype, "externalReferenceId", void 0);
exports.Claim = Claim = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Claim);
exports.ClaimSchema = mongoose_1.SchemaFactory.createForClass(Claim);
//# sourceMappingURL=claim.schema.js.map