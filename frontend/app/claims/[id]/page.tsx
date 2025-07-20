'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Claim {
  id: string;
  claimId: string;
  userId: string;
  policyId: string;
  type: string;
  status: string;
  requestedAmount: string;
  approvedAmount?: string;
  description: string;
  documents: string[];
  images: string[];
  aiAnalysis?: any;
  reviewNotes?: any;
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
  votingDetails?: any;
}

interface VotingDetails {
  votesFor: string;
  votesAgainst: string;
  totalVotes: string;
  votingEnds: string;
  jurors?: string[];
  averageAmount?: string;
  concluded?: boolean;
}

export default function ClaimDetailsPage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [votingDetails, setVotingDetails] = useState<VotingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteChoice, setVoteChoice] = useState<'approve' | 'reject'>('approve');
  const [voteReason, setVoteReason] = useState('');
  const [voting, setVoting] = useState(false);

  const claimId = params.id as string;

  useEffect(() => {
    if (claimId) {
      loadClaimDetails();
    }
  }, [claimId]);

  const loadClaimDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get claim details
      const claimResponse = await fetch(`/api/v1/claims/${claimId}`);
      if (!claimResponse.ok) {
        throw new Error('Claim not found');
      }
      const claimData = await claimResponse.json();
      setClaim(claimData);

      // Get voting details if claim is under review
      if (claimData.status === 'pending' || claimData.status === 'under_review') {
        try {
          const votingResponse = await fetch(`/api/v1/claims/${claimId}/voting-details`);
          if (votingResponse.ok) {
            const votingData = await votingResponse.json();
            setVotingDetails(votingData.votingDetails);
          }
        } catch (votingError) {
          console.warn('Could not load voting details:', votingError);
        }
      }
    } catch (error) {
      console.error('Error loading claim details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async () => {
    if (!account || !voteReason.trim()) {
      alert('Please provide a reason for your vote');
      return;
    }

    try {
      setVoting(true);
      
      const voteData = {
        claimId: claimId,
        voter: account,
        approved: voteChoice === 'approve',
        reason: voteReason,
        suggestedAmount: claim?.requestedAmount || '0'
      };
      
      const response = await fetch('/api/v1/claims/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Vote submitted successfully! Transaction data prepared for wallet execution.');
        await loadClaimDetails(); // Reload to get updated voting details
        setVoteReason('');
        setVoteChoice('approve');
      } else {
        alert('Failed to submit vote: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setVoting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      case 'under_review': return 'text-blue-400';
      default: return 'text-white/70';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      case 'under_review': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <h1 className="text-4xl font-bold gradient-text mb-6">Claim Details</h1>
            <p className="text-white/80 text-xl mb-8">
              Connect your wallet to view claim details and voting status
            </p>
            <button 
              onClick={connectWallet}
              className="metamask-btn mx-auto"
            >
              <span>🦊</span>
              Connect MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/80">Loading claim details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <h1 className="text-4xl font-bold gradient-text mb-6">Claim Not Found</h1>
            <p className="text-white/80 text-xl mb-8">
              {error || 'The requested claim could not be found'}
            </p>
            <Link href="/claims" className="btn-primary">
              Back to Claims
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Claim Details
            </h1>
            <p className="text-white/60">Claim ID: {claim.claimId}</p>
          </div>
          <Link href="/claims" className="btn-secondary">
            ← Back to Claims
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Claim Information */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Claim Information</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(claim.status)}`}>
                  {claim.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Policy ID</label>
                  <p className="text-white font-semibold">{claim.policyId}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Claim Type</label>
                  <p className="text-white font-semibold capitalize">{claim.type}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Requested Amount</label>
                  <p className="text-white font-semibold">${claim.requestedAmount}</p>
                </div>
                {claim.approvedAmount && (
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Approved Amount</label>
                    <p className="text-white font-semibold">${claim.approvedAmount}</p>
                  </div>
                )}
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Submitted By</label>
                  <p className="text-white font-semibold">{formatAddress(claim.userId)}</p>
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Submitted At</label>
                  <p className="text-white font-semibold">{formatDate(claim.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-white/60 text-sm font-medium mb-2">Description</label>
                <p className="text-white bg-white/5 p-4 rounded-lg">{claim.description}</p>
              </div>

              {claim.documents && claim.documents.length > 0 && (
                <div className="mt-6">
                  <label className="block text-white/60 text-sm font-medium mb-2">Evidence Files</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {claim.documents.map((doc, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg">
                        <p className="text-white text-sm">Evidence #{index + 1}</p>
                        <p className="text-white/60 text-xs">{doc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {claim.transactionHash && (
                <div className="mt-6">
                  <label className="block text-white/60 text-sm font-medium mb-2">Transaction Hash</label>
                  <a 
                    href={`https://testnet.bscscan.com/tx/${claim.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {claim.transactionHash}
                  </a>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {claim.aiAnalysis && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Fraud Score</label>
                    <p className="text-white font-semibold">{claim.aiAnalysis.fraudScore}%</p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Authenticity Score</label>
                    <p className="text-white font-semibold">{(claim.aiAnalysis.authenticityScore * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Recommendation</label>
                    <p className="text-white font-semibold capitalize">{claim.aiAnalysis.recommendation}</p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Confidence</label>
                    <p className="text-white font-semibold">{(claim.aiAnalysis.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-white/60 text-sm font-medium mb-2">Reasoning</label>
                  <p className="text-white bg-white/5 p-4 rounded-lg">{claim.aiAnalysis.reasoning}</p>
                </div>
              </div>
            )}
          </div>

          {/* Voting Section */}
          <div className="lg:col-span-1">
            {/* Voting Status */}
            {votingDetails && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Voting Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Votes For</label>
                    <p className="text-green-400 font-semibold">{votingDetails.votesFor}</p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Votes Against</label>
                    <p className="text-red-400 font-semibold">{votingDetails.votesAgainst}</p>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Total Votes</label>
                    <p className="text-white font-semibold">{votingDetails.totalVotes}</p>
                  </div>
                  {votingDetails.votingEnds && (
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Voting Ends</label>
                      <p className="text-white font-semibold">{formatDate(votingDetails.votingEnds)}</p>
                    </div>
                  )}
                  {votingDetails.concluded && (
                    <div className="bg-green-400/10 border border-green-400/20 p-3 rounded-lg">
                      <p className="text-green-400 font-semibold">Voting Concluded</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vote Form */}
            {(claim.status === 'pending' || claim.status === 'under_review') && (
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Cast Your Vote</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Vote Choice</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="approve"
                          checked={voteChoice === 'approve'}
                          onChange={(e) => setVoteChoice(e.target.value as 'approve' | 'reject')}
                          className="mr-2"
                        />
                        <span className="text-green-400">Approve</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="reject"
                          checked={voteChoice === 'reject'}
                          onChange={(e) => setVoteChoice(e.target.value as 'approve' | 'reject')}
                          className="mr-2"
                        />
                        <span className="text-red-400">Reject</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Reason</label>
                    <textarea
                      value={voteReason}
                      onChange={(e) => setVoteReason(e.target.value)}
                      placeholder="Explain your voting decision..."
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                      rows={4}
                    />
                  </div>
                  <button
                    onClick={submitVote}
                    disabled={voting || !voteReason.trim()}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {voting ? 'Submitting Vote...' : 'Submit Vote'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 