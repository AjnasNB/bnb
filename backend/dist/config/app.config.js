"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
exports.AppConfig = {
    app: {
        name: 'ChainSure Backend',
        version: '1.0.0',
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    },
    database: {
        path: process.env.DATABASE_PATH || 'db/chainsure.db',
        logging: process.env.DATABASE_LOGGING === 'true' || false,
        synchronize: true,
        autoLoadEntities: true,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'chainsure-secret-key-development-only',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'chainsure-refresh-secret-development-only',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    blockchain: {
        network: 'bsc_testnet',
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        explorerUrl: 'https://testnet.bscscan.com',
        gasLimit: 500000,
        gasPrice: '20000000000',
        confirmations: 3,
        privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
    },
    contracts: {
        stablecoin: '0x644Ed1D005Eadbaa4D4e05484AEa8e52A4DB76c8',
        governanceToken: '0xD0aa884859B93aFF4324B909fAeC619096f0Cc05',
        policyNFT: '0x2e2acdf394319b365Cc46cF587ab8a2d25Cb3312',
        claimsEngine: '0x528Bf18723c2021420070e0bB2912F881a93ca53',
        surplusDistributor: '0x95b0821Dc5C8d272Cc34C593faa76f62E7EAA2Ac',
        governance: '0x364424CBf264F54A0fFE12D99F3902B398fc0B36',
    },
    aiService: {
        url: process.env.AI_SERVICE_URL || 'http://localhost:8001',
        apiKey: process.env.AI_SERVICE_API_KEY || 'chainsure_backend_key_2024',
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT || '30000'),
        fraudThreshold: parseInt(process.env.AI_FRAUD_THRESHOLD || '80'),
        confidenceThreshold: parseInt(process.env.AI_CONFIDENCE_THRESHOLD || '70'),
        enableFraudDetection: process.env.AI_ENABLE_FRAUD_DETECTION !== 'false',
        enableDocumentAnalysis: process.env.AI_ENABLE_DOCUMENT_ANALYSIS !== 'false',
        enableImageAnalysis: process.env.AI_ENABLE_IMAGE_ANALYSIS !== 'false',
        maxFileSize: parseInt(process.env.AI_MAX_FILE_SIZE || '52428800'),
        allowedFileTypes: (process.env.AI_ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,bmp,tiff').split(','),
    },
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
        sessionSecret: process.env.SESSION_SECRET || 'chainsure-session-secret-development-only',
        webhookSecret: process.env.WEBHOOK_SECRET || 'chainsure-webhook-secret',
        corsOrigins: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            process.env.FRONTEND_URL || 'http://localhost:3001'
        ],
    },
    rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'),
        max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
        uploadPath: process.env.UPLOAD_PATH || 'uploads',
        allowedMimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/bmp',
            'image/tiff',
        ],
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json',
    },
    email: {
        from: process.env.EMAIL_FROM || 'noreply@chainsure.com',
        provider: process.env.EMAIL_PROVIDER || 'smtp',
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
            secure: process.env.SMTP_SECURE === 'true',
        },
    },
    features: {
        enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
        enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
        enable2FA: process.env.ENABLE_2FA === 'true',
        enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
    },
    maintenance: {
        mode: process.env.MAINTENANCE_MODE === 'true',
        message: process.env.MAINTENANCE_MESSAGE || 'System is under maintenance. Please try again later.',
    },
    external: {
        ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs',
        analyticsProvider: process.env.ANALYTICS_PROVIDER || 'internal',
    },
    business: {
        minimumStakeAmount: '1000000000000000000000',
        maximumClaimAmount: '100000000000000000000000',
        claimProcessingTimeout: 24 * 60 * 60 * 1000,
        policyValidityPeriod: 365 * 24 * 60 * 60 * 1000,
        juryVotingPeriod: 3 * 24 * 60 * 60 * 1000,
        minimumJurySize: 5,
        maximumJurySize: 15,
        consensusThreshold: 60,
    },
};
exports.default = exports.AppConfig;
//# sourceMappingURL=app.config.js.map