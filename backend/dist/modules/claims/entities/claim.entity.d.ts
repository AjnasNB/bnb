export declare class Claim {
    id: string;
    userId: string;
    policyId: string;
    type: string;
    status: string;
    requestedAmount: string;
    approvedAmount: string;
    description: string;
    documents: string[];
    images: string[];
    aiAnalysis: any;
    reviewNotes: any;
    transactionHash: string;
    createdAt: Date;
    updatedAt: Date;
}
