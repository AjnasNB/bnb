"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainConfig = void 0;
const config_1 = require("@nestjs/config");
exports.blockchainConfig = (0, config_1.registerAs)('blockchain', () => ({
    network: process.env.BLOCKCHAIN_NETWORK || 'bsc_testnet',
    chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID, 10) || 97,
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
    contracts: {
        stablecoin: '0x644Ed1D005Eadbaa4D4e05484AEa8e52A4DB76c8',
        governanceToken: '0xD0aa884859B93aFF4324B909fAeC619096f0Cc05',
        policyNFT: '0x2e2acdf394319b365Cc46cF587ab8a2d25Cb3312',
        claimsEngine: '0x528Bf18723c2021420070e0bB2912F881a93ca53',
        surplusDistributor: '0x95b0821Dc5C8d272Cc34C593faa76f62E7EAA2Ac',
        governance: '0x364424CBf264F54A0fFE12D99F3902B398fc0B36',
    },
    gasLimit: parseInt(process.env.BLOCKCHAIN_GAS_LIMIT, 10) || 500000,
    gasPrice: process.env.BLOCKCHAIN_GAS_PRICE || '20000000000',
    confirmations: parseInt(process.env.BLOCKCHAIN_CONFIRMATIONS, 10) || 3,
    blockPollingInterval: parseInt(process.env.BLOCKCHAIN_BLOCK_POLLING_INTERVAL, 10) || 15000,
    eventPollingInterval: parseInt(process.env.BLOCKCHAIN_EVENT_POLLING_INTERVAL, 10) || 30000,
    explorerUrl: process.env.BLOCKCHAIN_EXPLORER_URL || 'https://testnet.bscscan.com',
    bscscanApiKey: process.env.BSCSCAN_API_KEY,
}));
//# sourceMappingURL=blockchain.config.js.map