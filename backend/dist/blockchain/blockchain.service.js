"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
const INSURANCE_CONTRACT_ABI = [
    'function mintPolicy(address to, uint256 tokenId, uint256 coverageAmount, string memory terms) external returns (bool)',
    'function transferPolicy(uint256 tokenId, address to) external returns (bool)',
    'function submitClaim(uint256 policyTokenId, uint256 amount, bytes32 aiScoreHash) external returns (uint256)',
    'function approveClaim(uint256 claimId, uint256 amount) external returns (bool)',
    'function processClaim(uint256 claimId) external returns (bool)',
    'function getPolicyDetails(uint256 tokenId) external view returns (tuple(address owner, uint256 coverage, bool active))',
    'function getClaimDetails(uint256 claimId) external view returns (tuple(uint256 policyId, uint256 amount, uint8 status))',
    'function balanceOf(address owner) external view returns (uint256)',
    'function ownerOf(uint256 tokenId) external view returns (address)',
    'event PolicyMinted(address indexed owner, uint256 indexed tokenId, uint256 coverage)',
    'event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, uint256 amount)',
    'event ClaimProcessed(uint256 indexed claimId, uint256 amount, address recipient)',
];
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.initializeBlockchain();
    }
    initializeBlockchain() {
        try {
            const rpcUrl = this.configService.get('BSC_TESTNET_RPC_URL');
            this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
            const privateKey = this.configService.get('DEPLOYER_PRIVATE_KEY');
            this.wallet = new ethers_1.ethers.Wallet(privateKey, this.provider);
            const contractAddress = this.configService.get('INSURANCE_CONTRACT_ADDRESS');
            if (contractAddress && contractAddress !== '0x...') {
                this.insuranceContract = new ethers_1.ethers.Contract(contractAddress, INSURANCE_CONTRACT_ABI, this.wallet);
            }
            this.logger.log('Blockchain service initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize blockchain service:', error);
        }
    }
    async mintPolicyNFT(userAddress, tokenId, coverageAmount, terms) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const tx = await this.insuranceContract.mintPolicy(userAddress, tokenId, coverageAmount.toString(), terms, {
                gasLimit: 500000,
            });
            await tx.wait();
            this.logger.log(`Policy NFT minted: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to mint policy NFT:', error);
            throw error;
        }
    }
    async transferPolicyNFT(tokenId, fromAddress, toAddress) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const owner = await this.insuranceContract.ownerOf(tokenId);
            if (owner.toLowerCase() !== fromAddress.toLowerCase()) {
                throw new Error('Sender does not own this policy');
            }
            const tx = await this.insuranceContract.transferPolicy(tokenId, toAddress, {
                gasLimit: 300000,
            });
            await tx.wait();
            this.logger.log(`Policy transferred: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to transfer policy NFT:', error);
            throw error;
        }
    }
    async submitClaim(policyTokenId, amount, aiScoreHash) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const scoreHashBytes = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(aiScoreHash));
            const tx = await this.insuranceContract.submitClaim(policyTokenId, amount.toString(), scoreHashBytes, {
                gasLimit: 400000,
            });
            await tx.wait();
            this.logger.log(`Claim submitted: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to submit claim:', error);
            throw error;
        }
    }
    async processClaimPayment(policyId, amount, recipientAddress) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const tx = await this.wallet.sendTransaction({
                to: recipientAddress,
                value: amount.toString(),
                gasLimit: 21000,
            });
            await tx.wait();
            this.logger.log(`Claim payment processed: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to process claim payment:', error);
            throw error;
        }
    }
    async getPolicyDetails(tokenId) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const details = await this.insuranceContract.getPolicyDetails(tokenId);
            return {
                owner: details[0],
                coverage: details[1].toString(),
                active: details[2],
            };
        }
        catch (error) {
            this.logger.error('Failed to get policy details:', error);
            throw error;
        }
    }
    async getClaimDetails(claimId) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const details = await this.insuranceContract.getClaimDetails(claimId);
            return {
                policyId: details[0].toString(),
                amount: details[1].toString(),
                status: details[2],
            };
        }
        catch (error) {
            this.logger.error('Failed to get claim details:', error);
            throw error;
        }
    }
    async getUserPolicyCount(userAddress) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const balance = await this.insuranceContract.balanceOf(userAddress);
            return parseInt(balance.toString());
        }
        catch (error) {
            this.logger.error('Failed to get user policy count:', error);
            throw error;
        }
    }
    async getNetworkInfo() {
        try {
            const network = await this.provider.getNetwork();
            const blockNumber = await this.provider.getBlockNumber();
            const gasPrice = await this.provider.getFeeData();
            return {
                chainId: network.chainId.toString(),
                name: network.name,
                blockNumber,
                gasPrice: gasPrice.gasPrice?.toString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to get network info:', error);
            throw error;
        }
    }
    async estimateGas(method, params) {
        try {
            if (!this.insuranceContract) {
                throw new Error('Insurance contract not initialized');
            }
            const estimatedGas = await this.insuranceContract[method].estimateGas(...params);
            return estimatedGas.toString();
        }
        catch (error) {
            this.logger.error('Failed to estimate gas:', error);
            throw error;
        }
    }
    async getExternalData(dataType, parameters) {
        try {
            switch (dataType) {
                case 'flight_status':
                    return this.getFlightStatus(parameters.flightNumber, parameters.date);
                case 'weather_data':
                    return this.getWeatherData(parameters.location, parameters.date);
                default:
                    throw new Error(`Unsupported data type: ${dataType}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to fetch external data:', error);
            throw error;
        }
    }
    async getFlightStatus(flightNumber, date) {
        return {
            flightNumber,
            date,
            status: 'on_time',
            delay: 0,
            gate: 'A1',
        };
    }
    async getWeatherData(location, date) {
        return {
            location,
            date,
            temperature: 25,
            humidity: 60,
            conditions: 'clear',
            windSpeed: 10,
        };
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map