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
exports.Vote = exports.VoteChoice = void 0;
const typeorm_1 = require("typeorm");
const proposal_entity_1 = require("./proposal.entity");
var VoteChoice;
(function (VoteChoice) {
    VoteChoice["FOR"] = "for";
    VoteChoice["AGAINST"] = "against";
    VoteChoice["ABSTAIN"] = "abstain";
})(VoteChoice || (exports.VoteChoice = VoteChoice = {}));
let Vote = class Vote {
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Vote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proposal_id' }),
    __metadata("design:type", String)
], Vote.prototype, "proposalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'claim_id', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "claimId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: VoteChoice,
    }),
    __metadata("design:type", String)
], Vote.prototype, "choice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'suggested_amount', type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "suggestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "reasoning", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voting_power', type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", String)
], Vote.prototype, "votingPower", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Vote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proposal_entity_1.Proposal, proposal => proposal.votes),
    (0, typeorm_1.JoinColumn)({ name: 'proposal_id' }),
    __metadata("design:type", proposal_entity_1.Proposal)
], Vote.prototype, "proposal", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)('votes')
], Vote);
//# sourceMappingURL=vote.entity.js.map