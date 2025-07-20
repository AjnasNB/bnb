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
var ContractService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const blockchain_service_1 = require("./blockchain.service");
const app_config_1 = require("../../config/app.config");
let ContractService = ContractService_1 = class ContractService {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
        this.logger = new common_1.Logger(ContractService_1.name);
        this.contracts = {};
        this.initializeContracts();
    }
    async initializeContracts() {
        try {
            const provider = this.blockchainService.getProvider();
            const erc20Abi = [
                'function name() view returns (string)',
                'function symbol() view returns (string)',
                'function decimals() view returns (uint8)',
                'function totalSupply() view returns (uint256)',
                'function balanceOf(address) view returns (uint256)',
                'function transfer(address to, uint256 amount) returns (bool)',
                'function approve(address spender, uint256 amount) returns (bool)',
                'function allowance(address owner, address spender) view returns (uint256)',
                'event Transfer(address indexed from, address indexed to, uint256 value)',
                'event Approval(address indexed owner, address indexed spender, uint256 value)'
            ];
            const erc721Abi = [
                'function name() view returns (string)',
                'function symbol() view returns (string)',
                'function ownerOf(uint256 tokenId) view returns (address)',
                'function tokenURI(uint256 tokenId) view returns (string)',
                'function totalSupply() view returns (uint256)',
                'function mint(address to, uint256 tokenId, string uri)',
                'function safeMint(address to, uint256 tokenId, string uri)',
                'function transferFrom(address from, address to, uint256 tokenId)',
                'function approve(address to, uint256 tokenId)',
                'function getApproved(uint256 tokenId) view returns (address)',
                'function isApprovedForAll(address owner, address operator) view returns (bool)',
                'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
                'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
                'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)'
            ];
            const policyNFTAbi = [
                ...erc721Abi,
                'function createPolicy(address to, uint8 policyType, uint256 coverageAmount, address beneficiary, string coverageTerms, bytes32 ipfsHash, uint256 customTermLength) returns (uint256)',
                'function getPolicyData(uint256 tokenId) view returns (uint8 policyType, uint8 status, address policyholder, address beneficiary, uint256 coverageAmount, uint256 premium, uint256 creationDate, uint256 expiryDate, uint256 claimedAmount, string coverageTerms, bytes32 ipfsHash)',
                'function calculatePremium(uint8 policyType, uint256 coverageAmount) view returns (uint256)',
                'function isPolicyActive(uint256 tokenId) view returns (bool)',
                'function getRemainingCoverage(uint256 tokenId) view returns (uint256)',
                'function totalSupply() view returns (uint256)',
                'function ownerOf(uint256 tokenId) view returns (address)',
                'event PolicyCreated(uint256 indexed tokenId, address indexed policyholder, uint8 policyType, uint256 coverageAmount, uint256 premium, uint256 expiryDate)',
                'event PolicyExpired(uint256 indexed tokenId)',
                'event PolicyCancelled(uint256 indexed tokenId)'
            ];
            const claimsEngineAbi = [
                'function submitClaim(uint256 policyId, uint256 amount, string description, bytes32[] evidenceHashes) returns (uint256)',
                'function getClaim(uint256 claimId) view returns (uint256 policyId, address claimant, uint256 requestedAmount, string description, uint256 status, uint256 submissionTime, uint256 approvedAmount, uint256 fraudScore, uint8 claimType, bytes32[] evidenceHashes)',
                'function approveClaim(uint256 claimId, uint256 approvedAmount)',
                'function rejectClaim(uint256 claimId, string reason)',
                'function castVote(uint256 claimId, bool approved, uint256 suggestedAmount, string justification)',
                'function getJuryVoting(uint256 claimId) view returns (address[] jurors, uint256 votesFor, uint256 votesAgainst, uint256 totalVotes, uint256 averageAmount, bool concluded)',
                'function getClaimCount() view returns (uint256)',
                'event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, uint256 amount)',
                'event ClaimApproved(uint256 indexed claimId, uint256 approvedAmount)',
                'event ClaimRejected(uint256 indexed claimId, string reason)',
                'event VoteCast(uint256 indexed claimId, address indexed juror, bool approved, uint256 suggestedAmount)'
            ];
            const governanceAbi = [
                'function createProposal(string title, string description, uint256 votingPeriod) returns (uint256)',
                'function vote(uint256 proposalId, bool support, string reason)',
                'function executeProposal(uint256 proposalId)',
                'function getProposalDetails(uint256 proposalId) view returns (string title, string description, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, bool executed)',
                'function getProposalCount() view returns (uint256)',
                'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
                'function getVotingPower(address voter) view returns (uint256)',
                'event ProposalCreated(uint256 indexed proposalId, string title, string description)',
                'event Voted(uint256 indexed proposalId, address indexed voter, bool support, string reason)',
                'event ProposalExecuted(uint256 indexed proposalId)'
            ];
            this.contracts = {
                stablecoin: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.stablecoin, erc20Abi, provider),
                governanceToken: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.governanceToken, erc20Abi, provider),
                policyNFT: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.policyNFT, policyNFTAbi, provider),
                claimsEngine: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.claimsEngine, claimsEngineAbi, provider),
                governance: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.governance, governanceAbi, provider),
                surplusDistributor: new ethers_1.ethers.Contract(app_config_1.AppConfig.contracts.surplusDistributor, erc20Abi, provider),
            };
            this.logger.log('Blockchain contracts initialized successfully');
        }
        catch (error) {
            this.logger.error(`Failed to initialize contracts: ${error.message}`);
        }
    }
    getContractAddresses() {
        return {
            stablecoin: app_config_1.AppConfig.contracts.stablecoin,
            governanceToken: app_config_1.AppConfig.contracts.governanceToken,
            policyNFT: app_config_1.AppConfig.contracts.policyNFT,
            claimsEngine: app_config_1.AppConfig.contracts.claimsEngine,
            governance: app_config_1.AppConfig.contracts.governance,
            surplusDistributor: app_config_1.AppConfig.contracts.surplusDistributor,
            network: app_config_1.AppConfig.blockchain.network,
            chainId: app_config_1.AppConfig.blockchain.chainId,
            rpcUrl: app_config_1.AppConfig.blockchain.rpcUrl,
        };
    }
    async getTokenBalances(address) {
        try {
            const balances = await Promise.all([
                this.getTokenInfo('stablecoin'),
                this.getTokenInfo('governanceToken'),
            ]);
            const [stablecoinBalance, governanceBalance] = await Promise.all([
                this.contracts.stablecoin.balanceOf(address),
                this.contracts.governanceToken.balanceOf(address),
            ]);
            return {
                address,
                tokens: {
                    stablecoin: {
                        ...balances[0],
                        balance: ethers_1.ethers.formatEther(stablecoinBalance),
                        balanceWei: stablecoinBalance.toString(),
                    },
                    governanceToken: {
                        ...balances[1],
                        balance: ethers_1.ethers.formatEther(governanceBalance),
                        balanceWei: governanceBalance.toString(),
                    },
                },
                nftPolicies: await this.getUserPolicies(address),
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Failed to get token balances for ${address}: ${error.message}`);
            throw error;
        }
    }
    async getTokenInfo(contractKey) {
        try {
            const contract = this.contracts[contractKey];
            const [name, symbol] = await Promise.all([
                contract.name(),
                contract.symbol(),
            ]);
            const result = { name, symbol };
            if (contractKey !== 'policyNFT') {
                const totalSupply = await contract.totalSupply();
                result.totalSupply = ethers_1.ethers.formatEther(totalSupply);
                result.totalSupplyWei = totalSupply.toString();
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to get token info for ${contractKey}: ${error.message}`);
            return {
                name: 'Unknown',
                symbol: 'UNKNOWN',
                totalSupply: '0',
            };
        }
    }
    async createPolicy(policyData) {
        try {
            this.logger.log(`Creating policy for ${policyData.holder}`);
            const policyTypeMap = {
                'health': 0,
                'vehicle': 1,
                'travel': 2,
                'product': 3,
                'pet': 4,
                'agricultural': 5
            };
            const policyType = policyTypeMap[policyData.type] || 0;
            const coverageAmount = ethers_1.ethers.parseEther(policyData.coverageAmount.toString());
            const beneficiary = policyData.beneficiary || policyData.holder;
            const coverageTerms = policyData.terms || 'Standard coverage terms apply';
            const ipfsHash = ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(policyData.metadataHash || 'QmDefaultPolicyMetadata'));
            const customTermLength = policyData.duration ? policyData.duration * 24 * 60 * 60 : 0;
            const premium = await this.contracts.policyNFT.calculatePremium(policyType, coverageAmount);
            const allowance = await this.contracts.stablecoin.allowance(policyData.holder, app_config_1.AppConfig.contracts.policyNFT);
            let approvalTransaction = null;
            if (allowance < premium) {
                const approveData = this.contracts.stablecoin.interface.encodeFunctionData('approve', [
                    app_config_1.AppConfig.contracts.policyNFT,
                    premium
                ]);
                approvalTransaction = {
                    to: app_config_1.AppConfig.contracts.stablecoin,
                    data: approveData,
                    estimatedGas: '100000',
                    value: '0',
                    note: 'Approve PolicyNFT contract to spend your stablecoin tokens'
                };
            }
            const createPolicyData = this.contracts.policyNFT.interface.encodeFunctionData('createPolicy', [
                policyData.holder,
                policyType,
                coverageAmount,
                beneficiary,
                coverageTerms,
                ipfsHash,
                customTermLength
            ]);
            return {
                success: true,
                message: 'Policy creation data prepared',
                policyData: {
                    ...policyData,
                    policyType,
                    coverageAmount: policyData.coverageAmount,
                    premiumAmount: ethers_1.ethers.formatEther(premium),
                    premiumInStablecoin: ethers_1.ethers.formatEther(premium),
                    beneficiary,
                    coverageTerms,
                    customTermLength,
                    needsApproval: allowance < premium,
                },
                transactions: {
                    approval: approvalTransaction,
                    createPolicy: {
                        to: app_config_1.AppConfig.contracts.policyNFT,
                        data: createPolicyData,
                        estimatedGas: '500000',
                        value: '0',
                        note: 'Create the insurance policy NFT'
                    }
                },
                contractAddress: app_config_1.AppConfig.contracts.policyNFT,
                note: `Premium: ${ethers_1.ethers.formatEther(premium)} stablecoin tokens. ${approvalTransaction ? 'First approve, then create policy.' : 'Ready to create policy.'}`
            };
        }
        catch (error) {
            this.logger.error(`Failed to create policy: ${error.message}`);
            return {
                success: false,
                message: 'Policy creation failed',
                error: error.message.includes('insufficient allowance')
                    ? 'Please approve the contract to spend your stablecoin tokens first'
                    : error.message,
                policyData: {
                    ...policyData,
                    needsApproval: true,
                },
                note: 'You need to approve the PolicyNFT contract to spend your stablecoin tokens before creating a policy'
            };
        }
    }
    async submitClaim(claimData) {
        try {
            this.logger.log(`Submitting claim for policy ${claimData.policyTokenId}`);
            const policyDetails = await this.getPolicyDetails(claimData.policyTokenId);
            if (!policyDetails.exists) {
                throw new Error('Policy does not exist');
            }
            const expiryDate = new Date(policyDetails.details.expiryDate);
            const now = new Date();
            if (expiryDate < now) {
                throw new Error('Policy has expired');
            }
            const amount = ethers_1.ethers.parseEther(claimData.amount.toString());
            const evidenceHashes = claimData.evidenceHashes || [];
            const estimatedGas = await this.contracts.claimsEngine.submitClaim.estimateGas(claimData.policyTokenId, amount, claimData.description, evidenceHashes);
            return {
                success: true,
                message: 'Claim submission data prepared',
                claimData: {
                    ...claimData,
                    amount: claimData.amount,
                    evidenceHashes,
                },
                transaction: {
                    to: app_config_1.AppConfig.contracts.claimsEngine,
                    data: this.contracts.claimsEngine.interface.encodeFunctionData('submitClaim', [
                        claimData.policyTokenId,
                        amount,
                        claimData.description,
                        evidenceHashes
                    ]),
                    estimatedGas: estimatedGas.toString(),
                    value: '0',
                },
                contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                note: 'Send this transaction data to MetaMask or wallet for execution'
            };
        }
        catch (error) {
            this.logger.error(`Failed to submit claim: ${error.message}`);
            throw error;
        }
    }
    async stakeTokens(amount, userAddress) {
        try {
            this.logger.log(`Staking ${amount} tokens for ${userAddress}`);
            const amountWei = ethers_1.ethers.parseEther(amount);
            const estimatedGas = await this.contracts.governanceToken.transfer.estimateGas(app_config_1.AppConfig.contracts.governance, amountWei);
            return {
                success: true,
                message: 'Token staking data prepared',
                amount,
                userAddress,
                transaction: {
                    to: app_config_1.AppConfig.contracts.governanceToken,
                    data: this.contracts.governanceToken.interface.encodeFunctionData('transfer', [
                        app_config_1.AppConfig.contracts.governance,
                        amountWei
                    ]),
                    estimatedGas: estimatedGas.toString(),
                    value: '0',
                },
                contractAddress: app_config_1.AppConfig.contracts.governanceToken,
                note: 'Send this transaction data to MetaMask or wallet for execution'
            };
        }
        catch (error) {
            this.logger.error(`Failed to stake tokens: ${error.message}`);
            throw error;
        }
    }
    async getPolicyDetails(tokenId) {
        try {
            const [owner, policyData] = await Promise.all([
                this.contracts.policyNFT.ownerOf(tokenId),
                this.contracts.policyNFT.getPolicyData(tokenId),
            ]);
            return {
                tokenId,
                owner,
                exists: true,
                contractAddress: app_config_1.AppConfig.contracts.policyNFT,
                explorerUrl: `${app_config_1.AppConfig.blockchain.explorerUrl}/token/${app_config_1.AppConfig.contracts.policyNFT}?a=${tokenId}`,
                details: {
                    policyType: this.getPolicyTypeName(policyData.policyType),
                    status: this.getPolicyStatusName(policyData.status),
                    policyholder: policyData.policyholder,
                    beneficiary: policyData.beneficiary,
                    coverageAmount: ethers_1.ethers.formatEther(policyData.coverageAmount),
                    premium: ethers_1.ethers.formatEther(policyData.premium),
                    creationDate: new Date(Number(policyData.creationDate) * 1000).toISOString(),
                    expiryDate: new Date(Number(policyData.expiryDate) * 1000).toISOString(),
                    claimedAmount: ethers_1.ethers.formatEther(policyData.claimedAmount),
                    coverageTerms: policyData.coverageTerms,
                    ipfsHash: policyData.ipfsHash,
                }
            };
        }
        catch (error) {
            this.logger.error(`Failed to get policy details for token ${tokenId}: ${error.message}`);
            return {
                tokenId,
                error: error.message,
                exists: false,
            };
        }
    }
    async getUserPolicies(userAddress) {
        try {
            this.logger.log(`Getting user policies for ${userAddress}`);
            let totalSupply = 0;
            try {
                totalSupply = await this.contracts.policyNFT.totalSupply();
            }
            catch (error) {
                this.logger.warn(`Failed to get total supply, returning empty result: ${error.message}`);
                return {
                    success: true,
                    policies: [],
                    totalPolicies: 0,
                    note: 'No policies found or contract not fully initialized'
                };
            }
            const policies = [];
            for (let i = 0; i < totalSupply; i++) {
                try {
                    const tokenId = i.toString();
                    const owner = await this.contracts.policyNFT.ownerOf(tokenId);
                    if (owner.toLowerCase() === userAddress.toLowerCase()) {
                        const policy = await this.getPolicyDetails(tokenId);
                        if (policy.exists) {
                            policies.push(policy);
                        }
                    }
                }
                catch (error) {
                    continue;
                }
            }
            return {
                success: true,
                policies,
                totalPolicies: policies.length
            };
        }
        catch (error) {
            this.logger.error(`Failed to get user policies for ${userAddress}: ${error.message}`);
            return {
                success: true,
                policies: [],
                totalPolicies: 0,
                note: 'Unable to fetch policies from blockchain'
            };
        }
    }
    async getClaimDetails(claimId) {
        try {
            const details = await this.contracts.claimsEngine.getClaim(claimId);
            const [policyId, claimant, requestedAmount, description, status, submissionTime, approvedAmount, fraudScore, claimType, evidenceHashes] = details;
            return {
                claimId,
                policyId: policyId.toString(),
                claimant,
                requestedAmount: ethers_1.ethers.formatEther(requestedAmount),
                approvedAmount: approvedAmount ? ethers_1.ethers.formatEther(approvedAmount) : null,
                description,
                status: this.getClaimStatus(status),
                submittedAt: new Date(Number(submissionTime) * 1000).toISOString(),
                fraudScore: Number(fraudScore),
                claimType: this.getClaimType(claimType),
                evidenceHashes: evidenceHashes || [],
                contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                explorerUrl: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.claimsEngine}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get claim details for ${claimId}: ${error.message}`);
            throw error;
        }
    }
    getClaimStatus(status) {
        switch (status) {
            case 0: return 'pending';
            case 1: return 'approved';
            case 2: return 'rejected';
            case 3: return 'under_review';
            default: return 'unknown';
        }
    }
    async getGovernanceProposals() {
        try {
            const proposalCount = await this.contracts.governance.getProposalCount();
            const proposals = [];
            for (let i = 0; i < Number(proposalCount); i++) {
                const details = await this.contracts.governance.getProposalDetails(i);
                const [title, description, startTime, endTime, votesFor, votesAgainst, executed] = details;
                proposals.push({
                    id: i.toString(),
                    title,
                    description,
                    status: executed ? 'executed' : Number(endTime) > Date.now() / 1000 ? 'active' : 'ended',
                    votesFor: ethers_1.ethers.formatEther(votesFor),
                    votesAgainst: ethers_1.ethers.formatEther(votesAgainst),
                    startTime: new Date(Number(startTime) * 1000).toISOString(),
                    endTime: new Date(Number(endTime) * 1000).toISOString(),
                    executed,
                });
            }
            return {
                proposals,
                contractAddress: app_config_1.AppConfig.contracts.governance,
                totalProposals: Number(proposalCount),
            };
        }
        catch (error) {
            this.logger.error(`Failed to get governance proposals: ${error.message}`);
            throw error;
        }
    }
    async createGovernanceProposal(proposalData) {
        try {
            this.logger.log(`Creating governance proposal: ${proposalData.title}`);
            const estimatedGas = await this.contracts.governance.createProposal.estimateGas(proposalData.title, proposalData.description, proposalData.votingPeriod);
            return {
                success: true,
                message: 'Governance proposal data prepared',
                proposalData,
                transaction: {
                    to: app_config_1.AppConfig.contracts.governance,
                    data: this.contracts.governance.interface.encodeFunctionData('createProposal', [
                        proposalData.title,
                        proposalData.description,
                        proposalData.votingPeriod
                    ]),
                    estimatedGas: estimatedGas.toString(),
                    value: '0',
                },
                contractAddress: app_config_1.AppConfig.contracts.governance,
                note: 'Send this transaction data to MetaMask or wallet for execution'
            };
        }
        catch (error) {
            this.logger.error(`Failed to create governance proposal: ${error.message}`);
            throw error;
        }
    }
    async voteOnProposal(voteData) {
        try {
            this.logger.log(`Voting on proposal ${voteData.proposalId} by ${voteData.voter}`);
            const estimatedGas = await this.contracts.governance.vote.estimateGas(voteData.proposalId, voteData.support, voteData.reason || '');
            return {
                success: true,
                message: 'Vote submission data prepared',
                voteData,
                transaction: {
                    to: app_config_1.AppConfig.contracts.governance,
                    data: this.contracts.governance.interface.encodeFunctionData('vote', [
                        voteData.proposalId,
                        voteData.support,
                        voteData.reason || ''
                    ]),
                    estimatedGas: estimatedGas.toString(),
                    value: '0',
                },
                contractAddress: app_config_1.AppConfig.contracts.governance,
                note: 'Send this transaction data to MetaMask or wallet for execution'
            };
        }
        catch (error) {
            this.logger.error(`Failed to vote on proposal: ${error.message}`);
            throw error;
        }
    }
    async getLiquidityInfo() {
        try {
            const [stablecoinSupply, governanceSupply] = await Promise.all([
                this.contracts.stablecoin.totalSupply(),
                this.contracts.governanceToken.totalSupply(),
            ]);
            return {
                stablecoin: {
                    totalSupply: ethers_1.ethers.formatEther(stablecoinSupply),
                    symbol: await this.contracts.stablecoin.symbol(),
                },
                governanceToken: {
                    totalSupply: ethers_1.ethers.formatEther(governanceSupply),
                    symbol: await this.contracts.governanceToken.symbol(),
                },
                network: app_config_1.AppConfig.blockchain.network,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Failed to get liquidity info: ${error.message}`);
            throw error;
        }
    }
    async healthCheck() {
        try {
            const [stablecoinName, governanceName, policyName] = await Promise.all([
                this.contracts.stablecoin.name().catch(() => 'Connection Failed'),
                this.contracts.governanceToken.name().catch(() => 'Connection Failed'),
                this.contracts.policyNFT.name().catch(() => 'Connection Failed'),
            ]);
            return {
                status: 'healthy',
                contracts: {
                    stablecoin: {
                        address: app_config_1.AppConfig.contracts.stablecoin,
                        name: stablecoinName,
                        connected: stablecoinName !== 'Connection Failed',
                    },
                    governanceToken: {
                        address: app_config_1.AppConfig.contracts.governanceToken,
                        name: governanceName,
                        connected: governanceName !== 'Connection Failed',
                    },
                    policyNFT: {
                        address: app_config_1.AppConfig.contracts.policyNFT,
                        name: policyName,
                        connected: policyName !== 'Connection Failed',
                    },
                },
                network: app_config_1.AppConfig.blockchain.network,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Health check failed: ${error.message}`);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getAllClaims() {
        try {
            const claimCount = await this.contracts.claimsEngine.getClaimCount();
            const claims = [];
            for (let i = 0; i < Number(claimCount); i++) {
                try {
                    const claim = await this.contracts.claimsEngine.getClaim(i);
                    claims.push({
                        id: i.toString(),
                        policyId: claim.policyId.toString(),
                        claimant: claim.claimant,
                        claimType: this.getClaimType(claim.claimType),
                        status: this.getClaimStatus(claim.status),
                        requestedAmount: ethers_1.ethers.formatEther(claim.requestedAmount),
                        approvedAmount: claim.approvedAmount ? ethers_1.ethers.formatEther(claim.approvedAmount) : null,
                        description: claim.description,
                        submittedAt: new Date(Number(claim.submissionTime) * 1000).toISOString(),
                        evidenceHashes: claim.evidenceHashes || [],
                        fraudScore: Number(claim.fraudScore),
                        contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                        explorerUrl: `${app_config_1.AppConfig.blockchain.explorerUrl}/address/${app_config_1.AppConfig.contracts.claimsEngine}`,
                    });
                }
                catch (error) {
                    continue;
                }
            }
            return claims;
        }
        catch (error) {
            this.logger.error(`Failed to get all claims: ${error.message}`);
            return [];
        }
    }
    async voteOnClaim(voteData) {
        try {
            this.logger.log(`Voting on claim ${voteData.claimId} by ${voteData.voter}`);
            const estimatedGas = await this.contracts.claimsEngine.castVote.estimateGas(voteData.claimId, voteData.approved, ethers_1.ethers.parseEther(voteData.suggestedAmount.toString()), voteData.justification || '');
            return {
                success: true,
                message: 'Vote submission data prepared',
                voteData,
                transaction: {
                    to: app_config_1.AppConfig.contracts.claimsEngine,
                    data: this.contracts.claimsEngine.interface.encodeFunctionData('castVote', [
                        voteData.claimId,
                        voteData.approved,
                        ethers_1.ethers.parseEther(voteData.suggestedAmount.toString()),
                        voteData.justification || ''
                    ]),
                    estimatedGas: estimatedGas.toString(),
                    value: '0',
                },
                contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                note: 'Send this transaction data to MetaMask or wallet for execution'
            };
        }
        catch (error) {
            this.logger.error(`Failed to vote on claim: ${error.message}`);
            throw error;
        }
    }
    async getJuryVotingDetails(claimId) {
        try {
            const voting = await this.contracts.claimsEngine.getJuryVoting(claimId);
            const [jurors, votesFor, votesAgainst, totalVotes, averageAmount, concluded] = voting;
            return {
                jurors,
                votesFor: ethers_1.ethers.formatEther(votesFor),
                votesAgainst: ethers_1.ethers.formatEther(votesAgainst),
                totalVotes: Number(totalVotes),
                averageAmount: ethers_1.ethers.formatEther(averageAmount),
                concluded,
                approvalPercentage: totalVotes > 0 ? (Number(votesFor) * 100) / Number(totalVotes) : 0,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get jury voting details: ${error.message}`);
            throw error;
        }
    }
    async executeClaimDecision(claimId, isApproved) {
        try {
            this.logger.log(`Executing claim decision for claim: ${claimId}, approved: ${isApproved}`);
            if (isApproved) {
                const estimatedGas = await this.contracts.claimsEngine.approveClaim.estimateGas(claimId, ethers_1.ethers.parseEther('0'));
                return {
                    success: true,
                    message: 'Claim approval data prepared',
                    claimId,
                    isApproved,
                    transaction: {
                        to: app_config_1.AppConfig.contracts.claimsEngine,
                        data: this.contracts.claimsEngine.interface.encodeFunctionData('approveClaim', [
                            claimId,
                            ethers_1.ethers.parseEther('0')
                        ]),
                        estimatedGas: estimatedGas.toString(),
                        value: '0',
                    },
                    contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                    note: 'Send this transaction data to MetaMask or wallet for execution'
                };
            }
            else {
                const estimatedGas = await this.contracts.claimsEngine.rejectClaim.estimateGas(claimId, 'Claim rejected by community vote');
                return {
                    success: true,
                    message: 'Claim rejection data prepared',
                    claimId,
                    isApproved,
                    transaction: {
                        to: app_config_1.AppConfig.contracts.claimsEngine,
                        data: this.contracts.claimsEngine.interface.encodeFunctionData('rejectClaim', [
                            claimId,
                            'Claim rejected by community vote'
                        ]),
                        estimatedGas: estimatedGas.toString(),
                        value: '0',
                    },
                    contractAddress: app_config_1.AppConfig.contracts.claimsEngine,
                    note: 'Send this transaction data to MetaMask or wallet for execution'
                };
            }
        }
        catch (error) {
            this.logger.error(`Failed to execute claim decision: ${error.message}`);
            throw error;
        }
    }
    getClaimType(type) {
        switch (type) {
            case 0: return 'health';
            case 1: return 'vehicle';
            case 2: return 'travel';
            case 3: return 'product_warranty';
            case 4: return 'pet';
            case 5: return 'agricultural';
            default: return 'unknown';
        }
    }
    getPolicyTypeName(type) {
        const types = ['Health', 'Vehicle', 'Travel', 'ProductWarranty', 'Pet', 'Agricultural'];
        return types[type] || 'Unknown';
    }
    getPolicyStatusName(status) {
        const statuses = ['Active', 'Expired', 'Cancelled', 'Claimed'];
        return statuses[status] || 'Unknown';
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = ContractService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], ContractService);
//# sourceMappingURL=contract.service.js.map