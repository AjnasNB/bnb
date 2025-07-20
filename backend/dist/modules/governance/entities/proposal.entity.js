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
const vote_entity_1 = require("./vote.entity");
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
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Proposal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proposer_id' }),
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
    (0, typeorm_1.Column)({ name: 'start_time', type: 'datetime' }),
    __metadata("design:type", Date)
], Proposal.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'datetime' }),
    __metadata("design:type", Date)
], Proposal.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'votes_for', type: 'decimal', precision: 20, scale: 8, default: '0' }),
    __metadata("design:type", String)
], Proposal.prototype, "votesFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'votes_against', type: 'decimal', precision: 20, scale: 8, default: '0' }),
    __metadata("design:type", String)
], Proposal.prototype, "votesAgainst", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_voting_power', type: 'decimal', precision: 20, scale: 8, default: '0' }),
    __metadata("design:type", String)
], Proposal.prototype, "totalVotingPower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Proposal.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Proposal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Proposal.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, vote => vote.proposal),
    __metadata("design:type", Array)
], Proposal.prototype, "votes", void 0);
exports.Proposal = Proposal = __decorate([
    (0, typeorm_1.Entity)('proposals')
], Proposal);
//# sourceMappingURL=proposal.entity.js.map