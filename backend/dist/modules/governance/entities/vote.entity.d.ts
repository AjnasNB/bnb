export declare enum VoteChoice {
    FOR = "for",
    AGAINST = "against",
    ABSTAIN = "abstain"
}
export declare class Vote {
    id: string;
    userId: string;
    proposalId: string;
    claimId: string;
    choice: VoteChoice;
    suggestedAmount: string;
    reasoning: string;
    votingPower: string;
    createdAt: Date;
}
