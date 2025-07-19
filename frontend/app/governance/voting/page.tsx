'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';

interface Claim {
  id: string;
  claimId: string;
  policyId: string;
  userId: string;
  type: string;
  status: string;
  requestedAmount: string;
  description: string;
  aiAnalysis: {
    fraudScore: number;
    authenticityScore: number;
    confidence: number;
    recommendation: string;
    reasoning: string;
    detectedIssues: string[];
  };
  documents: string[];
  images: string[];
  submittedAt: string;
  votingDeadline: string;
  votes: {
    for: string;
    against: string;
    abstain: string;
  };
  hasVoted: boolean;
  userVote?: 'for' | 'against' | 'abstain';
}

interface VotingPower {
  total: string;
  available: string;
  locked: string;
}

export default function VotingPage() {
  const { isConnected, account, userData, chainId } = useWeb3();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingPower, setVotingPower] = useState<VotingPower>({
    total: '0',
    available: '0',
    locked: '0'
  });
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [voteChoice, setVoteChoice] = useState<'for' | 'against' | 'abstain'>('for');
  const [voting, setVoting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'voted'>('all');

  useEffect(() => {
    if (isConnected && chainId === 97) {
      fetchClaimsForVoting();
      fetchVotingPower();
    }
  }, [isConnected, chainId]);

  const fetchClaimsForVoting = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/v1/governance/claims-for-voting', {
        headers: {
          'Authorization': `Bearer ${account}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      } else {
        console.error('Failed to fetch claims for voting');
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVotingPower = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/governance/voting-power/${account}`);
      if (response.ok) {
        const data = await response.json();
        setVotingPower(data);
      }
    } catch (error) {
      console.error('Error fetching voting power:', error);
    }
  };

  const submitVote = async (claimId: string, choice: 'for' | 'against' | 'abstain') => {
    if (!account) return;

    setVoting(true);
    try {
      // Submit vote to blockchain
      const blockchainResponse = await fetch('http://localhost:3000/api/v1/blockchain/governance/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimId,
          voter: account,
          choice,
          votingPower: votingPower.available,
        }),
      });

      if (blockchainResponse.ok) {
        // Update local state
        setClaims(prev => prev.map(claim => 
          claim.id === claimId 
            ? {
                ...claim,
                hasVoted: true,
                userVote: choice,
                votes: {
                  ...claim.votes,
                  [choice]: (parseFloat(claim.votes[choice]) + parseFloat(votingPower.available)).toString()
                }
              }
            : claim
        ));

        // Update voting power
        await fetchVotingPower();
        
        // Close modal
        setSelectedClaim(null);
        
        alert('Vote submitted successfully!');
      } else {
        throw new Error('Failed to submit vote to blockchain');
      }
    } catch (error) {
      console.error('Voting error:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  const getFilteredClaims = () => {
    switch (filter) {
      case 'pending':
        return claims.filter(claim => !claim.hasVoted && new Date(claim.votingDeadline) > new Date());
      case 'voted':
        return claims.filter(claim => claim.hasVoted);
      default:
        return claims;
    }
  };

  const getAIRecommendationBadge = (recommendation: string) => {
    const badges = {
      'approve': 'bg-green-100 text-green-800 border border-green-200',
      'low_risk_approve': 'bg-green-100 text-green-800 border border-green-200',
      'manual_review': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'standard_review': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'high_risk_reject': 'bg-red-100 text-red-800 border border-red-200',
      'reject': 'bg-red-100 text-red-800 border border-red-200',
    };

    return badges[recommendation] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-4">Please connect your MetaMask wallet to participate in governance voting.</p>
        </div>
      </div>
    );
  }

  if (chainId !== 97) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wrong Network</h2>
          <p className="text-gray-600 mb-4">Please switch to BSC Testnet to participate in governance voting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Governance</h1>
              <p className="text-sm text-gray-500">Vote on AI-analyzed claims</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Voting Power: {parseFloat(votingPower.available).toFixed(2)} CST
                </div>
                <div className="text-xs text-gray-500">
                  Total: {parseFloat(votingPower.total).toFixed(2)} CST
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Claims', count: claims.length },
                { key: 'pending', label: 'Pending Votes', count: claims.filter(c => !c.hasVoted && new Date(c.votingDeadline) > new Date()).length },
                { key: 'voted', label: 'Voted', count: claims.filter(c => c.hasVoted).length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Claims List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">Loading claims for voting...</p>
          </div>
        ) : getFilteredClaims().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Available</h3>
            <p className="text-gray-500">There are no claims available for voting at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {getFilteredClaims().map((claim) => (
              <div key={claim.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Claim #{claim.claimId.slice(0, 8)}...
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAIRecommendationBadge(claim.aiAnalysis.recommendation)}`}>
                        AI: {claim.aiAnalysis.recommendation.replace('_', ' ').toUpperCase()}
                      </span>
                      {claim.hasVoted && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Voted: {claim.userVote?.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <p className="text-sm text-gray-900 capitalize">{claim.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Requested Amount</p>
                        <p className="text-sm text-gray-900">{formatAmount(claim.requestedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Voting Deadline</p>
                        <p className="text-sm text-gray-900">
                          {new Date(claim.votingDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{claim.description}</p>

                    {/* AI Analysis Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Fraud Risk</p>
                          <div className="flex items-center">
                            <div className={`w-12 h-2 rounded-full mr-2 ${
                              claim.aiAnalysis.fraudScore < 0.3 ? 'bg-green-400' :
                              claim.aiAnalysis.fraudScore < 0.7 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <span className="text-sm font-medium">
                              {(claim.aiAnalysis.fraudScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Authenticity</p>
                          <div className="flex items-center">
                            <div className={`w-12 h-2 rounded-full mr-2 ${
                              claim.aiAnalysis.authenticityScore > 0.7 ? 'bg-green-400' :
                              claim.aiAnalysis.authenticityScore > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <span className="text-sm font-medium">
                              {(claim.aiAnalysis.authenticityScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Confidence</p>
                          <div className="flex items-center">
                            <div className={`w-12 h-2 rounded-full mr-2 ${
                              claim.aiAnalysis.confidence > 0.7 ? 'bg-green-400' :
                              claim.aiAnalysis.confidence > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <span className="text-sm font-medium">
                              {(claim.aiAnalysis.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{claim.aiAnalysis.reasoning}</p>
                    </div>

                    {/* Current Votes */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {parseFloat(claim.votes.for).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">FOR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {parseFloat(claim.votes.against).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">AGAINST</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">
                          {parseFloat(claim.votes.abstain).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">ABSTAIN</div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      View Details
                    </button>
                    {!claim.hasVoted && new Date(claim.votingDeadline) > new Date() && (
                      <button
                        onClick={() => {
                          setSelectedClaim(claim);
                          setVoteChoice('for');
                        }}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Vote Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {selectedClaim && (
        <div className="modal-overlay">
          <div className="modal-content max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Claim Details & Voting
              </h2>
              <button
                onClick={() => setSelectedClaim(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Claim Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Claim Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Claim ID</label>
                    <p className="text-sm text-gray-900">{selectedClaim.claimId}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedClaim.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requested Amount</label>
                    <p className="text-sm text-gray-900">{formatAmount(selectedClaim.requestedAmount)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900">{selectedClaim.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents</label>
                    <p className="text-sm text-gray-900">{selectedClaim.documents.length} documents uploaded</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Images</label>
                    <p className="text-sm text-gray-900">{selectedClaim.images.length} images uploaded</p>
                  </div>
                </div>

                {/* AI Analysis Details */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4">AI Analysis Report</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Recommendation</label>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getAIRecommendationBadge(selectedClaim.aiAnalysis.recommendation)}`}>
                          {selectedClaim.aiAnalysis.recommendation.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reasoning</label>
                        <p className="text-sm text-gray-900">{selectedClaim.aiAnalysis.reasoning}</p>
                      </div>
                      
                      {selectedClaim.aiAnalysis.detectedIssues.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Detected Issues</label>
                          <ul className="text-sm text-gray-900 list-disc list-inside">
                            {selectedClaim.aiAnalysis.detectedIssues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                
                {selectedClaim.hasVoted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Vote Submitted</h4>
                    <p className="text-gray-600">
                      You voted: <span className="font-medium uppercase">{selectedClaim.userVote}</span>
                    </p>
                  </div>
                ) : new Date(selectedClaim.votingDeadline) <= new Date() ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Voting Closed</h4>
                    <p className="text-gray-600">The voting period for this claim has ended.</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Your Vote Choice
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'for', label: 'Approve Claim', description: 'I believe this claim should be approved and paid', color: 'green' },
                          { value: 'against', label: 'Reject Claim', description: 'I believe this claim should be rejected', color: 'red' },
                          { value: 'abstain', label: 'Abstain', description: 'I choose not to vote on this claim', color: 'gray' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="vote"
                              value={option.value}
                              checked={voteChoice === option.value}
                              onChange={(e) => setVoteChoice(e.target.value as any)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className={`font-medium text-${option.color}-800`}>
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700">Voting Power</label>
                      <p className="text-lg font-bold text-indigo-600">
                        {parseFloat(votingPower.available).toFixed(2)} CST
                      </p>
                      <p className="text-sm text-gray-500">
                        Available for voting
                      </p>
                    </div>

                    <button
                      onClick={() => submitVote(selectedClaim.id, voteChoice)}
                      disabled={voting || parseFloat(votingPower.available) <= 0}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      {voting ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Submitting Vote...
                        </>
                      ) : (
                        `Submit Vote (${voteChoice.toUpperCase()})`
                      )}
                    </button>

                    {parseFloat(votingPower.available) <= 0 && (
                      <p className="text-sm text-red-600 mt-2 text-center">
                        You don't have enough voting power to vote on this claim.
                      </p>
                    )}
                  </div>
                )}

                {/* Current Vote Tally */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Current Results</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'for', label: 'For', color: 'green', value: selectedClaim.votes.for },
                      { key: 'against', label: 'Against', color: 'red', value: selectedClaim.votes.against },
                      { key: 'abstain', label: 'Abstain', color: 'gray', value: selectedClaim.votes.abstain },
                    ].map((vote) => {
                      const total = parseFloat(selectedClaim.votes.for) + parseFloat(selectedClaim.votes.against) + parseFloat(selectedClaim.votes.abstain);
                      const percentage = total > 0 ? (parseFloat(vote.value) / total) * 100 : 0;
                      
                      return (
                        <div key={vote.key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{vote.label}</span>
                            <span className="text-sm text-gray-600">
                              {parseFloat(vote.value).toFixed(0)} CST ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-${vote.color}-500 h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 