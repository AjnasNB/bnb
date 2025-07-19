export declare const AppConfig: {
    app: {
        name: string;
        version: string;
        port: string | number;
        environment: string;
        frontendUrl: string;
    };
    database: {
        path: string;
        logging: boolean;
        synchronize: boolean;
        autoLoadEntities: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    blockchain: {
        network: string;
        chainId: number;
        rpcUrl: string;
        explorerUrl: string;
        gasLimit: number;
        gasPrice: string;
        confirmations: number;
        privateKey: string;
    };
    contracts: {
        stablecoin: string;
        governanceToken: string;
        policyNFT: string;
        claimsEngine: string;
        surplusDistributor: string;
        governance: string;
    };
    aiService: {
        url: string;
        apiKey: string;
        timeout: number;
        fraudThreshold: number;
        confidenceThreshold: number;
        enableFraudDetection: boolean;
        enableDocumentAnalysis: boolean;
        enableImageAnalysis: boolean;
        maxFileSize: number;
        allowedFileTypes: string[];
    };
    security: {
        bcryptRounds: number;
        sessionSecret: string;
        webhookSecret: string;
        corsOrigins: string[];
    };
    rateLimit: {
        ttl: number;
        max: number;
    };
    upload: {
        maxFileSize: number;
        uploadPath: string;
        allowedMimeTypes: string[];
    };
    logging: {
        level: string;
        format: string;
    };
    email: {
        from: string;
        provider: string;
        smtp: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure: boolean;
        };
    };
    features: {
        enableRegistration: boolean;
        enableEmailVerification: boolean;
        enable2FA: boolean;
        enableAnalytics: boolean;
    };
    maintenance: {
        mode: boolean;
        message: string;
    };
    external: {
        ipfsGateway: string;
        analyticsProvider: string;
    };
    business: {
        minimumStakeAmount: string;
        maximumClaimAmount: string;
        claimProcessingTimeout: number;
        policyValidityPeriod: number;
        juryVotingPeriod: number;
        minimumJurySize: number;
        maximumJurySize: number;
        consensusThreshold: number;
    };
};
export default AppConfig;
