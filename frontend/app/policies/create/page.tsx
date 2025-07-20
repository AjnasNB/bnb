'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '../../context/Web3Context';

interface PolicyType {
  id: string;
  name: string;
  description: string;
  minCoverage: number;
  maxCoverage: number;
  basePremium: number;
  duration: number;
  features: string[];
}

interface PolicyForm {
  type: string;
  coverageAmount: number;
  premiumAmount: number;
  duration: number;
  description: string;
  terms: string;
  holder: string;
}

export default function CreatePolicyPage() {
  const { account, isConnected, connectWallet, chainId } = useWeb3();
  const router = useRouter();
  
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>([]);
  const [form, setForm] = useState<PolicyForm>({
    type: '',
    coverageAmount: 0,
    premiumAmount: 0,
    duration: 365,
    description: '',
    terms: '',
    holder: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [userPolicies, setUserPolicies] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState('0');
  const [premiumRate, setPremiumRate] = useState(0.03); // 3% default rate

  useEffect(() => {
    if (isConnected && account) {
      loadPolicyTypes();
      loadUserData();
      setForm(prev => ({ ...prev, holder: account }));
    }
  }, [isConnected, account]);

  const loadPolicyTypes = async () => {
    try {
      const response = await fetch('/api/v1/policies/types');
      const data = await response.json();
      setPolicyTypes(data.types || []);
    } catch (error) {
      console.error('Error loading policy types:', error);
      // Fallback to mock data if API fails
      setPolicyTypes([
        { 
          id: 'health', 
          name: 'Health Insurance', 
          basePremium: 150, 
          description: 'Comprehensive health coverage for medical expenses',
          minCoverage: 1000,
          maxCoverage: 100000,
          premiumRate: 0.03,
          duration: 365
        },
        { 
          id: 'vehicle', 
          name: 'Vehicle Insurance', 
          basePremium: 200, 
          description: 'Auto insurance coverage for accidents and damage',
          minCoverage: 5000,
          maxCoverage: 500000,
          premiumRate: 0.025,
          duration: 365
        },
        { 
          id: 'travel', 
          name: 'Travel Insurance', 
          basePremium: 50, 
          description: 'Travel protection for trips and vacations',
          minCoverage: 500,
          maxCoverage: 50000,
          premiumRate: 0.04,
          duration: 365
        },
        { 
          id: 'pet', 
          name: 'Pet Insurance', 
          basePremium: 75, 
          description: 'Pet health coverage for veterinary expenses',
          minCoverage: 1000,
          maxCoverage: 25000,
          premiumRate: 0.035,
          duration: 365
        },
        { 
          id: 'home', 
          name: 'Home Insurance', 
          basePremium: 300, 
          description: 'Home and property protection',
          minCoverage: 10000,
          maxCoverage: 1000000,
          premiumRate: 0.02,
          duration: 365
        },
        { 
          id: 'life', 
          name: 'Life Insurance', 
          basePremium: 100, 
          description: 'Life insurance coverage',
          minCoverage: 10000,
          maxCoverage: 1000000,
          premiumRate: 0.015,
          duration: 365
        },
      ]);
    }
  };

  const loadUserData = async () => {
    if (!account) return;
    
    try {
      // Load user's existing policies
      const policiesResponse = await fetch(`/api/v1/blockchain/policies/${account}`);
      if (policiesResponse.ok) {
        const policiesData = await policiesResponse.json();
        setUserPolicies(policiesData.policies || []);
      }
    } catch (error) {
      console.error('Failed to load user policies:', error);
      // Use fallback data
      setUserPolicies([
        {
          tokenId: '1',
          policyType: 'Health',
          coverageAmount: '5000',
          premiumAmount: '150',
          startDate: '2024-01-15T00:00:00.000Z',
          endDate: '2025-01-15T00:00:00.000Z',
          isActive: true
        }
      ]);
    }
  };

  const handleTypeChange = (typeId: string) => {
    const selectedType = policyTypes.find(t => t.id === typeId);
    if (selectedType) {
      setForm(prev => ({
        ...prev,
        type: typeId,
        coverageAmount: selectedType.minCoverage,
        premiumAmount: selectedType.minCoverage * premiumRate,
        duration: selectedType.duration
      }));
    }
  };

  const handleCoverageChange = (amount: number) => {
    const premium = amount * premiumRate;
    setForm(prev => ({
      ...prev,
      coverageAmount: amount,
      premiumAmount: premium
    }));
  };

  const handlePremiumRateChange = (rate: number) => {
    setPremiumRate(rate);
    const premium = form.coverageAmount * rate;
    setForm(prev => ({
      ...prev,
      premiumAmount: premium
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!form.type || form.coverageAmount <= 0 || form.premiumAmount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      
      const policyData = {
        holder: form.holder,
        coverageAmount: form.coverageAmount,
        premiumAmount: form.premiumAmount,
        duration: form.duration,
        description: form.description,
        terms: form.terms,
        metadataHash: 'QmDefaultPolicyMetadata', // In real app, upload to IPFS
      };

      const response = await fetch('/api/v1/blockchain/policy/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });

      const result = await response.json();

      if (result.success) {
        const premiumInStablecoin = result.policyData.premiumInStablecoin;
        const needsApproval = result.policyData.needsApproval;
        
        if (needsApproval && result.transactions.approval) {
          // Send approval transaction to MetaMask
          try {
            const approvalTx = result.transactions.approval;
            const approvalResult = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                to: approvalTx.to,
                data: approvalTx.data,
                from: account,
                gas: approvalTx.estimatedGas,
                value: approvalTx.value
              }]
            });
            
            alert(`Approval transaction sent! Hash: ${approvalResult}\n\nNow you can create the policy. Click OK to continue.`);
            
            // Wait a moment then send the policy creation transaction
            setTimeout(async () => {
              try {
                const createTx = result.transactions.createPolicy;
                const createResult = await window.ethereum.request({
                  method: 'eth_sendTransaction',
                  params: [{
                    to: createTx.to,
                    data: createTx.data,
                    from: account,
                    gas: createTx.estimatedGas,
                    value: createTx.value
                  }]
                });
                
                alert(`Policy creation transaction sent! Hash: ${createResult}\n\nYour NFT policy is being created on the blockchain!`);
                
                // Reload user data to show new policy
                await loadUserData();
                setForm({
                  type: '',
                  coverageAmount: 0,
                  premiumAmount: 0,
                  duration: 365,
                  description: '',
                  terms: '',
                  holder: account || ''
                });
              } catch (error) {
                alert('Failed to create policy: ' + error.message);
              }
            }, 2000);
            
          } catch (error) {
            alert('Failed to approve contract: ' + error.message);
          }
        } else {
          // Only policy creation needed
          try {
            const createTx = result.transactions.createPolicy;
            const createResult = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                to: createTx.to,
                data: createTx.data,
                from: account,
                gas: createTx.estimatedGas,
                value: createTx.value
              }]
            });
            
            alert(`Policy creation transaction sent! Hash: ${createResult}\n\nYour NFT policy is being created on the blockchain!`);
            
            // Reload user data to show new policy
            await loadUserData();
            setForm({
              type: '',
              coverageAmount: 0,
              premiumAmount: 0,
              duration: 365,
              description: '',
              terms: '',
              holder: account || ''
            });
          } catch (error) {
            alert('Failed to create policy: ' + error.message);
          }
        }
      } else {
        alert('Failed to create policy: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      alert('Error creating policy. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Insurance Policy</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to create a new insurance policy</p>
            <button
              onClick={connectWallet}
              className="metamask-btn"
            >
              Connect MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Insurance Policy</h1>
          <p className="text-gray-600">Create a new NFT-based insurance policy on the blockchain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Policy Creation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Policy Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Policy Type Selection */}
                <div className="form-group">
                  <label className="form-label">Policy Type *</label>
                  <select
                    className="form-input"
                    value={form.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    required
                  >
                    <option value="">Select a policy type</option>
                    {policyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ${type.minCoverage.toLocaleString()} to ${type.maxCoverage.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coverage Amount */}
                <div className="form-group">
                  <label className="form-label">Coverage Amount (USD) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.coverageAmount}
                    onChange={(e) => handleCoverageChange(Number(e.target.value))}
                    min={policyTypes.find(t => t.id === form.type)?.minCoverage || 0}
                    max={policyTypes.find(t => t.id === form.type)?.maxCoverage || 1000000}
                    step={100}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Min: ${policyTypes.find(t => t.id === form.type)?.minCoverage.toLocaleString() || 0} | 
                    Max: ${policyTypes.find(t => t.id === form.type)?.maxCoverage.toLocaleString() || 1000000}
                  </p>
                </div>

                {/* Premium Rate */}
                <div className="form-group">
                  <label className="form-label">Premium Rate (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={premiumRate * 100}
                    onChange={(e) => handlePremiumRateChange(Number(e.target.value) / 100)}
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This determines your premium amount based on coverage
                  </p>
                </div>

                {/* Premium Amount (Calculated) */}
                <div className="form-group">
                  <label className="form-label">Premium Amount (USD)</label>
                  <input
                    type="number"
                    className="form-input bg-gray-50"
                    value={form.premiumAmount.toFixed(2)}
                    readOnly
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Calculated: ${form.coverageAmount.toLocaleString()} × {(premiumRate * 100).toFixed(1)}% = ${form.premiumAmount.toFixed(2)}
                  </p>
                </div>

                {/* Stablecoin Premium Amount */}
                <div className="form-group">
                  <label className="form-label">Premium Amount (Stablecoin)</label>
                  <input
                    type="text"
                    className="form-input bg-gray-50"
                    value={form.premiumAmount.toFixed(2)}
                    readOnly
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Premium paid in ChainSure stablecoin tokens (csINR)
                  </p>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label className="form-label">Policy Duration</label>
                  <select
                    className="form-input"
                    value={form.duration}
                    onChange={(e) => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  >
                    <option value={365}>1 Year</option>
                    <option value={730}>2 Years</option>
                    <option value={1095}>3 Years</option>
                    <option value={1460}>4 Years</option>
                    <option value={1825}>5 Years</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Policy Description</label>
                  <textarea
                    className="form-textarea"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this policy covers..."
                    rows={3}
                  />
                </div>

                {/* Terms */}
                <div className="form-group">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    className="form-textarea"
                    value={form.terms}
                    onChange={(e) => setForm(prev => ({ ...prev, terms: e.target.value }))}
                    placeholder="Enter policy terms and conditions..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={creating || !form.type || form.coverageAmount <= 0}
                >
                  {creating ? (
                    <>
                      <div className="spinner"></div>
                      Creating Policy...
                    </>
                  ) : (
                    'Create Policy NFT'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* User's Existing Policies */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Policies</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-lg font-semibold text-green-600">
                  ${parseFloat(userBalance).toFixed(2)} USDC
                </p>
              </div>

              {userPolicies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No policies found</p>
              ) : (
                <div className="space-y-4">
                  {userPolicies.map((policy) => (
                    <div key={policy.tokenId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">Policy #{policy.tokenId}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.details.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {policy.details.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Coverage</p>
                          <p className="font-semibold">${parseFloat(policy.details.coverageAmount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Premium</p>
                          <p className="font-semibold">${parseFloat(policy.details.premium).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <a
                        href={policy.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 