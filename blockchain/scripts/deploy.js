const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

// Configuration
const INITIAL_STABLECOIN_SUPPLY = ethers.parseEther("10000000"); // 10M tokens
const INITIAL_GOVERNANCE_SUPPLY = ethers.parseEther("1000000"); // 1M tokens
const INR_PEG_RATE = ethers.parseEther("0.012"); // 1 INR = 0.012 USD (example rate)

async function main() {
    console.log("🚀 Starting ChainSure deployment to BSC...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

    const deploymentInfo = {
        network: await ethers.provider.getNetwork(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {}
    };

    // 1. Deploy ChainSure Stablecoin
    console.log("\n📄 Deploying ChainSureStablecoin...");
    const ChainSureStablecoin = await ethers.getContractFactory("ChainSureStablecoin");
    const stablecoin = await ChainSureStablecoin.deploy(
        "0x0000000000000000000000000000000000000000", // Price oracle (placeholder)
        INR_PEG_RATE
    );
    await stablecoin.waitForDeployment();
    const stablecoinAddress = await stablecoin.getAddress();
    console.log("✅ ChainSureStablecoin deployed to:", stablecoinAddress);
    deploymentInfo.contracts.stablecoin = {
        address: stablecoinAddress,
        name: "ChainSureStablecoin",
        symbol: "csINR",
        args: ["0x0000000000000000000000000000000000000000", INR_PEG_RATE.toString()]
    };

    // 2. Deploy Governance Token
    console.log("\n📄 Deploying ChainSureGovernanceToken...");
    const ChainSureGovernanceToken = await ethers.getContractFactory("ChainSureGovernanceToken");
    const governanceToken = await ChainSureGovernanceToken.deploy(INITIAL_GOVERNANCE_SUPPLY);
    await governanceToken.waitForDeployment();
    const governanceTokenAddress = await governanceToken.getAddress();
    console.log("✅ ChainSureGovernanceToken deployed to:", governanceTokenAddress);
    deploymentInfo.contracts.governanceToken = {
        address: governanceTokenAddress,
        name: "ChainSureGovernanceToken",
        symbol: "CSURE",
        args: [INITIAL_GOVERNANCE_SUPPLY.toString()]
    };

    // 3. Deploy Policy NFT
    console.log("\n📄 Deploying ChainSurePolicyNFT...");
    const ChainSurePolicyNFT = await ethers.getContractFactory("ChainSurePolicyNFT");
    const policyNFT = await ChainSurePolicyNFT.deploy(
        stablecoinAddress,
        deployer.address // Treasury address (deployer for now)
    );
    await policyNFT.waitForDeployment();
    const policyNFTAddress = await policyNFT.getAddress();
    console.log("✅ ChainSurePolicyNFT deployed to:", policyNFTAddress);
    deploymentInfo.contracts.policyNFT = {
        address: policyNFTAddress,
        name: "ChainSurePolicyNFT",
        symbol: "CSPOLICY",
        args: [stablecoinAddress, deployer.address]
    };

    // 4. Deploy Claims Engine
    console.log("\n📄 Deploying ChainSureClaimsEngine...");
    const ChainSureClaimsEngine = await ethers.getContractFactory("ChainSureClaimsEngine");
    const claimsEngine = await ChainSureClaimsEngine.deploy(
        policyNFTAddress,
        governanceTokenAddress,
        stablecoinAddress,
        "0x0000000000000000000000000000000000000000" // AI service endpoint (placeholder)
    );
    await claimsEngine.waitForDeployment();
    const claimsEngineAddress = await claimsEngine.getAddress();
    console.log("✅ ChainSureClaimsEngine deployed to:", claimsEngineAddress);
    deploymentInfo.contracts.claimsEngine = {
        address: claimsEngineAddress,
        name: "ChainSureClaimsEngine",
        args: [policyNFTAddress, governanceTokenAddress, stablecoinAddress, "0x0000000000000000000000000000000000000000"]
    };

    // 5. Deploy Surplus Distributor
    console.log("\n📄 Deploying ChainSureSurplusDistributor...");
    const ChainSureSurplusDistributor = await ethers.getContractFactory("ChainSureSurplusDistributor");
    const surplusDistributor = await ChainSureSurplusDistributor.deploy(
        stablecoinAddress,
        governanceTokenAddress,
        policyNFTAddress,
        "0x0000000000000000000000000000000000000000" // Reinsurance provider (placeholder)
    );
    await surplusDistributor.waitForDeployment();
    const surplusDistributorAddress = await surplusDistributor.getAddress();
    console.log("✅ ChainSureSurplusDistributor deployed to:", surplusDistributorAddress);
    deploymentInfo.contracts.surplusDistributor = {
        address: surplusDistributorAddress,
        name: "ChainSureSurplusDistributor",
        args: [stablecoinAddress, governanceTokenAddress, policyNFTAddress, "0x0000000000000000000000000000000000000000"]
    };

    // 6. Deploy Governance
    console.log("\n📄 Deploying ChainSureGovernance...");
    const ChainSureGovernance = await ethers.getContractFactory("ChainSureGovernance");
    const governance = await ChainSureGovernance.deploy(
        governanceTokenAddress,
        policyNFTAddress,
        claimsEngineAddress,
        surplusDistributorAddress,
        deployer.address // Guardian (deployer for now)
    );
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("✅ ChainSureGovernance deployed to:", governanceAddress);
    deploymentInfo.contracts.governance = {
        address: governanceAddress,
        name: "ChainSureGovernance",
        args: [governanceTokenAddress, policyNFTAddress, claimsEngineAddress, surplusDistributorAddress, deployer.address]
    };

    // 7. Setup permissions and initial configuration
    console.log("\n⚙️ Setting up permissions and initial configuration...");

    try {
        // Add PolicyNFT as minter for stablecoin (for premium collection)
        console.log("🔑 Adding PolicyNFT as stablecoin minter...");
        await stablecoin.addMinter(policyNFTAddress, ethers.parseEther("1000000")); // 1M tokens daily limit

        // Add ClaimsEngine as minter for stablecoin (for claim payouts)
        console.log("🔑 Adding ClaimsEngine as stablecoin minter...");
        await stablecoin.addMinter(claimsEngineAddress, ethers.parseEther("500000")); // 500K tokens daily limit

        // Add deployer as authorized oracle for testing
        console.log("🔑 Adding deployer as authorized oracle...");
        await claimsEngine.addAuthorizedOracle(deployer.address);

        console.log("✅ Initial configuration completed!");

    } catch (error) {
        console.error("❌ Error during setup:", error.message);
    }

    // 8. Generate ABIs
    console.log("\n📋 Generating ABIs...");
    await generateABIs();

    // 9. Save deployment information
    console.log("\n💾 Saving deployment information...");
    await saveDeploymentInfo(deploymentInfo);

    // 10. Display summary
    console.log("\n🎉 Deployment Summary:");
    console.log("======================");
    console.log(`Network: ${deploymentInfo.network.name} (${deploymentInfo.network.chainId})`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`\n📄 Contract Addresses:`);
    console.log(`ChainSureStablecoin: ${stablecoinAddress}`);
    console.log(`ChainSureGovernanceToken: ${governanceTokenAddress}`);
    console.log(`ChainSurePolicyNFT: ${policyNFTAddress}`);
    console.log(`ChainSureClaimsEngine: ${claimsEngineAddress}`);
    console.log(`ChainSureSurplusDistributor: ${surplusDistributorAddress}`);
    console.log(`ChainSureGovernance: ${governanceAddress}`);

    console.log(`\n🔧 Configuration:`);
    console.log(`Initial Stablecoin Supply: ${ethers.formatEther(INITIAL_STABLECOIN_SUPPLY)} csINR`);
    console.log(`Initial Governance Supply: ${ethers.formatEther(INITIAL_GOVERNANCE_SUPPLY)} CSURE`);
    console.log(`INR Peg Rate: ${ethers.formatEther(INR_PEG_RATE)} USD per INR`);

    console.log(`\n📊 Next Steps:`);
    console.log(`1. Update AI service endpoint in ClaimsEngine`);
    console.log(`2. Configure price oracle for stablecoin`);
    console.log(`3. Set up reinsurance provider`);
    console.log(`4. Deploy to frontend and backend configurations`);
    console.log(`5. Verify contracts on BSCScan`);

    console.log(`\n🎯 Verification Commands:`);
    Object.entries(deploymentInfo.contracts).forEach(([name, info]) => {
        console.log(`npx hardhat verify --network bsc_testnet ${info.address} ${info.args.join(' ')}`);
    });

    return deploymentInfo;
}

async function generateABIs() {
    console.log("📋 Extracting ABIs from compiled contracts...");
    
    const abiDir = path.join(__dirname, '..', 'abis');
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }

    const contractNames = [
        'ChainSureStablecoin',
        'ChainSureGovernanceToken',
        'ChainSurePolicyNFT',
        'ChainSureClaimsEngine',
        'ChainSureSurplusDistributor',
        'ChainSureGovernance'
    ];

    const abis = {};

    for (const contractName of contractNames) {
        try {
            const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
            if (fs.existsSync(artifactPath)) {
                const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
                const abi = artifact.abi;
                
                // Save individual ABI file
                const abiPath = path.join(abiDir, `${contractName}.json`);
                fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
                
                // Add to combined ABIs
                abis[contractName] = abi;
                
                console.log(`✅ Generated ABI for ${contractName}`);
            } else {
                console.log(`⚠️ Artifact not found for ${contractName}`);
            }
        } catch (error) {
            console.error(`❌ Error generating ABI for ${contractName}:`, error.message);
        }
    }

    // Save combined ABIs file
    const combinedAbiPath = path.join(abiDir, 'ChainSureABIs.json');
    fs.writeFileSync(combinedAbiPath, JSON.stringify(abis, null, 2));
    console.log(`✅ Generated combined ABIs file: ${combinedAbiPath}`);

    // Generate TypeScript definitions
    await generateTypeScriptDefinitions(abis, abiDir);
}

async function generateTypeScriptDefinitions(abis, abiDir) {
    console.log("📝 Generating TypeScript definitions...");
    
    let tsDefinitions = `// ChainSure Contract Type Definitions
// Generated automatically - do not edit manually

export interface ContractAddresses {
  stablecoin: string;
  governanceToken: string;
  policyNFT: string;
  claimsEngine: string;
  surplusDistributor: string;
  governance: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: ContractAddresses;
}

// ABI exports
`;

    Object.keys(abis).forEach(contractName => {
        tsDefinitions += `export const ${contractName}ABI = ${JSON.stringify(abis[contractName], null, 2)} as const;\n\n`;
    });

    const tsPath = path.join(abiDir, 'index.ts');
    fs.writeFileSync(tsPath, tsDefinitions);
    console.log(`✅ Generated TypeScript definitions: ${tsPath}`);
}

async function saveDeploymentInfo(deploymentInfo) {
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Convert BigInt values to strings for JSON serialization
    const serializedInfo = {
        ...deploymentInfo,
        network: {
            ...deploymentInfo.network,
            chainId: deploymentInfo.network.chainId.toString()
        }
    };

    // Save network-specific deployment
    const networkName = deploymentInfo.network.name || "unknown";
    const chainId = deploymentInfo.network.chainId;
    const deploymentPath = path.join(deploymentsDir, `${networkName}.json`);
    fs.writeFileSync(deploymentPath, JSON.stringify(serializedInfo, null, 2));
    console.log(`✅ Saved deployment info: ${deploymentPath}`);

    // Create frontend configuration
    const frontendConfig = {
        chainId: Number(chainId), // Convert BigInt to number for frontend
        network: networkName,
        contracts: {
            stablecoin: deploymentInfo.contracts.stablecoin.address,
            governanceToken: deploymentInfo.contracts.governanceToken.address,
            policyNFT: deploymentInfo.contracts.policyNFT.address,
            claimsEngine: deploymentInfo.contracts.claimsEngine.address,
            surplusDistributor: deploymentInfo.contracts.surplusDistributor.address,
            governance: deploymentInfo.contracts.governance.address
        },
        rpcUrl: chainId === 97n 
            ? "https://data-seed-prebsc-1-s1.binance.org:8545/"
            : "https://bsc-dataseed1.binance.org/",
        blockExplorer: chainId === 97n
            ? "https://testnet.bscscan.com"
            : "https://bscscan.com"
    };

    const frontendConfigPath = path.join(__dirname, '..', '..', 'frontend', 'config', 'contracts.json');
    const frontendConfigDir = path.dirname(frontendConfigPath);
    if (!fs.existsSync(frontendConfigDir)) {
        fs.mkdirSync(frontendConfigDir, { recursive: true });
    }
    fs.writeFileSync(frontendConfigPath, JSON.stringify(frontendConfig, null, 2));
    console.log(`✅ Generated frontend config: ${frontendConfigPath}`);

    // Create backend configuration
    const backendConfig = {
        blockchain: {
            network: networkName,
            chainId: Number(chainId), // Convert BigInt to number for backend
            rpcUrl: frontendConfig.rpcUrl,
            contracts: frontendConfig.contracts
        },
        ai: {
            endpoint: "http://localhost:8001", // AI service endpoint
            apiKey: "chainsure_backend_key_2024"
        }
    };

    const backendConfigPath = path.join(__dirname, '..', '..', 'backend', 'config', 'blockchain.json');
    const backendConfigDir = path.dirname(backendConfigPath);
    if (!fs.existsSync(backendConfigDir)) {
        fs.mkdirSync(backendConfigDir, { recursive: true });
    }
    fs.writeFileSync(backendConfigPath, JSON.stringify(backendConfig, null, 2));
    console.log(`✅ Generated backend config: ${backendConfigPath}`);
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }); 