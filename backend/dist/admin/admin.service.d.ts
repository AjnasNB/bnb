import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';
import { ClaimsService } from '../claims/claims.service';
import { FilesService } from '../files/files.service';
export declare class AdminService {
    private usersService;
    private policiesService;
    private claimsService;
    private filesService;
    constructor(usersService: UsersService, policiesService: PoliciesService, claimsService: ClaimsService, filesService: FilesService);
    getDashboardStats(): Promise<any>;
    getUserStatistics(): Promise<any>;
    getPolicyStatistics(): Promise<any>;
    getRecentActivity(limit?: number): Promise<any[]>;
    getSystemHealth(): Promise<any>;
    exportData(entityType: string, format?: string): Promise<any>;
    private convertToCSV;
    getAnalytics(period?: string): Promise<any>;
}
