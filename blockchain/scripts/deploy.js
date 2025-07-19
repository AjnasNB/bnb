const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Starting ChainSureAI smart contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "BNB");

  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "- Chain ID:", network.chainId);

  // Deploy ChainSureToken first
  console.log("\n📄 Deploying ChainSureToken...");
  const ChainSureToken = await ethers.getContractFactory("ChainSureToken");
  const chainSureToken = await ChainSureToken.deploy();
  await chainSureToken.deployed();
  console.log("✅ ChainSureToken deployed at:", chainSureToken.address);

  // Deploy ChainSureOracle
  console.log("\n📄 Deploying ChainSureOracle...");
  const ChainSureOracle = await ethers.getContractFactory("ChainSureOracle");
  const chainSureOracle = await ChainSureOracle.deploy();
  await chainSureOracle.deployed();
  console.log("✅ ChainSureOracle deployed at:", chainSureOracle.address);

  // Deploy ChainSureInsurance
  console.log("\n📄 Deploying ChainSureInsurance...");
  const ChainSureInsurance = await ethers.getContractFactory("ChainSureInsurance");
  
  // Treasury will be the deployer for now (change this in production)
  const treasury = deployer.address;
  const aiOracle = chainSureOracle.address;
  
  const chainSureInsurance = await ChainSureInsurance.deploy(treasury, aiOracle);
  await chainSureInsurance.deployed();
  console.log("✅ ChainSureInsurance deployed at:", chainSureInsurance.address);

  // Set up initial configuration
  console.log("\n⚙️  Setting up initial configuration...");
  
  // Add insurance contract as minter for token rewards
  await chainSureToken.addMinter(chainSureInsurance.address);
  console.log("✅ Added insurance contract as token minter");

  // Authorize insurance contract to use oracle
  await chainSureOracle.authorizeReporter(chainSureInsurance.address);
  console.log("✅ Authorized insurance contract to use oracle");

  // Fund the insurance contract with some BNB for claims
  const fundAmount = ethers.utils.parseEther("1.0"); // 1 BNB
  await chainSureInsurance.fundContract({ value: fundAmount });
  console.log("✅ Funded insurance contract with", ethers.utils.formatEther(fundAmount), "BNB");

  // Create initial policy types configuration
  console.log("\n📋 Contract summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🏥 ChainSureToken:     ", chainSureToken.address);
  console.log("🔮 ChainSureOracle:    ", chainSureOracle.address);
  console.log("🛡️  ChainSureInsurance: ", chainSureInsurance.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💼 Treasury:           ", treasury);
  console.log("🤖 AI Oracle:          ", aiOracle);
  console.log("💰 Platform Fee:       ", "2.5%");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Save deployment addresses to a file
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ChainSureToken: chainSureToken.address,
      ChainSureOracle: chainSureOracle.address,
      ChainSureInsurance: chainSureInsurance.address
    },
    configuration: {
      treasury: treasury,
      aiOracle: aiOracle,
      platformFee: "2.5%",
      initialFunding: ethers.utils.formatEther(fundAmount) + " BNB"
    }
  };

  const fs = require('fs');
  const deploymentFile = `deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Verification instructions
  if (network.chainId === 97 || network.chainId === 56) {
    console.log("\n🔍 To verify contracts on BSCScan, run:");
    console.log(`npx hardhat verify --network ${network.name} ${chainSureToken.address}`);
    console.log(`npx hardhat verify --network ${network.name} ${chainSureOracle.address}`);
    console.log(`npx hardhat verify --network ${network.name} ${chainSureInsurance.address} "${treasury}" "${aiOracle}"`);
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 