export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read",
    ARCHIVED = "archived"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum NotificationType {
    CLAIM_APPROVED = "claim_approved",
    CLAIM_REJECTED = "claim_rejected",
    CLAIM_SUBMITTED = "claim_submitted",
    POLICY_CREATED = "policy_created",
    POLICY_EXPIRED = "policy_expired",
    PREMIUM_DUE = "premium_due",
    GOVERNANCE_PROPOSAL = "governance_proposal",
    GOVERNANCE_VOTE_RESULT = "governance_vote_result",
    SURPLUS_DISTRIBUTION = "surplus_distribution",
    FRAUD_ALERT = "fraud_alert",
    SYSTEM_MAINTENANCE = "system_maintenance",
    WELCOME = "welcome",
    SECURITY_ALERT = "security_alert"
}
export declare class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    status: NotificationStatus;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: {
        claimId?: string;
        policyId?: string;
        proposalId?: string;
        amount?: string;
        actionUrl?: string;
        metadata?: any;
    };
    actions?: Array<{
        label: string;
        url: string;
        style?: 'primary' | 'secondary' | 'danger';
    }>;
    readAt?: Date;
    expiresAt?: Date;
    emailSent: boolean;
    emailSentAt?: Date;
    pushSent: boolean;
    pushSentAt?: Date;
    clicked: boolean;
    clickedAt?: Date;
    deliveryAttempts: number;
    lastDeliveryAttempt?: Date;
    createdAt: Date;
    updatedAt: Date;
    get isRead(): boolean;
    get isUnread(): boolean;
    get isArchived(): boolean;
    get isExpired(): boolean;
    get isUrgent(): boolean;
    get ageInMinutes(): number;
    get ageInHours(): number;
    get isRecentlyCreated(): boolean;
    markAsRead(): void;
    markAsClicked(): void;
    shouldDisplay(): boolean;
}
