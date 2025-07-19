import { GovernanceService } from './governance.service';
export declare class GovernanceController {
    private readonly governanceService;
    constructor(governanceService: GovernanceService);
    getProposals(): Promise<{
        proposals: any[];
        message: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        message: string;
    }>;
}
