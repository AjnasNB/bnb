import Link from 'next/link';
import { useState } from 'react';

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('proposals');

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
                <Link href="/policies" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Policies
                </Link>
                <Link href="/claims" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Claims
                </Link>
                <Link href="/governance" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
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
                Community Governance
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Participate in community decisions and shape the future of ChainSure
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">5,247</div>
              <div className="text-sm text-gray-600">Total Proposals</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89.3%</div>
              <div className="text-sm text-gray-600">Participation Rate</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12.5M</div>
              <div className="text-sm text-gray-600">Tokens Staked</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹2.3B</div>
              <div className="text-sm text-gray-600">Treasury Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'proposals'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Proposals
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staking'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Token Staking
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Voting History
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Proposal
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {/* Proposal 1 - Active */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Proposal #42: Increase Maximum Coverage Limit
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Proposal to increase the maximum coverage limit from ₹10L to ₹25L for health insurance policies to better serve high-value clients.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Proposed by: @community_leader_42</span>
                    <span>Created: Dec 18, 2024</span>
                    <span>Voting ends: Dec 28, 2024</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Voting Progress</span>
                    <span className="font-medium">67% participation</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">✓ For (73%)</span>
                      <span className="font-medium">2,847,293 CSGT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">✗ Against (27%)</span>
                      <span className="font-medium">1,052,707 CSGT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '27%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Your Voting Power</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Staked Tokens:</span>
                        <span className="font-medium">5,000 CSGT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Voting Weight:</span>
                        <span className="font-medium">0.12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Vote For
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Vote Against
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View Full Proposal Details →
                </button>
              </div>
            </div>

            {/* Proposal 2 - Active */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Proposal #43: Implement Dynamic Premium Pricing
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Introduce AI-driven dynamic pricing based on real-time risk assessment and market conditions to optimize premium fairness.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Proposed by: @tech_innovator_99</span>
                    <span>Created: Dec 20, 2024</span>
                    <span>Voting ends: Dec 30, 2024</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Voting Progress</span>
                    <span className="font-medium">34% participation</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">✓ For (58%)</span>
                      <span className="font-medium">782,400 CSGT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">✗ Against (42%)</span>
                      <span className="font-medium">567,600 CSGT</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">Status: Not Voted</h4>
                    <p className="text-sm text-orange-700">
                      You haven't cast your vote on this proposal yet.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Vote For
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Vote Against
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View Full Proposal Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Staking Overview */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Your Staking Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Balance:</span>
                    <span className="font-medium">12,500 CSGT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currently Staked:</span>
                    <span className="font-medium text-indigo-600">5,000 CSGT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voting Power:</span>
                    <span className="font-medium">0.12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staking Rewards (APY):</span>
                    <span className="font-medium text-green-600">8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unclaimed Rewards:</span>
                    <span className="font-medium text-green-600">42.3 CSGT</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Stake More Tokens
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                    Unstake Tokens
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Claim Rewards
                  </button>
                </div>
              </div>

              {/* Staking Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Staking Actions</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Stake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter amount"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">CSGT</span>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">25%</button>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">50%</button>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">75%</button>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">Max</button>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Staking Benefits</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Earn 8.5% APY in staking rewards</li>
                      <li>• Participate in governance voting</li>
                      <li>• Eligible for jury selection</li>
                      <li>• Priority in claim processing</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Unstaking Period</h4>
                    <p className="text-sm text-yellow-700">
                      Tokens have a 7-day unstaking period for security. You can still vote during this time but won't earn rewards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staking History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Staking History</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dec 20, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Stake</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,000 CSGT</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dec 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rewards Claim</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">35.7 CSGT</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dec 10, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Stake</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,000 CSGT</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Your Voting History</h3>
            
            <div className="space-y-4">
              {/* Vote 1 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Proposal #41: Reduce Minimum Staking Period</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ For
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Voted: Dec 18, 2024 • Weight: 0.12% • Result: Passed (78% approval)
                </div>
                <p className="text-sm text-gray-700">
                  Voted in favor of reducing minimum staking period from 14 days to 7 days to improve liquidity.
                </p>
              </div>

              {/* Vote 2 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Proposal #40: Increase Jury Pool Size</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ✗ Against
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Voted: Dec 12, 2024 • Weight: 0.11% • Result: Failed (42% approval)
                </div>
                <p className="text-sm text-gray-700">
                  Voted against increasing jury pool size due to concerns about coordination costs.
                </p>
              </div>

              {/* Vote 3 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Proposal #39: AI Model Update</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ For
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Voted: Dec 8, 2024 • Weight: 0.11% • Result: Passed (91% approval)
                </div>
                <p className="text-sm text-gray-700">
                  Voted to approve the upgrade to the fraud detection AI model for improved accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Proposal</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter a clear, descriptive title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Category
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select category</option>
                    <option value="coverage">Coverage & Policies</option>
                    <option value="technical">Technical Improvements</option>
                    <option value="governance">Governance Changes</option>
                    <option value="treasury">Treasury Management</option>
                    <option value="risk">Risk Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Description
                  </label>
                  <textarea
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Provide a detailed description of your proposal, including rationale and expected benefits..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Implementation Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe how this proposal should be implemented, including technical requirements and timeline..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voting Duration (days)
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="7">7 days</option>
                      <option value="10">10 days</option>
                      <option value="14">14 days</option>
                      <option value="21">21 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Participation (%)
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="20">20%</option>
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                      <option value="50">50%</option>
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Proposal Requirements</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Minimum 1,000 CSGT staked to create proposals</li>
                    <li>• Your current staked amount: 5,000 CSGT ✓</li>
                    <li>• Proposal fee: 100 CSGT (refunded if proposal passes)</li>
                    <li>• Proposals must receive 5% support to proceed to voting</li>
                  </ul>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I understand the proposal requirements and fees, and confirm this proposal benefits the ChainSure community
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 