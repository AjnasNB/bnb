"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor() {
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async getUserNotifications(userId, pagination) {
        const mockNotifications = [
            {
                id: '1',
                userId,
                type: 'claim_approved',
                title: 'Claim Approved',
                message: 'Your health insurance claim #CL-2024-001 has been approved for $1,250.',
                data: { claimId: 'CL-2024-001', amount: 1250 },
                read: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: '2',
                userId,
                type: 'policy_reminder',
                title: 'Premium Due',
                message: 'Your monthly premium of $150 is due in 3 days.',
                data: { amount: 150, dueDate: '2024-07-22' },
                read: false,
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: '3',
                userId,
                type: 'governance_proposal',
                title: 'New Governance Proposal',
                message: 'A new proposal "Increase Coverage Limits" is now available for voting.',
                data: { proposalId: 'PROP-2024-003' },
                read: true,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
        const { page, limit } = pagination;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return {
            notifications: mockNotifications.slice(startIndex, endIndex),
            total: mockNotifications.length,
            page,
            limit,
            totalPages: Math.ceil(mockNotifications.length / limit),
        };
    }
    async getUnreadCount(userId) {
        return {
            userId,
            unreadCount: 2,
            lastChecked: new Date().toISOString(),
        };
    }
    async createNotification(notificationData) {
        this.logger.log(`Creating notification for user ${notificationData.userId}`);
        const notification = {
            id: `notif_${Date.now()}`,
            ...notificationData,
            read: false,
            createdAt: new Date().toISOString(),
        };
        return {
            success: true,
            notification,
            message: 'Notification created successfully',
        };
    }
    async markAsRead(notificationId) {
        this.logger.log(`Marking notification ${notificationId} as read`);
        return {
            success: true,
            notificationId,
            message: 'Notification marked as read',
        };
    }
    async markAllAsRead(userId) {
        this.logger.log(`Marking all notifications as read for user ${userId}`);
        return {
            success: true,
            userId,
            updatedCount: 2,
            message: 'All notifications marked as read',
        };
    }
    async deleteNotification(notificationId) {
        this.logger.log(`Deleting notification ${notificationId}`);
        return {
            success: true,
            notificationId,
            message: 'Notification deleted successfully',
        };
    }
    async broadcastNotification(notificationData) {
        this.logger.log(`Broadcasting notification: ${notificationData.title}`);
        return {
            success: true,
            broadcastId: `broadcast_${Date.now()}`,
            recipients: 1247,
            message: 'Notification broadcasted successfully',
            data: notificationData,
        };
    }
    async getTemplates() {
        return {
            templates: [
                {
                    id: 'claim_approved',
                    name: 'Claim Approved',
                    subject: 'Your claim has been approved',
                    template: 'Your {{claimType}} claim #{{claimId}} has been approved for ${{amount}}.',
                    variables: ['claimType', 'claimId', 'amount'],
                },
                {
                    id: 'claim_rejected',
                    name: 'Claim Rejected',
                    subject: 'Your claim requires attention',
                    template: 'Your {{claimType}} claim #{{claimId}} has been rejected. Reason: {{reason}}',
                    variables: ['claimType', 'claimId', 'reason'],
                },
                {
                    id: 'premium_due',
                    name: 'Premium Due',
                    subject: 'Premium payment reminder',
                    template: 'Your monthly premium of ${{amount}} is due on {{dueDate}}.',
                    variables: ['amount', 'dueDate'],
                },
                {
                    id: 'governance_vote',
                    name: 'Governance Proposal',
                    subject: 'New governance proposal available',
                    template: 'A new proposal "{{proposalTitle}}" is available for voting until {{endDate}}.',
                    variables: ['proposalTitle', 'endDate'],
                },
                {
                    id: 'policy_created',
                    name: 'Policy Created',
                    subject: 'Welcome to ChainSure',
                    template: 'Your {{policyType}} policy has been created successfully. Policy ID: {{policyId}}',
                    variables: ['policyType', 'policyId'],
                },
            ],
        };
    }
    async sendClaimNotification(userId, claimData, status) {
        const templates = {
            approved: {
                type: 'claim_approved',
                title: 'Claim Approved',
                message: `Your ${claimData.type} claim #${claimData.id} has been approved for $${claimData.amount}.`,
            },
            rejected: {
                type: 'claim_rejected',
                title: 'Claim Rejected',
                message: `Your ${claimData.type} claim #${claimData.id} has been rejected. Please review and resubmit if needed.`,
            },
            under_review: {
                type: 'claim_review',
                title: 'Claim Under Review',
                message: `Your ${claimData.type} claim #${claimData.id} is currently under review. We'll notify you once processed.`,
            },
        };
        const template = templates[status];
        if (template) {
            return this.createNotification({
                userId,
                ...template,
                data: claimData,
            });
        }
    }
    async sendGovernanceNotification(userId, proposalData) {
        return this.createNotification({
            userId,
            type: 'governance_proposal',
            title: 'New Governance Proposal',
            message: `A new proposal "${proposalData.title}" is now available for voting.`,
            data: proposalData,
        });
    }
    async sendPremiumReminder(userId, premiumData) {
        return this.createNotification({
            userId,
            type: 'premium_reminder',
            title: 'Premium Due',
            message: `Your monthly premium of $${premiumData.amount} is due in ${premiumData.daysUntilDue} days.`,
            data: premiumData,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map