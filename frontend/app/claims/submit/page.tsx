'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { useRouter } from 'next/navigation';

interface Policy {
  tokenId: string;
  owner: string;
  exists: boolean;
  details: {
    holder: string;
    coverageAmount: string;
    premium: string;
    startTime: string;
    endTime: string;
    active: boolean;
  };
}

interface ClaimForm {
  policyTokenId: string;
  amount: number;
  description: string;
  claimType: string;
  evidenceHashes: string[];
}

export default function SubmitClaimPage() {
  const { account, isConnected, connectWallet, chainId } = useWeb3();
  const router = useRouter();
  
  const [userPolicies, setUserPolicies] = useState<Policy[]>([]);
  const [form, setForm] = useState<ClaimForm>({
    policyTokenId: '',
    amount: 0,
    description: '',
    claimType: 'general',
    evidenceHashes: []
  });
  
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      loadUserPolicies();
    }
  }, [isConnected, account]);

  useEffect(() => {
    if (form.policyTokenId) {
      const policy = userPolicies.find(p => p.tokenId === form.policyTokenId);
      setSelectedPolicy(policy || null);
      if (policy) {
        setForm(prev => ({
          ...prev,
          amount: Math.min(parseFloat(policy.details.coverageAmount), prev.amount || 0)
        }));
      }
    }
  }, [form.policyTokenId, userPolicies]);

  const loadUserPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/blockchain/policies/${account}`);
      if (response.ok) {
        const data = await response.json();
        // Transform the new response format to match the expected Policy interface
        const activePolicies = (data.policies || []).map((p: any) => ({
          tokenId: p.tokenId || '0',
          owner: p.owner || account || '',
          exists: p.exists !== false,
          details: {
            holder: p.details?.policyholder || p.owner || account || '',
            coverageAmount: p.details?.coverageAmount || '0',
            premium: p.details?.premium || '0',
            startTime: p.details?.creationDate || new Date().toISOString(),
            endTime: p.details?.expiryDate || new Date().toISOString(),
            active: p.details?.status === 'active' || p.isActive
          }
        })).filter((p: Policy) => p.details.active);
        setUserPolicies(activePolicies);
      } else {
        // Use fallback data if API fails
        setUserPolicies([
          {
            tokenId: '1',
            owner: account,
            exists: true,
            details: {
              holder: account,
              coverageAmount: '5000',
              premium: '150',
              startTime: '2024-01-15T00:00:00.000Z',
              endTime: '2025-01-15T00:00:00.000Z',
              active: true
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading user policies:', error);
      // Use fallback data
      setUserPolicies([
        {
          tokenId: '1',
          owner: account,
          exists: true,
          details: {
            holder: account,
            coverageAmount: '5000',
            premium: '150',
            startTime: '2024-01-15T00:00:00.000Z',
            endTime: '2025-01-15T00:00:00.000Z',
            active: true
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Generate mock IPFS hashes for demo
    const newHashes = files.map(() => `Qm${Math.random().toString(36).substring(2, 15)}`);
    setForm(prev => ({
      ...prev,
      evidenceHashes: [...prev.evidenceHashes, ...newHashes]
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({
      ...prev,
      evidenceHashes: prev.evidenceHashes.filter((_, i) => i !== index)
    }));
  };

  const analyzeClaimWithAI = async () => {
    if (!form.description || form.amount <= 0) {
      alert('Please provide claim description and amount before AI analysis');
      return;
    }

    try {
      setAnalyzing(true);
      
      const response = await fetch('/api/v1/ai/analyze-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer chainsure_dev_key_2024'
        },
        body: JSON.stringify({
          claimId: `claim_${Date.now()}`,
          claimType: form.claimType,
          requestedAmount: form.amount,
          description: form.description,
          documents: form.evidenceHashes
        })
      });
      
      const analysis = await response.json();
      setAiAnalysis(analysis);
      
    } catch (error) {
      console.error('Error analyzing claim with AI:', error);
      alert('Failed to analyze claim with AI');
    } finally {
      setAnalyzing(false);
    }
  };

  const submitClaim = async () => {
    if (!account || !form.policyTokenId || form.amount <= 0 || !form.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedPolicy?.details.active) {
      alert('Selected policy is not active');
      return;
    }

    if (form.amount > parseFloat(selectedPolicy.details.coverageAmount)) {
      alert('Claim amount cannot exceed policy coverage amount');
      return;
    }

    try {
      setSubmitting(true);
      
      const claimData = {
        policyTokenId: form.policyTokenId,
        amount: form.amount,
        description: form.description,
        claimType: form.claimType,
        evidenceHashes: form.evidenceHashes
      };
      
      const response = await fetch('/api/v1/blockchain/claim/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claimData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Claim submission data prepared! Send the transaction data to your wallet to complete the claim submission.');
        
        // Show transaction data for user to copy
        console.log('Transaction Data:', result.transaction);
        
        // Reset form
        setForm({
          policyTokenId: '',
          amount: 0,
          description: '',
          claimType: 'general',
          evidenceHashes: []
        });
        setSelectedPolicy(null);
        setUploadedFiles([]);
        setAiAnalysis(null);
      } else {
        alert('Failed to submit claim: ' + result.message);
      }
      
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim');
    } finally {
      setSubmitting(false);
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Insurance Claim</h1>
            <p className="text-xl text-gray-600 mb-8">Connect your wallet to submit a claim</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (chainId !== 97) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Wrong Network</h1>
            <p className="text-xl text-gray-600 mb-8">Please switch to BSC Testnet to submit claims</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Insurance Claim</h1>
              <p className="text-gray-600 mt-2">Submit a claim for your active insurance policy</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Active Policies</p>
              <p className="text-2xl font-bold text-blue-600">{userPolicies.length}</p>
              <p className="text-xs text-gray-400">Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Claim Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Claim Details</h2>
              
              <div className="space-y-6">
                {/* Policy Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Policy *
                  </label>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading policies...</p>
                    </div>
                  ) : userPolicies.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-gray-400 text-4xl mb-4">📄</div>
                      <p className="text-gray-500">No active policies found</p>
                      <p className="text-sm text-gray-400">Create a policy first to submit claims</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userPolicies.map((policy) => (
                        <div
                          key={policy.tokenId}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            form.policyTokenId === policy.tokenId
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setForm(prev => ({ ...prev, policyTokenId: policy.tokenId }))}
                        >
                          <h3 className="font-semibold text-gray-900">Policy #{policy.tokenId}</h3>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="text-gray-600">Coverage: ${parseFloat(policy.details.coverageAmount).toLocaleString()}</p>
                            <p className="text-gray-600">Expires: {new Date(policy.details.endTime).toLocaleDateString()}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              policy.details.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {policy.details.active ? 'Active' : 'Expired'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Claim Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Type *
                  </label>
                  <select
                    value={form.claimType}
                    onChange={(e) => setForm(prev => ({ ...prev, claimType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="health">Health</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="travel">Travel</option>
                    <option value="property">Property</option>
                    <option value="liability">Liability</option>
                  </select>
                </div>

                {/* Claim Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter claim amount"
                      max={selectedPolicy ? parseFloat(selectedPolicy.details.coverageAmount) : undefined}
                    />
                  </div>
                  {selectedPolicy && (
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum: ${parseFloat(selectedPolicy.details.coverageAmount).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Claim Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe the incident, damage, or loss in detail..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents & Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="text-gray-400 text-4xl mb-4">📎</div>
                      <p className="text-gray-600">Click to upload files</p>
                      <p className="text-sm text-gray-400">Images, PDFs, documents (max 10MB each)</p>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">📄</span>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Analysis Button */}
                <div>
                  <button
                    onClick={analyzeClaimWithAI}
                    disabled={analyzing || !form.description || form.amount <= 0}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {analyzing ? 'Analyzing with AI...' : 'Analyze Claim with AI'}
                  </button>
                </div>

                {/* Submit Claim Button */}
                <button
                  onClick={submitClaim}
                  disabled={submitting || !form.policyTokenId || form.amount <= 0 || !form.description}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  {submitting ? 'Submitting Claim...' : 'Submit Claim'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Analysis Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Analysis</h2>
              
              {!aiAnalysis ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🤖</div>
                  <p className="text-gray-500">No analysis yet</p>
                  <p className="text-sm text-gray-400">Fill in claim details and click "Analyze"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Fraud Score */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Fraud Risk Assessment</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fraud Score:</span>
                      <span className={`text-lg font-bold ${getFraudScoreColor(aiAnalysis.fraudScore)}`}>
                        {aiAnalysis.fraudScore}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            aiAnalysis.fraudScore < 30 ? 'bg-green-500' :
                            aiAnalysis.fraudScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${aiAnalysis.fraudScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Authenticity Score */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Document Authenticity</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Authenticity:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Math.round(aiAnalysis.authenticityScore * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      aiAnalysis.recommendation === 'approve' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {aiAnalysis.recommendation.toUpperCase()}
                    </span>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI Reasoning</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {aiAnalysis.reasoning}
                    </p>
                  </div>

                  {/* Detected Issues */}
                  {aiAnalysis.detectedIssues && aiAnalysis.detectedIssues.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Detected Issues</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {aiAnalysis.detectedIssues.map((issue: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Confidence Score */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Analysis Confidence</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {Math.round(aiAnalysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 