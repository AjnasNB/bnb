// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ChainSureInsurance
 * @dev Main insurance contract that handles policy NFTs and claims processing
 */
contract ChainSureInsurance is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _claimIdCounter;

    enum PolicyType { HEALTH, VEHICLE, TRAVEL, PRODUCT_WARRANTY, PET, AGRICULTURAL }
    enum ClaimStatus { SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID }

    struct Policy {
        address owner;
        PolicyType policyType;
        uint256 coverageAmount;
        uint256 premiumAmount;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        string termsHash; // IPFS hash of terms and conditions
        uint256 claimsCount;
        uint256 totalClaimedAmount;
    }

    struct Claim {
        uint256 policyTokenId;
        address claimant;
        uint256 requestedAmount;
        uint256 approvedAmount;
        ClaimStatus status;
        bytes32 aiScoreHash;
        string evidenceHash; // IPFS hash of evidence documents
        uint256 submissionTime;
        uint256 reviewTime;
        string reviewNotes;
    }

    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256[]) public userClaims;
    
    // AI oracle address for automated claim processing
    address public aiOracle;
    
    // Treasury and fee management
    address public treasury;
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public constant MAX_FEE_PERCENTAGE = 1000; // 10%
    
    // Events
    event PolicyMinted(
        address indexed owner, 
        uint256 indexed tokenId, 
        PolicyType policyType,
        uint256 coverageAmount,
        uint256 premiumAmount
    );
    
    event ClaimSubmitted(
        uint256 indexed claimId,
        uint256 indexed policyTokenId,
        address indexed claimant,
        uint256 requestedAmount
    );
    
    event ClaimStatusUpdated(
        uint256 indexed claimId,
        ClaimStatus status,
        uint256 approvedAmount
    );
    
    event ClaimPaid(
        uint256 indexed claimId,
        address indexed recipient,
        uint256 amount
    );
    
    event PremiumPaid(
        uint256 indexed tokenId,
        address indexed payer,
        uint256 amount
    );

    constructor(
        address _treasury,
        address _aiOracle
    ) ERC721("ChainSure Insurance", "CSI") {
        treasury = _treasury;
        aiOracle = _aiOracle;
    }

    modifier onlyPolicyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not policy owner");
        _;
    }

    modifier onlyAIOracle() {
        require(msg.sender == aiOracle, "Only AI oracle can call");
        _;
    }

    modifier validPolicy(uint256 tokenId) {
        require(_exists(tokenId), "Policy does not exist");
        require(policies[tokenId].isActive, "Policy is not active");
        require(block.timestamp <= policies[tokenId].endDate, "Policy has expired");
        _;
    }

    /**
     * @dev Mint a new insurance policy NFT
     */
    function mintPolicy(
        address to,
        PolicyType policyType,
        uint256 coverageAmount,
        uint256 premiumAmount,
        uint256 duration, // in seconds
        string memory termsHash
    ) external payable whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid address");
        require(coverageAmount > 0, "Coverage amount must be positive");
        require(premiumAmount > 0, "Premium amount must be positive");
        require(msg.value >= premiumAmount, "Insufficient premium payment");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        policies[tokenId] = Policy({
            owner: to,
            policyType: policyType,
            coverageAmount: coverageAmount,
            premiumAmount: premiumAmount,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            termsHash: termsHash,
            claimsCount: 0,
            totalClaimedAmount: 0
        });

        userPolicies[to].push(tokenId);

        _safeMint(to, tokenId);

        // Handle premium payment
        uint256 platformFee = (premiumAmount * platformFeePercentage) / 10000;
        uint256 treasuryAmount = premiumAmount - platformFee;
        
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        
        payable(treasury).transfer(treasuryAmount);

        // Refund excess payment
        if (msg.value > premiumAmount) {
            payable(msg.sender).transfer(msg.value - premiumAmount);
        }

        emit PolicyMinted(to, tokenId, policyType, coverageAmount, premiumAmount);
        emit PremiumPaid(tokenId, msg.sender, premiumAmount);

        return tokenId;
    }

    /**
     * @dev Submit a new insurance claim
     */
    function submitClaim(
        uint256 policyTokenId,
        uint256 requestedAmount,
        string memory evidenceHash
    ) external onlyPolicyOwner(policyTokenId) validPolicy(policyTokenId) whenNotPaused returns (uint256) {
        require(requestedAmount > 0, "Requested amount must be positive");
        require(requestedAmount <= policies[policyTokenId].coverageAmount, "Amount exceeds coverage");
        
        Policy storage policy = policies[policyTokenId];
        require(
            policy.totalClaimedAmount + requestedAmount <= policy.coverageAmount,
            "Insufficient remaining coverage"
        );

        uint256 claimId = _claimIdCounter.current();
        _claimIdCounter.increment();

        claims[claimId] = Claim({
            policyTokenId: policyTokenId,
            claimant: msg.sender,
            requestedAmount: requestedAmount,
            approvedAmount: 0,
            status: ClaimStatus.SUBMITTED,
            aiScoreHash: bytes32(0),
            evidenceHash: evidenceHash,
            submissionTime: block.timestamp,
            reviewTime: 0,
            reviewNotes: ""
        });

        userClaims[msg.sender].push(claimId);
        policy.claimsCount++;

        emit ClaimSubmitted(claimId, policyTokenId, msg.sender, requestedAmount);

        return claimId;
    }

    /**
     * @dev AI oracle updates claim with analysis results
     */
    function updateClaimAIAnalysis(
        uint256 claimId,
        bytes32 aiScoreHash,
        uint256 recommendedAmount,
        bool shouldApprove
    ) external onlyAIOracle {
        require(claimId < _claimIdCounter.current(), "Invalid claim ID");
        
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.SUBMITTED, "Claim not in submitted state");

        claim.aiScoreHash = aiScoreHash;
        claim.reviewTime = block.timestamp;

        if (shouldApprove && recommendedAmount > 0) {
            claim.approvedAmount = recommendedAmount;
            claim.status = ClaimStatus.APPROVED;
            
            emit ClaimStatusUpdated(claimId, ClaimStatus.APPROVED, recommendedAmount);
        } else {
            claim.status = ClaimStatus.UNDER_REVIEW;
            emit ClaimStatusUpdated(claimId, ClaimStatus.UNDER_REVIEW, 0);
        }
    }

    /**
     * @dev Manual claim review by admin
     */
    function reviewClaim(
        uint256 claimId,
        bool approve,
        uint256 approvedAmount,
        string memory reviewNotes
    ) external onlyOwner {
        require(claimId < _claimIdCounter.current(), "Invalid claim ID");
        
        Claim storage claim = claims[claimId];
        require(
            claim.status == ClaimStatus.SUBMITTED || claim.status == ClaimStatus.UNDER_REVIEW,
            "Claim cannot be reviewed"
        );

        claim.reviewTime = block.timestamp;
        claim.reviewNotes = reviewNotes;

        if (approve && approvedAmount > 0) {
            require(approvedAmount <= claim.requestedAmount, "Approved amount exceeds requested");
            claim.approvedAmount = approvedAmount;
            claim.status = ClaimStatus.APPROVED;
        } else {
            claim.status = ClaimStatus.REJECTED;
        }

        emit ClaimStatusUpdated(claimId, claim.status, claim.approvedAmount);
    }

    /**
     * @dev Process approved claim payment
     */
    function processClaim(uint256 claimId) external nonReentrant whenNotPaused {
        require(claimId < _claimIdCounter.current(), "Invalid claim ID");
        
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.APPROVED, "Claim not approved");
        require(claim.approvedAmount > 0, "No approved amount");

        Policy storage policy = policies[claim.policyTokenId];
        require(address(this).balance >= claim.approvedAmount, "Insufficient contract balance");

        // Update policy and claim
        policy.totalClaimedAmount += claim.approvedAmount;
        claim.status = ClaimStatus.PAID;

        // Transfer payment to claimant
        payable(claim.claimant).transfer(claim.approvedAmount);

        emit ClaimPaid(claimId, claim.claimant, claim.approvedAmount);
    }

    /**
     * @dev Get policy details
     */
    function getPolicyDetails(uint256 tokenId) external view returns (Policy memory) {
        require(_exists(tokenId), "Policy does not exist");
        return policies[tokenId];
    }

    /**
     * @dev Get claim details
     */
    function getClaimDetails(uint256 claimId) external view returns (Claim memory) {
        require(claimId < _claimIdCounter.current(), "Invalid claim ID");
        return claims[claimId];
    }

    /**
     * @dev Get user's policies
     */
    function getUserPolicies(address user) external view returns (uint256[] memory) {
        return userPolicies[user];
    }

    /**
     * @dev Get user's claims
     */
    function getUserClaims(address user) external view returns (uint256[] memory) {
        return userClaims[user];
    }

    /**
     * @dev Set AI oracle address
     */
    function setAIOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        aiOracle = newOracle;
    }

    /**
     * @dev Set treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
    }

    /**
     * @dev Set platform fee percentage
     */
    function setPlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= MAX_FEE_PERCENTAGE, "Fee too high");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Withdraw contract balance (emergency only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Fund contract for claim payments
     */
    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Must send some ETH");
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
} 