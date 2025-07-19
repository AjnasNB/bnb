import { BlockchainService } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    getNetworkInfo(): Promise<any>;
    getPolicyDetails(tokenId: string): Promise<any>;
    getClaimDetails(claimId: string): Promise<any>;
    getUserPolicyCount(address: string): Promise<number>;
    estimateGas(method: string, params: any[]): Promise<string>;
    getExternalData(dataType: string, parameters: any): Promise<any>;
    transferPolicy(tokenId: string, fromAddress: string, toAddress: string): Promise<string>;
    submitClaim(policyTokenId: string, amount: number, aiScoreHash: string): Promise<string>;
}
