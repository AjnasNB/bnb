import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: ({
            id: string;
            userId: string;
            type: string;
            title: string;
            message: string;
            data: {
                claimId: string;
                amount: number;
                dueDate?: undefined;
                proposalId?: undefined;
            };
            read: boolean;
            createdAt: string;
        } | {
            id: string;
            userId: string;
            type: string;
            title: string;
            message: string;
            data: {
                amount: number;
                dueDate: string;
                claimId?: undefined;
                proposalId?: undefined;
            };
            read: boolean;
            createdAt: string;
        } | {
            id: string;
            userId: string;
            type: string;
            title: string;
            message: string;
            data: {
                proposalId: string;
                claimId?: undefined;
                amount?: undefined;
                dueDate?: undefined;
            };
            read: boolean;
            createdAt: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUnreadCount(userId: string): Promise<{
        userId: string;
        unreadCount: number;
        lastChecked: string;
    }>;
    createNotification(notificationData: any): Promise<{
        success: boolean;
        notification: any;
        message: string;
    }>;
    markAsRead(id: string): Promise<{
        success: boolean;
        notificationId: string;
        message: string;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
        userId: string;
        updatedCount: number;
        message: string;
    }>;
    deleteNotification(id: string): Promise<{
        success: boolean;
        notificationId: string;
        message: string;
    }>;
    broadcastNotification(notificationData: any): Promise<{
        success: boolean;
        broadcastId: string;
        recipients: number;
        message: string;
        data: any;
    }>;
    getTemplates(): Promise<{
        templates: {
            id: string;
            name: string;
            subject: string;
            template: string;
            variables: string[];
        }[];
    }>;
}
