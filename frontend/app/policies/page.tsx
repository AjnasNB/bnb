'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function PoliciesPage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState('my-policies');
  const [userPolicies, setUserPolicies] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      loadUserPolicies();
      loadPolicyTypes();
    }
  }, [isConnected, account]);

  const loadUserPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/blockchain/policies/${account}`);
      if (response.ok) {
        const data = await response.json();
        setUserPolicies(data.policies || []);
      } else {
        setUserPolicies([]);
      }
    } catch (error) {
      console.error('Error loading user policies:', error);
      // Fallback to empty array if API fails
      setUserPolicies([]);
    } finally {
      setLoading(false);
    }
  };

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
          duration: 30
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your policies</p>
          <button
            onClick={connectWallet}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ChainSure</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/policies" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Policies
                </Link>
                <Link href="/claims" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Claims
                </Link>
                <Link href="/governance" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Governance
                </Link>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Insurance Policies
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your NFT-based insurance policies on the blockchain
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/policies/create" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Create New Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-policies')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-policies'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Policies
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Coverage
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Policy
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'my-policies' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading your policies...</p>
              </div>
            ) : userPolicies.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies Found</h3>
                <p className="text-gray-600 mb-4">You don't have any insurance policies yet.</p>
                <Link href="/policies/create" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Create Your First Policy
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPolicies.map((policy, index) => (
                  <div key={policy.tokenId || index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          policy.details?.active ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          policy.details?.active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {policy.details?.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">NFT #{policy.tokenId}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {policy.details?.holder || 'Insurance Policy'}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Coverage Amount:</span>
                        <span className="font-medium">${policy.details?.coverageAmount || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium:</span>
                        <span className="font-medium">${policy.details?.premium || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className="font-medium">
                          {policy.details?.endTime ? new Date(policy.details.endTime).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link href={`/claims/submit?policyId=${policy.tokenId}`} className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 text-center">
                        File Claim
                      </Link>
                      <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policyTypes.map((type) => (
                <div key={type.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Coverage Range:</span>
                        <span className="font-medium">${type.minCoverage?.toLocaleString()} - ${type.maxCoverage?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Rate:</span>
                        <span className="font-medium">{(type.premiumRate * 100).toFixed(1)}% annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{type.duration} days</span>
                      </div>
                    </div>
                    <Link href={`/policies/create?type=${type.id}`} className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 inline-block">
                      Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Policy</h3>
              <p className="text-gray-600 mb-6">Start creating your NFT-based insurance policy on the blockchain</p>
              <Link href="/policies/create" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 