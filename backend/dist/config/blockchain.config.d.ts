export declare const blockchainConfig: (() => {
    network: string;
    chainId: number;
    rpcUrl: string;
    privateKey: string;
    contracts: {
        stablecoin: string;
        governanceToken: string;
        policyNFT: string;
        claimsEngine: string;
        surplusDistributor: string;
        governance: string;
    };
    gasLimit: number;
    gasPrice: string;
    confirmations: number;
    blockPollingInterval: number;
    eventPollingInterval: number;
    explorerUrl: string;
    bscscanApiKey: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    network: string;
    chainId: number;
    rpcUrl: string;
    privateKey: string;
    contracts: {
        stablecoin: string;
        governanceToken: string;
        policyNFT: string;
        claimsEngine: string;
        surplusDistributor: string;
        governance: string;
    };
    gasLimit: number;
    gasPrice: string;
    confirmations: number;
    blockPollingInterval: number;
    eventPollingInterval: number;
    explorerUrl: string;
    bscscanApiKey: string;
}>;
