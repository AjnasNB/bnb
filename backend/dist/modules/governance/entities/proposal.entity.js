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
exports.Proposal = exports.ProposalStatus = void 0;
const typeorm_1 = require("typeorm");
var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus["DRAFT"] = "draft";
    ProposalStatus["ACTIVE"] = "active";
    ProposalStatus["PASSED"] = "passed";
    ProposalStatus["REJECTED"] = "rejected";
    ProposalStatus["EXECUTED"] = "executed";
})(ProposalStatus || (exports.ProposalStatus = ProposalStatus = {}));
let Proposal = class Proposal {
};
exports.Proposal = Proposal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Proposal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Proposal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposal.prototype, "proposerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: ProposalStatus,
        default: ProposalStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Proposal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Proposal.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Proposal.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", String)
], Proposal.prototype, "votesFor", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", String)
], Proposal.prototype, "votesAgainst", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", String)
], Proposal.prototype, "totalVotingPower", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Proposal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Proposal.prototype, "updatedAt", void 0);
exports.Proposal = Proposal = __decorate([
    (0, typeorm_1.Entity)('proposals')
], Proposal);
//# sourceMappingURL=proposal.entity.js.map