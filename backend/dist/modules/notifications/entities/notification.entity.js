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
exports.Notification = exports.NotificationType = exports.NotificationPriority = exports.NotificationStatus = void 0;
const typeorm_1 = require("typeorm");
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["UNREAD"] = "unread";
    NotificationStatus["READ"] = "read";
    NotificationStatus["ARCHIVED"] = "archived";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["CLAIM_APPROVED"] = "claim_approved";
    NotificationType["CLAIM_REJECTED"] = "claim_rejected";
    NotificationType["CLAIM_SUBMITTED"] = "claim_submitted";
    NotificationType["POLICY_CREATED"] = "policy_created";
    NotificationType["POLICY_EXPIRED"] = "policy_expired";
    NotificationType["PREMIUM_DUE"] = "premium_due";
    NotificationType["GOVERNANCE_PROPOSAL"] = "governance_proposal";
    NotificationType["GOVERNANCE_VOTE_RESULT"] = "governance_vote_result";
    NotificationType["SURPLUS_DISTRIBUTION"] = "surplus_distribution";
    NotificationType["FRAUD_ALERT"] = "fraud_alert";
    NotificationType["SYSTEM_MAINTENANCE"] = "system_maintenance";
    NotificationType["WELCOME"] = "welcome";
    NotificationType["SECURITY_ALERT"] = "security_alert";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
    get isRead() {
        return this.status === NotificationStatus.READ;
    }
    get isUnread() {
        return this.status === NotificationStatus.UNREAD;
    }
    get isArchived() {
        return this.status === NotificationStatus.ARCHIVED;
    }
    get isExpired() {
        return this.expiresAt ? new Date() > this.expiresAt : false;
    }
    get isUrgent() {
        return this.priority === NotificationPriority.URGENT;
    }
    get ageInMinutes() {
        const now = new Date();
        const created = new Date(this.createdAt);
        return Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    }
    get ageInHours() {
        return Math.floor(this.ageInMinutes / 60);
    }
    get isRecentlyCreated() {
        return this.ageInMinutes < 30;
    }
    markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = new Date();
    }
    markAsClicked() {
        this.clicked = true;
        this.clickedAt = new Date();
    }
    shouldDisplay() {
        return !this.isExpired && !this.isArchived;
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: NotificationType,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: NotificationStatus,
        default: NotificationStatus.UNREAD,
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: NotificationPriority,
        default: NotificationPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], Notification.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_sent', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "emailSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_sent_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "emailSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_sent', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "pushSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_sent_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "pushSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clicked', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "clicked", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clicked_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "clickedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_attempts', default: 0 }),
    __metadata("design:type", Number)
], Notification.prototype, "deliveryAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_delivery_attempt', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "lastDeliveryAttempt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['userId', 'status']),
    (0, typeorm_1.Index)(['type', 'createdAt'])
], Notification);
//# sourceMappingURL=notification.entity.js.map