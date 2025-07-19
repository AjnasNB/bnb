export declare class GovernanceService {
    getProposals(): Promise<{
        proposals: {
            id: string;
            title: string;
            description: string;
            status: string;
            votesFor: string;
            votesAgainst: string;
            endTime: string;
        }[];
        total: number;
    }>;
    healthCheck(): Promise<{
        status: string;
        message: string;
        timestamp: string;
    }>;
}
