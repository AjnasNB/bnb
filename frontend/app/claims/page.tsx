'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '../context/Web3Context';

interface Claim {
  id: string;
  policyTokenId: string;
  claimant: string;
  claimType: string;
  status: string;
  requestedAmount: string;
  approvedAmount?: string;
  description: string;
  submittedAt: string;
  evidenceHashes: string[];
  fraudScore?: number;
  aiAnalysis?: {
    fraudScore: number;
    authenticityScore: number;
    recommendation: string;
    reasoning: string;
    detectedIssues: string[];
  };
}

export default function ClaimsPage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    if (isConnected && account) {
      loadClaims();
    }
  }, [isConnected, account]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredClaims(claims);
    } else {
      setFilteredClaims(claims.filter(claim => claim.status === statusFilter));
    }
  }, [claims, statusFilter]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      
      // Load all claims
      const response = await fetch('/api/v1/claims');
      const data = await response.json();
      
      if (data.claims) {
        setClaims(data.claims);
      }
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Insurance Claims</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to view and vote on claims</p>
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Claims</h1>
              <p className="text-gray-600">Review and vote on community insurance claims</p>
            </div>
            <Link
              href="/claims/submit"
              className="btn-primary"
            >
              Submit Claim
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {claims.filter(c => c.status === 'pending' || c.status === 'under_review').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {claims.filter(c => c.status === 'approved' || c.status === 'paid').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {claims.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">All Claims</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div className="ml-auto">
              <button
                onClick={loadClaims}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading claims...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
              <p className="text-gray-500">
                {statusFilter === 'all' 
                  ? 'No claims have been submitted yet.' 
                  : `No claims with status "${statusFilter}" found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Claim #{claim.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Policy #{claim.policyTokenId} • {claim.claimType}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Requested Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${parseFloat(claim.requestedAmount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Claimant</p>
                      <p className="font-mono text-sm text-gray-900">
                        {formatAddress(claim.claimant)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(claim.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {claim.description}
                  </p>

                  {/* AI Analysis */}
                  {claim.aiAnalysis && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">AI Analysis</h4>
                        <span className={`text-sm font-semibold ${getFraudScoreColor(claim.aiAnalysis.fraudScore)}`}>
                          Fraud Score: {claim.aiAnalysis.fraudScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">
                          Recommendation: {claim.aiAnalysis.recommendation}
                        </span>
                        <span className="text-blue-600">
                          Authenticity: {Math.round(claim.aiAnalysis.authenticityScore * 100)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/claims/${claim.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {(claim.status === 'pending' || claim.status === 'under_review') && (
                      <Link
                        href={`/governance/voting?claimId=${claim.id}`}
                        className="btn-primary text-sm"
                      >
                        Vote on Claim
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Detail Modal */}
        {selectedClaim && (
          <div className="modal-overlay" onClick={() => setSelectedClaim(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Claim #{selectedClaim.id} Details
                </h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClaim.status)}`}>
                      {selectedClaim.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Claim Type</p>
                    <p className="font-medium">{selectedClaim.claimType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requested Amount</p>
                    <p className="font-semibold">${parseFloat(selectedClaim.requestedAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy ID</p>
                    <p className="font-mono text-sm">#{selectedClaim.policyTokenId}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-900">{selectedClaim.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Claimant</p>
                  <p className="font-mono text-sm">{selectedClaim.claimant}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Submitted</p>
                  <p className="text-sm">{formatDate(selectedClaim.submittedAt)}</p>
                </div>

                {selectedClaim.evidenceHashes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Evidence Files</p>
                    <div className="space-y-2">
                      {selectedClaim.evidenceHashes.map((hash, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="font-mono text-xs text-gray-600">{hash}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    href={`/claims/${selectedClaim.id}`}
                    className="btn-secondary flex-1 text-center"
                  >
                    View Full Details
                  </Link>
                  {(selectedClaim.status === 'pending' || selectedClaim.status === 'under_review') && (
                    <Link
                      href={`/governance/voting?claimId=${selectedClaim.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      Vote on Claim
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 