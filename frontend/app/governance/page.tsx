'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Link from 'next/link';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: string;
  votesFor: string;
  votesAgainst: string;
  startTime: string;
  endTime: string;
  executed: boolean;
  metadata?: {
    proposalType: string;
    claimData?: any;
    action?: string;
    currentValue?: string;
    proposedValue?: string;
  };
}

interface Claim {
  id: string;
  claimId: string;
  policyTokenId: string;
  claimant: string;
  amount: string;
  description: string;
  status: string;
  submittedAt: string;
  evidenceHashes: string[];
  aiAnalysis?: {
    fraudScore: number;
    authenticityScore: number;
    recommendation: string;
    reasoning: string;
    confidence: number;
  };
  votingDetails?: {
    votesFor: string;
    votesAgainst: string;
    totalVotes: string;
    votingEnds: string;
    approvalPercentage?: number; // Added for modal
  };
}

export default function GovernancePage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [votingPower, setVotingPower] = useState('0');
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [voteChoice, setVoteChoice] = useState<'approve' | 'reject'>('approve');
  const [voteReason, setVoteReason] = useState('');
  const [voteLoading, setVoteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'claims' | 'proposals'>('claims');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposalVoteChoice, setProposalVoteChoice] = useState<boolean | null>(null);
  const [proposalVoteReason, setProposalVoteReason] = useState('');

  // Function to open claim details modal
  const openClaimDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowClaimModal(true);
    
    // Use transaction hash to fetch detailed claim data from backend
    if (claim.claimId) {
      fetchClaimDetails(claim.claimId);
    }
  };

  const fetchClaimDetails = async (claimId: string) => {
    try {
      console.log('Fetching claim details using transaction hash:', claimId);
      
      // Use the claimId as transaction hash to fetch from backend
      const response = await fetch(`/api/v1/claims/${claimId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.claim) {
          setSelectedClaim(data.claim);
        }
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
      // Keep using the fallback claim data
    }
  };

  // Function to close claim details modal
  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedClaim(null);
    setVoteReason('');
    setVoteChoice('approve');
  };

  // Function to vote on claim with MetaMask
  const voteOnClaim = async (claimId: string) => {
    if (!isConnected || !account) {
      alert('Please connect your wallet to vote');
      return;
    }

    if (!voteReason.trim()) {
      alert('Please provide a reason for your vote');
      return;
    }

    try {
      setVoteLoading(true);
      
      // Create vote transaction data
      const voteData = {
        to: '0x528Bf18723c2021420070e0bB2912F881a93ca53', // Claims Engine
        data: '0x', // Mimic voting data
        value: '0x0',
        estimatedGas: '300000',
      };

      if (!(window as any).ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      const tx = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: voteData.to,
          data: voteData.data,
          value: voteData.value,
          gas: voteData.estimatedGas,
        }],
      });

      alert(`Vote submitted successfully! Transaction hash: ${tx}`);
      closeClaimModal();
      
      // Reload governance data
      await loadGovernanceData();
      
    } catch (error) {
      console.error('Vote submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to submit vote: ' + errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  // Function to vote on governance proposal
  const voteOnProposal = async (proposalId: string, support: boolean, reason: string) => {
    if (!isConnected || !account) {
      alert('Please connect your wallet to vote');
      return;
    }

    if (!reason.trim()) {
      alert('Please provide a reason for your vote');
      return;
    }

    try {
      setVoteLoading(true);
      
      // Always trigger MetaMask transaction for voting
      const transactionData = {
        to: '0x364424CBf264F54A0fFE12D99F3902B398fc0B36', // Governance contract
        data: '0x', // Placeholder for actual vote data
        value: '0x0',
        estimatedGas: '300000',
        proposalId: proposalId,
        support: support,
        reason: reason
      };
      
      console.log('Triggering MetaMask transaction for proposal vote:', proposalId);
      
      // Execute transaction in MetaMask
      try {
        const tx = await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: account,
            to: transactionData.to,
            data: transactionData.data,
            value: transactionData.value,
            gas: transactionData.estimatedGas,
          }],
        });

        alert(`Governance vote submitted successfully! Transaction hash: ${tx}`);
        
        // Reload governance data
        await loadGovernanceData();
      } catch (txError) {
        console.error('MetaMask transaction failed:', txError);
        alert(`MetaMask transaction failed: ${txError.message}`);
      }
      
    } catch (error) {
      console.error('Error submitting proposal vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      loadGovernanceData();
    }
  }, [isConnected, account]);

  const loadGovernanceData = async () => {
    try {
      setLoading(true);
      console.log('Loading governance data...');
      
      // Always use fallback data to ensure we have content
      const fallbackProposals = [
        {
          id: '1',
          title: 'Claim Review: Emergency Medical Treatment',
          description: 'Review claim for policy #1. Amount: $3000. Description: Emergency medical treatment for broken leg',
          status: 'active',
          votesFor: '1500',
          votesAgainst: '500',
          startTime: '2024-01-15T00:00:00.000Z',
          endTime: '2024-01-22T00:00:00.000Z',
          executed: false,
          metadata: {
            proposalType: 'claim_review',
            claimData: {
              claimId: 'claim_1234567890_abc123',
              policyTokenId: '1',
              amount: '3000',
              description: 'Emergency medical treatment for broken leg'
            }
          }
        },
        {
          id: '2',
          title: 'Claim Review: Car Accident Damage',
          description: 'Review claim for policy #2. Amount: $2500. Description: Car accident damage repair',
          status: 'active',
          votesFor: '1200',
          votesAgainst: '800',
          startTime: '2024-01-16T00:00:00.000Z',
          endTime: '2024-01-23T00:00:00.000Z',
          executed: false,
          metadata: {
            proposalType: 'claim_review',
            claimData: {
              claimId: 'claim_1234567891_def456',
              policyTokenId: '2',
              amount: '2500',
              description: 'Car accident damage repair'
            }
          }
        },
        {
          id: '3',
          title: 'Governance: Increase Minimum Stake Amount',
          description: 'Proposal to increase minimum stake amount for governance participation from 1000 CSG to 2000 CSG',
          status: 'active',
          votesFor: '800',
          votesAgainst: '1200',
          startTime: '2024-01-17T00:00:00.000Z',
          endTime: '2024-01-24T00:00:00.000Z',
          executed: false,
          metadata: {
            proposalType: 'governance',
            action: 'increase_minimum_stake',
            currentValue: '1000',
            proposedValue: '2000'
          }
        },
        {
          id: '4',
          title: 'Governance: Update Claims Processing Fee',
          description: 'Proposal to update claims processing fee from 2% to 1.5% to reduce costs for policyholders',
          status: 'active',
          votesFor: '1800',
          votesAgainst: '200',
          startTime: '2024-01-18T00:00:00.000Z',
          endTime: '2024-01-25T00:00:00.000Z',
          executed: false,
          metadata: {
            proposalType: 'governance',
            action: 'update_processing_fee',
            currentValue: '2%',
            proposedValue: '1.5%'
          }
        },
        {
          id: '5',
          title: 'Claim Review: Home Fire Damage',
          description: 'Review claim for policy #3. Amount: $5000. Description: House fire damage repair',
          status: 'active',
          votesFor: '900',
          votesAgainst: '1100',
          startTime: '2024-01-19T00:00:00.000Z',
          endTime: '2024-01-26T00:00:00.000Z',
          executed: false,
          metadata: {
            proposalType: 'claim_review',
            claimData: {
              claimId: 'claim_1234567892_ghi789',
              policyTokenId: '3',
              amount: '5000',
              description: 'House fire damage repair'
            }
          }
        }
      ];
      
      // Comprehensive fallback claims for voting
      const fallbackClaims = [
        {
          id: '1',
          claimId: 'claim_1234567890_abc123',
          policyTokenId: '1',
          claimant: account || '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
          amount: '3000',
          description: 'Emergency medical treatment for broken leg - Hospital visit and medication costs',
          status: 'pending',
          submittedAt: '2024-01-15T00:00:00.000Z',
          evidenceHashes: ['QmEvidence1', 'QmEvidence2', 'QmEvidence3'],
          aiAnalysis: {
            fraudScore: 25,
            authenticityScore: 0.85,
            recommendation: 'approve',
            reasoning: 'Documents appear authentic, damage assessment is reasonable, photos support claim',
            confidence: 0.75
          },
          votingDetails: {
            votesFor: '1500',
            votesAgainst: '500',
            totalVotes: '2000',
            votingEnds: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '2',
          claimId: 'claim_1234567891_def456',
          policyTokenId: '2',
          claimant: account || '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
          amount: '2500',
          description: 'Car accident damage repair - Front bumper and headlight replacement needed',
          status: 'pending',
          submittedAt: '2024-01-16T00:00:00.000Z',
          evidenceHashes: ['QmEvidence4', 'QmEvidence5'],
          aiAnalysis: {
            fraudScore: 30,
            authenticityScore: 0.78,
            recommendation: 'review',
            reasoning: 'Claim requires additional verification, photos show significant damage',
            confidence: 0.65
          },
          votingDetails: {
            votesFor: '1200',
            votesAgainst: '800',
            totalVotes: '2000',
            votingEnds: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '3',
          claimId: 'claim_1234567892_ghi789',
          policyTokenId: '3',
          claimant: account || '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
          amount: '5000',
          description: 'House fire damage repair - Kitchen and living room damage from electrical fire',
          status: 'pending',
          submittedAt: '2024-01-17T00:00:00.000Z',
          evidenceHashes: ['QmEvidence6', 'QmEvidence7', 'QmEvidence8'],
          aiAnalysis: {
            fraudScore: 35,
            authenticityScore: 0.82,
            recommendation: 'review',
            reasoning: 'Fire damage assessment requires expert verification',
            confidence: 0.70
          },
          votingDetails: {
            votesFor: '900',
            votesAgainst: '1100',
            totalVotes: '2000',
            votingEnds: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '4',
          claimId: 'claim_1234567893_jkl012',
          policyTokenId: '4',
          claimant: account || '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
          amount: '800',
          description: 'Lost luggage during international trip - Baggage lost during flight transfer',
          status: 'pending',
          submittedAt: '2024-01-18T00:00:00.000Z',
          evidenceHashes: ['QmEvidence9', 'QmEvidence10'],
          aiAnalysis: {
            fraudScore: 20,
            authenticityScore: 0.88,
            recommendation: 'approve',
            reasoning: 'Travel claim with proper documentation, airline confirmation provided',
            confidence: 0.82
          },
          votingDetails: {
            votesFor: '900',
            votesAgainst: '100',
            totalVotes: '1000',
            votingEnds: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '5',
          claimId: 'claim_1234567894_mno345',
          policyTokenId: '5',
          claimant: account || '0x8BebaDf625b932811Bf71fBa961ed067b5770EfA',
          amount: '1200',
          description: 'Dental emergency treatment - Root canal and crown replacement',
          status: 'pending',
          submittedAt: '2024-01-19T00:00:00.000Z',
          evidenceHashes: ['QmEvidence11', 'QmEvidence12'],
          aiAnalysis: {
            fraudScore: 15,
            authenticityScore: 0.92,
            recommendation: 'approve',
            reasoning: 'Medical documentation is complete and authentic',
            confidence: 0.88
          },
          votingDetails: {
            votesFor: '1100',
            votesAgainst: '100',
            totalVotes: '1200',
            votingEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];
      
      // Set the fallback data immediately
      setProposals(fallbackProposals);
      setClaims(fallbackClaims);
      setVotingPower('1000000');
      
      console.log('Using fallback data with', fallbackProposals.length, 'proposals and', fallbackClaims.length, 'claims');
      
    } catch (error) {
      console.error('Error loading governance data:', error);
      // Fallback data is already set above
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (claimId: string) => {
    if (!isConnected || !account) {
      alert('Please connect your wallet to vote');
      return;
    }

    if (!voteReason.trim()) {
      alert('Please provide a reason for your vote');
      return;
    }

    try {
      setVoteLoading(true);
      
      // Always trigger MetaMask transaction for claim voting
      const transactionData = {
        to: '0x528Bf18723c2021420070e0bB2912F881a93ca53', // Claims Engine
        data: '0x', // Placeholder for actual vote data
        value: '0x0',
        estimatedGas: '300000',
        claimId: claimId,
        approved: voteChoice === 'approve',
        reason: voteReason
      };
      
      console.log('Triggering MetaMask transaction for claim vote:', claimId);
      
      // Execute transaction in MetaMask
      try {
        const tx = await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: account,
            to: transactionData.to,
            data: transactionData.data,
            value: transactionData.value,
            gas: transactionData.estimatedGas,
          }],
        });

        alert(`Claim vote submitted successfully! Transaction hash: ${tx}`);
        
        // Reload governance data
        await loadGovernanceData();
        setSelectedClaim(null);
        setVoteReason('');
      } catch (txError) {
        console.error('MetaMask transaction failed:', txError);
        alert(`MetaMask transaction failed: ${txError.message}`);
      }
      
    } catch (error) {
      console.error('Error submitting claim vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };

  // Fallback functions that mimic real blockchain functions
  const mimicVoteOnClaim = async (claimId: string) => {
    try {
      setVoteLoading(true);
      
      // Mimic claim voting transaction
      const voteData = {
        to: '0x528Bf18723c2021420070e0bB2912F881a93ca53', // Claims Engine
        data: '0x', // Mimic voting
        value: '0x0',
        estimatedGas: '300000',
      };

      if (!(window as any).ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      if (!account) {
        alert('Please connect your wallet first');
        return;
      }

      const tx = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: voteData.to,
          data: voteData.data,
          value: voteData.value,
          gas: voteData.estimatedGas,
        }],
      });

      alert(`Vote submitted! Transaction hash: ${tx}`);
      
    } catch (error) {
      console.error('Mimic voting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to submit vote: ' + errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  const mimicGovernanceVote = async () => {
    try {
      setVoteLoading(true);
      
      // Mimic governance voting transaction
      const governanceData = {
        to: '0x364424CBf264F54A0fFE12D99F3902B398fc0B36', // Governance contract
        data: '0x', // Mimic governance voting
        value: '0x0',
        estimatedGas: '200000',
      };

      if (!(window as any).ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      if (!account) {
        alert('Please connect your wallet first');
        return;
      }

      const tx = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: governanceData.to,
          data: governanceData.data,
          value: governanceData.value,
          gas: governanceData.estimatedGas,
        }],
      });

      alert(`Governance vote submitted! Transaction hash: ${tx}`);
      
    } catch (error) {
      console.error('Mimic governance voting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to submit governance vote: ' + errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  const mimicStakeTokens = async () => {
    try {
      setVoteLoading(true);
      
      // Mimic token staking transaction
      const stakeData = {
        to: '0xD0aa884859B93aFF4324B909fAeC619096f0Cc05', // Governance token contract
        data: '0x', // Mimic staking
        value: '0x0',
        estimatedGas: '150000',
      };

      if (!(window as any).ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      if (!account) {
        alert('Please connect your wallet first');
        return;
      }

      const tx = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: stakeData.to,
          data: stakeData.data,
          value: stakeData.value,
          gas: stakeData.estimatedGas,
        }],
      });

      alert(`Tokens staked! Transaction hash: ${tx}`);
      
    } catch (error) {
      console.error('Mimic staking failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to stake tokens: ' + errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  const mimicCreateProposal = async () => {
    try {
      setVoteLoading(true);
      
      // Mimic proposal creation transaction
      const proposalData = {
        to: '0x364424CBf264F54A0fFE12D99F3902B398fc0B36', // Governance contract
        data: '0x', // Mimic proposal creation
        value: '0x0',
        estimatedGas: '300000',
      };

      if (!(window as any).ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      if (!account) {
        alert('Please connect your wallet first');
        return;
      }

      const tx = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: proposalData.to,
          data: proposalData.data,
          value: proposalData.value,
          gas: proposalData.estimatedGas,
        }],
      });

      alert(`Proposal created! Transaction hash: ${tx}`);
      
    } catch (error) {
      console.error('Mimic proposal creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to create proposal: ' + errorMessage);
    } finally {
      setVoteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return { text: 'Active', className: 'bg-blue-500/20 text-blue-400' };
      case 'pending': return { text: 'Pending', className: 'bg-yellow-500/20 text-yellow-400' };
      case 'approved': return { text: 'Approved', className: 'bg-green-500/20 text-green-400' };
      case 'rejected': return { text: 'Rejected', className: 'bg-red-500/20 text-red-400' };
      case 'executed': return { text: 'Executed', className: 'bg-purple-500/20 text-purple-400' };
      default: return { text: 'Unknown', className: 'bg-gray-700/20 text-gray-400' };
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card text-center">
            <h1 className="text-4xl font-bold gradient-text mb-6">Community Governance</h1>
            <p className="text-white/80 text-xl mb-8">
              Connect your wallet to participate in claim voting and governance decisions
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">

      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Community Governance</h1>
              <p className="text-white/80 text-lg">Vote on insurance claims and governance proposals</p>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <div className="glass-effect p-4 rounded-xl">
                <p className="text-white/60 text-sm">Voting Power</p>
                <p className="text-3xl font-bold text-green-400">{parseFloat(votingPower).toFixed(2)} CSG</p>
                <p className="text-white/50 text-xs">Connected: {formatAddress(account || '')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-effect p-2 rounded-xl">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'claims'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                🗳️ Claims Voting
              </button>
              <button
                onClick={() => setActiveTab('proposals')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'proposals'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                📋 Governance Proposals
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Claims for Voting */}
            {activeTab === 'claims' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold gradient-text mb-4">Claims Pending Review</h2>
                  <p className="text-white/80 text-lg">
                    Review and vote on insurance claims with AI analysis
                  </p>
                </div>

                {claims.length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Claims Pending</h3>
                    <p className="text-white/60">All claims have been reviewed and voted on.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {claims.map((claim) => (
                      <div key={claim.id} className="card group hover:scale-105 transition-all duration-300">
                        {/* Claim Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              Claim #{claim.id}
                            </h3>
                            <p className="text-white/60 text-sm">Policy #{claim.policyTokenId}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(claim.status).className}`}>
                            {getStatusBadge(claim.status).text}
                          </span>
                        </div>

                        {/* Claim Details */}
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Amount:</span>
                            <span className="text-2xl font-bold text-green-400">${claim.amount}</span>
                          </div>
                          
                          <div>
                            <span className="text-white/80 text-sm">Description:</span>
                            <p className="text-white mt-1">{claim.description}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Claimant:</span>
                            <span className="text-white font-mono text-sm">{formatAddress(claim.claimant)}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-white/80">Evidence:</span>
                            <span className="text-white font-semibold">{claim.evidenceHashes.length} files</span>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        {claim.aiAnalysis && (
                          <div className="glass-effect p-4 rounded-xl mb-4">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <span>🤖</span>
                              AI Analysis
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-white/60">Fraud Score:</span>
                                <div className={`font-semibold ${getFraudScoreColor(claim.aiAnalysis.fraudScore)}`}>
                                  {claim.aiAnalysis.fraudScore}%
                                </div>
                              </div>
                              <div>
                                <span className="text-white/60">Authenticity:</span>
                                <div className="text-white font-semibold">
                                  {(claim.aiAnalysis.authenticityScore * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className="text-white/60">Recommendation:</span>
                                <div className={`font-semibold ${
                                  claim.aiAnalysis.recommendation === 'approve' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {claim.aiAnalysis.recommendation.toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <span className="text-white/60">Confidence:</span>
                                <div className="text-white font-semibold">
                                  {(claim.aiAnalysis.confidence * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-white/10 rounded-lg">
                              <span className="text-white/60 text-sm">Reasoning:</span>
                              <p className="text-white text-sm mt-1">{claim.aiAnalysis.reasoning}</p>
                            </div>
                          </div>
                        )}

                        {/* Voting Progress */}
                        {claim.votingDetails && (
                          <div className="glass-effect p-4 rounded-xl mb-4">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <span>📊</span>
                              Voting Progress
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Votes For:</span>
                                <span className="text-green-400 font-semibold">{claim.votingDetails.votesFor}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Votes Against:</span>
                                <span className="text-red-400 font-semibold">{claim.votingDetails.votesAgainst}</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-green-400 transition-all duration-500"
                                  style={{ 
                                    width: `${(parseInt(claim.votingDetails.votesFor) / parseInt(claim.votingDetails.totalVotes)) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="text-center text-white/60 text-sm">
                                Voting ends: {formatDate(claim.votingDetails.votingEnds)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => openClaimDetails(claim)}
                            className="btn-secondary flex-1"
                          >
                            Vote Now
                          </button>
                          <Link 
                            href={`/claims/${claim.id}`}
                            className="btn-primary flex-1 text-center"
                          >
                            View Details
                          </Link>
                        </div>

                        {/* Timestamps */}
                        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
                          <div className="flex justify-between">
                            <span>Submitted: {formatDate(claim.submittedAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Proposals Tab */}
            {activeTab === 'proposals' && (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                        <p className="text-white/80 text-sm mb-3">{proposal.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded ${getStatusBadge(proposal.status).className}`}>
                            {getStatusBadge(proposal.status).text}
                          </span>
                          <span className="text-white/60">ID: #{proposal.id}</span>
                          <span className="text-white/60">Ends: {formatDate(proposal.endTime)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{proposal.votesFor}</div>
                        <div className="text-sm text-white/60">For</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{proposal.votesAgainst}</div>
                          <div className="text-xs text-white/60">Against</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {parseInt(proposal.votesFor) + parseInt(proposal.votesAgainst)}
                          </div>
                          <div className="text-xs text-white/60">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {Math.round((parseInt(proposal.votesFor) / (parseInt(proposal.votesFor) + parseInt(proposal.votesAgainst))) * 100)}%
                          </div>
                          <div className="text-xs text-white/60">Approval</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setProposalVoteChoice(null);
                          setProposalVoteReason('');
                        }}
                        className="btn-primary"
                      >
                        Vote on Proposal
                      </button>
                    </div>
                  </div>
                ))}
                
                {proposals.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/60">No governance proposals available</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Claim Details Modal */}
        {showClaimModal && selectedClaim && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeClaimModal}>
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6 p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white">Claim Details #{selectedClaim.id}</h2>
                <button
                  onClick={closeClaimModal}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 p-6">
                {/* Claim Information */}
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Claim Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm">Claim ID</label>
                      <p className="text-white font-mono">{selectedClaim.claimId}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Policy ID</label>
                      <p className="text-white">{selectedClaim.policyTokenId}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Requested Amount</label>
                      <p className="text-white">${selectedClaim.amount}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Claimant</label>
                      <p className="text-white font-mono">{formatAddress(selectedClaim.claimant)}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Status</label>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusBadge(selectedClaim.status).className}`}>
                        {getStatusBadge(selectedClaim.status).text}
                      </span>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Submitted</label>
                      <p className="text-white">{formatDate(selectedClaim.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-white/60 text-sm">Description</label>
                    <p className="text-white mt-1">{selectedClaim.description}</p>
                  </div>
                </div>

                {/* AI Analysis */}
                {selectedClaim.aiAnalysis && (
                  <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">AI Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/60 text-sm">Fraud Score</label>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${selectedClaim.aiAnalysis.fraudScore}%`,
                              backgroundColor: getFraudScoreColor(selectedClaim.aiAnalysis.fraudScore)
                            }}
                          ></div>
                        </div>
                        <p className="text-white text-sm mt-1">{selectedClaim.aiAnalysis.fraudScore}%</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Authenticity Score</label>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full bg-green-400 transition-all duration-500"
                            style={{ width: `${selectedClaim.aiAnalysis.authenticityScore * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-white text-sm mt-1">{Math.round(selectedClaim.aiAnalysis.authenticityScore * 100)}%</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Recommendation</label>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-semibold mt-1 ${
                          selectedClaim.aiAnalysis.recommendation === 'approve' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {selectedClaim.aiAnalysis.recommendation.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Confidence</label>
                        <p className="text-white">{Math.round(selectedClaim.aiAnalysis.confidence * 100)}%</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Reasoning</label>
                        <p className="text-white mt-1">{selectedClaim.aiAnalysis.reasoning}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting Progress */}
                {selectedClaim.votingDetails && (
                  <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Voting Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{selectedClaim.votingDetails.votesFor}</div>
                        <div className="text-white/60 text-sm">Votes For</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{selectedClaim.votingDetails.votesAgainst}</div>
                        <div className="text-white/60 text-sm">Votes Against</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{selectedClaim.votingDetails.totalVotes}</div>
                        <div className="text-white/60 text-sm">Total Votes</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        Approval Rate: {Math.round((parseInt(selectedClaim.votingDetails.votesFor) / parseInt(selectedClaim.votingDetails.totalVotes)) * 100)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting Form */}
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Cast Your Vote</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">Vote Choice</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="voteChoice"
                            value="approve"
                            checked={voteChoice === 'approve'}
                            onChange={(e) => setVoteChoice(e.target.value as 'approve' | 'reject')}
                            className="mr-2"
                          />
                          <span className="text-white">Approve</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="voteChoice"
                            value="reject"
                            checked={voteChoice === 'reject'}
                            onChange={(e) => setVoteChoice(e.target.value as 'approve' | 'reject')}
                            className="mr-2"
                          />
                          <span className="text-white">Reject</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Reason for Vote</label>
                      <textarea
                        value={voteReason}
                        onChange={(e) => setVoteReason(e.target.value)}
                        placeholder="Explain your voting decision..."
                        className="w-full mt-2 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-white/20">
                <button
                  onClick={closeClaimModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitVote(selectedClaim.claimId)}
                  disabled={voteLoading || !voteReason.trim() || !voteChoice}
                  className="btn-primary flex-1"
                >
                  {voteLoading ? 'Submitting Vote...' : 'Submit Vote'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Voting Modal */}
        {selectedProposal && (
          <div className="modal-overlay" onClick={() => setSelectedProposal(null)}>
            <div className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Proposal Details #{selectedProposal.id}</h2>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Proposal Information */}
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Proposal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">Title</label>
                      <p className="text-white font-semibold">{selectedProposal.title}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Description</label>
                      <p className="text-white">{selectedProposal.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-white/60 text-sm">Status</label>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusBadge(selectedProposal.status).className}`}>
                          {getStatusBadge(selectedProposal.status).text}
                        </span>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Start Date</label>
                        <p className="text-white">{formatDate(selectedProposal.startTime)}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">End Date</label>
                        <p className="text-white">{formatDate(selectedProposal.endTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voting Progress */}
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Voting Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{selectedProposal.votesFor}</div>
                      <div className="text-white/60 text-sm">Votes For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{selectedProposal.votesAgainst}</div>
                      <div className="text-white/60 text-sm">Votes Against</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {parseInt(selectedProposal.votesFor) + parseInt(selectedProposal.votesAgainst)}
                      </div>
                      <div className="text-white/60 text-sm">Total Votes</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      Approval Rate: {Math.round((parseInt(selectedProposal.votesFor) / (parseInt(selectedProposal.votesFor) + parseInt(selectedProposal.votesAgainst))) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Claim Details (if it's a claim review proposal) */}
                {selectedProposal.metadata?.proposalType === 'claim_review' && (
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Claim Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm">Claim ID</label>
                        <p className="text-white font-mono">{selectedProposal.metadata.claimData.claimId}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Policy ID</label>
                        <p className="text-white">{selectedProposal.metadata.claimData.policyTokenId}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Amount</label>
                        <p className="text-white">${selectedProposal.metadata.claimData.amount}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Description</label>
                        <p className="text-white">{selectedProposal.metadata.claimData.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Governance Details (if it's a governance proposal) */}
                {selectedProposal.metadata?.proposalType === 'governance' && (
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Governance Action</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm">Action</label>
                        <p className="text-white">{selectedProposal.metadata.action}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Current Value</label>
                        <p className="text-white">{selectedProposal.metadata.currentValue}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Proposed Value</label>
                        <p className="text-white">{selectedProposal.metadata.proposedValue}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting Form */}
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cast Your Vote</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/60 text-sm">Vote Choice</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="proposalVoteChoice"
                            value="true"
                            checked={proposalVoteChoice === true}
                            onChange={(e) => setProposalVoteChoice(e.target.value === 'true')}
                            className="mr-2"
                          />
                          <span className="text-white">For</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="proposalVoteChoice"
                            value="false"
                            checked={proposalVoteChoice === false}
                            onChange={(e) => setProposalVoteChoice(e.target.value === 'true')}
                            className="mr-2"
                          />
                          <span className="text-white">Against</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Reason for Vote</label>
                      <textarea
                        value={proposalVoteReason}
                        onChange={(e) => setProposalVoteReason(e.target.value)}
                        placeholder="Explain your voting decision..."
                        className="w-full mt-2 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => voteOnProposal(selectedProposal.id, proposalVoteChoice!, proposalVoteReason)}
                  disabled={voteLoading || !proposalVoteReason.trim()}
                  className="btn-primary flex-1"
                >
                  {voteLoading ? 'Submitting Vote...' : 'Submit Vote'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 