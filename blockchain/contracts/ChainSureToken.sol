// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainSureToken
 * @dev Utility token for the ChainSure platform
 * Used for governance, rewards, and fee payments
 */
contract ChainSureToken is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    mapping(address => bool) public minters;
    mapping(address => uint256) public stakingRewards;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event RewardDistributed(address indexed recipient, uint256 amount);

    modifier onlyMinter() {
        require(minters[msg.sender], "Only minters can mint");
        _;
    }

    constructor() ERC20("ChainSure Token", "CST") {
        // Initial mint to deployer (10% of max supply)
        _mint(msg.sender, MAX_SUPPLY / 10);
        minters[msg.sender] = true;
    }

    /**
     * @dev Mint tokens to an address
     */
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Add a minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Remove a minter
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Distribute rewards to users
     */
    function distributeReward(address recipient, uint256 amount) external onlyMinter {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        
        stakingRewards[recipient] += amount;
        _mint(recipient, amount);
        
        emit RewardDistributed(recipient, amount);
    }

    /**
     * @dev Batch distribute rewards
     */
    function batchDistributeRewards(
        address[] memory recipients,
        uint256[] memory amounts
    ) external onlyMinter {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            distributeReward(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Override transfer to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
} 