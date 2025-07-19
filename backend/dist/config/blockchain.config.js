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
        stablecoin: process.env.CONTRACT_STABLECOIN_ADDRESS,
        governanceToken: process.env.CONTRACT_GOVERNANCE_TOKEN_ADDRESS,
        policyNFT: process.env.CONTRACT_POLICY_NFT_ADDRESS,
        claimsEngine: process.env.CONTRACT_CLAIMS_ENGINE_ADDRESS,
        surplusDistributor: process.env.CONTRACT_SURPLUS_DISTRIBUTOR_ADDRESS,
        governance: process.env.CONTRACT_GOVERNANCE_ADDRESS,
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