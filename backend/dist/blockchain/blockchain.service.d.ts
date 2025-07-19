import { ConfigService } from '@nestjs/config';
export declare class BlockchainService {
    private configService;
    private readonly logger;
    private provider;
    private wallet;
    private insuranceContract;
    constructor(configService: ConfigService);
    private initializeBlockchain;
    mintPolicyNFT(userAddress: string, tokenId: string, coverageAmount: number, terms: string): Promise<string>;
    transferPolicyNFT(tokenId: string, fromAddress: string, toAddress: string): Promise<string>;
    submitClaim(policyTokenId: string, amount: number, aiScoreHash: string): Promise<string>;
    processClaimPayment(policyId: string, amount: number, recipientAddress: string): Promise<string>;
    getPolicyDetails(tokenId: string): Promise<any>;
    getClaimDetails(claimId: string): Promise<any>;
    getUserPolicyCount(userAddress: string): Promise<number>;
    getNetworkInfo(): Promise<any>;
    estimateGas(method: string, params: any[]): Promise<string>;
    getExternalData(dataType: string, parameters: any): Promise<any>;
    private getFlightStatus;
    private getWeatherData;
}
