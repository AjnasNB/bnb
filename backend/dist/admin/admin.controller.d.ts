import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';
import { ClaimsService } from '../claims/claims.service';
export declare class AdminController {
    private readonly adminService;
    private readonly usersService;
    private readonly policiesService;
    private readonly claimsService;
    constructor(adminService: AdminService, usersService: UsersService, policiesService: PoliciesService, claimsService: ClaimsService);
    getDashboard(): Promise<any>;
    getAnalytics(period?: string): Promise<any>;
    getRecentActivity(limit?: number): Promise<any[]>;
    getSystemHealth(): Promise<any>;
    exportData(entityType: string, format?: string): Promise<any>;
    getAllUsers(): Promise<import("../users/user.schema").User[]>;
    verifyUser(id: string): Promise<import("../users/user.schema").User>;
    suspendUser(id: string): Promise<import("../users/user.schema").User>;
    activateUser(id: string): Promise<import("../users/user.schema").User>;
    updateRiskScore(id: string, riskScore: number): Promise<import("../users/user.schema").User>;
    getAllPolicies(): Promise<import("../policies/policy.schema").Policy[]>;
    updatePolicyStatus(id: string, status: string): Promise<import("../policies/policy.schema").Policy>;
    getAllClaims(): Promise<import("../claims/claim.schema").Claim[]>;
    getPendingClaims(): Promise<import("../claims/claim.schema").Claim[]>;
    reviewClaim(id: string, status: string, notes: string, adjustedAmount?: number): Promise<import("../claims/claim.schema").Claim>;
    approveClaim(id: string, notes?: string): Promise<import("../claims/claim.schema").Claim>;
    rejectClaim(id: string, notes?: string): Promise<import("../claims/claim.schema").Claim>;
    processClaim(id: string): Promise<void>;
}
