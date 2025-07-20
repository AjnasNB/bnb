'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface UserData {
  id: string;
  walletAddress: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
}

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  userData: UserData | null;
  isNewUser: boolean;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  saveUserData: (data: Partial<UserData>) => Promise<void>;
  mintPolicyNFT: (policyData: any) => Promise<string>;
  mintClaimNFT: (claimData: any) => Promise<string>;
  switchToTestnet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// BSC Testnet Configuration
const BSC_TESTNET = {
  chainId: '0x61', // 97 in decimal
  chainName: 'BSC Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

// Contract addresses (deployed on BSC Testnet)
const CONTRACT_ADDRESSES = {
  policyNFT: '0x742d35Cc6634C0532925a3b8D322C58E7D7c1c8e', // Example address
  claimNFT: '0x8ba1f109551bD432803012645Hac136c2ABCD123',  // Example address
  governanceToken: '0x9Ac64Cc67E11c05C2b7D8d5b1f2d3E4F5a6B7890', // Example address
};

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);
  };

  // Initialize provider on component mount
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      checkConnection();

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!provider) return;

      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setAccount(address);
        setSigner(signer);
        setChainId(Number(network.chainId));
        setIsConnected(true);

        // Load user data
        await loadUserData(address);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      loadUserData(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload(); // Reload to reset state
  };

  const connectWallet = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        alert('Please install MetaMask to use this application');
        window.open('https://metamask.io/', '_blank');
        return;
      }

      if (!provider) {
        throw new Error('Provider not initialized');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(address);
      setSigner(signer);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Switch to BSC Testnet if not already on it
      if (Number(network.chainId) !== 97) {
        await switchToTestnet();
      }

      // Load or create user data
      await loadUserData(address);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    setUserData(null);
    setIsNewUser(false);
    setChainId(null);
  };

  const switchToTestnet = async () => {
    try {
      // Try to switch to BSC Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding BSC Testnet:', addError);
          alert('Failed to add BSC Testnet to MetaMask');
        }
      } else {
        console.error('Error switching to BSC Testnet:', switchError);
      }
    }
  };

  const loadUserData = async (walletAddress: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/wallet/${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setUserData(data.users[0]);
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsNewUser(true);
    }
  };

  const saveUserData = async (data: Partial<UserData>) => {
    try {
      if (!account) throw new Error('No wallet connected');

      const userData = {
        walletAddress: account,
        ...data,
      };

      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const savedUser = await response.json();
        setUserData(savedUser);
        setIsNewUser(false);
      } else {
        throw new Error('Failed to save user data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const mintPolicyNFT = async (policyData: any): Promise<string> => {
    try {
      if (!signer) throw new Error('No signer available');

      // This would be the actual NFT contract interaction
      // For now, simulate minting and return a transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Store NFT info in backend
      await fetch('http://localhost:3000/api/v1/blockchain/mint-policy-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...policyData,
          ownerAddress: account,
          transactionHash: txHash,
          contractAddress: CONTRACT_ADDRESSES.policyNFT,
        }),
      });

      return txHash;
    } catch (error) {
      console.error('Error minting policy NFT:', error);
      throw error;
    }
  };

  const mintClaimNFT = async (claimData: any): Promise<string> => {
    try {
      if (!signer) throw new Error('No signer available');

      // This would be the actual NFT contract interaction
      // For now, simulate minting and return a transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Store NFT info in backend
      await fetch('http://localhost:3000/api/v1/blockchain/mint-claim-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...claimData,
          ownerAddress: account,
          transactionHash: txHash,
          contractAddress: CONTRACT_ADDRESSES.claimNFT,
        }),
      });

      return txHash;
    } catch (error) {
      console.error('Error minting claim NFT:', error);
      throw error;
    }
  };

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    isConnected,
    userData,
    isNewUser,
    chainId,
    connectWallet,
    disconnectWallet,
    saveUserData,
    mintPolicyNFT,
    mintClaimNFT,
    switchToTestnet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 