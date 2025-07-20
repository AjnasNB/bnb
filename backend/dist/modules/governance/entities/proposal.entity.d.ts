import { Vote } from './vote.entity';
export declare enum ProposalStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PASSED = "passed",
    REJECTED = "rejected",
    EXECUTED = "executed"
}
export declare class Proposal {
    id: string;
    title: string;
    description: string;
    proposerId: string;
    status: ProposalStatus;
    startTime: Date;
    endTime: Date;
    votesFor: string;
    votesAgainst: string;
    totalVotingPower: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    votes: Vote[];
}
