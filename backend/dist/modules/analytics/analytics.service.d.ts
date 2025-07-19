export declare class AnalyticsService {
    private readonly logger;
    getDashboardAnalytics(): Promise<{
        totalPolicies: number;
        activeClaims: number;
        totalStaked: string;
        monthlyPremiums: string;
        claimsProcessed: number;
        fraudDetected: number;
        avgProcessingTime: string;
        customerSatisfaction: number;
        trends: {
            policies: string;
            claims: string;
            fraud: string;
            satisfaction: string;
        };
        recentActivity: {
            type: string;
            amount: string;
            user: string;
            time: string;
        }[];
    }>;
    getClaimsStats(period?: string): Promise<{
        period: string;
        stats: any;
        byType: {
            health: {
                count: number;
                percentage: number;
            };
            vehicle: {
                count: number;
                percentage: number;
            };
            travel: {
                count: number;
                percentage: number;
            };
            other: {
                count: number;
                percentage: number;
            };
        };
        fraudDetection: {
            flaggedClaims: number;
            fraudRate: number;
            savedAmount: string;
        };
        aiPerformance: {
            accuracy: number;
            processingSpeed: string;
            confidenceScore: number;
        };
    }>;
    getPoliciesStats(period?: string): Promise<{
        period: string;
        totalPolicies: number;
        activePolicies: number;
        newPolicies: number;
        renewals: number;
        cancellations: number;
        byType: {
            health: {
                count: number;
                premium: string;
                coverage: string;
            };
            vehicle: {
                count: number;
                premium: string;
                coverage: string;
            };
            travel: {
                count: number;
                premium: string;
                coverage: string;
            };
            pet: {
                count: number;
                premium: string;
                coverage: string;
            };
        };
        premiumCollection: {
            total: string;
            onTime: string;
            overdue: string;
        };
        customerRetention: {
            rate: string;
            avgTenure: string;
            churnRate: string;
        };
    }>;
    getFinancialOverview(): Promise<{
        treasury: {
            totalFunds: string;
            stablecoin: string;
            bnb: string;
            invested: string;
        };
        revenue: {
            monthly: string;
            yearly: string;
            growth: string;
        };
        expenses: {
            claims: string;
            operations: string;
            development: string;
        };
        reserves: {
            total: string;
            ratio: string;
            recommended: string;
            status: string;
        };
        surplus: {
            available: string;
            distributed: string;
            pendingDistribution: string;
        };
    }>;
    getAIInsights(): Promise<{
        processing: {
            totalDocuments: number;
            dailyAverage: number;
            successRate: string;
            avgProcessingTime: string;
        };
        fraudDetection: {
            totalAnalyzed: number;
            flaggedSuspicious: number;
            confirmedFraud: number;
            savedAmount: string;
            accuracy: string;
        };
        geminiIntegration: {
            apiCalls: number;
            successRate: string;
            avgResponseTime: string;
            insights: string[];
        };
        modelPerformance: {
            ocrAccuracy: string;
            imageAnalysis: string;
            textClassification: string;
        };
    }>;
    getBlockchainMetrics(): Promise<{
        network: {
            name: string;
            status: string;
            blockHeight: number;
            gasPrice: string;
        };
        contracts: {
            stablecoin: {
                address: string;
                totalSupply: string;
                holders: number;
            };
            governance: {
                address: string;
                totalStaked: string;
                voters: number;
            };
            policies: {
                address: string;
                totalPolicies: number;
                activeNFTs: number;
            };
        };
        transactions: {
            total: number;
            today: number;
            avgGasUsed: string;
            totalFees: string;
        };
        governance: {
            activeProposals: number;
            totalVotes: number;
            participationRate: string;
            avgVotingPower: string;
        };
    }>;
}
