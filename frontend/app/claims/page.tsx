import Link from 'next/link';
import { useState } from 'react';

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState('my-claims');

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
                <Link href="/claims" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
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
                Claims Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Submit and track your insurance claims with AI-powered processing
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Submit New Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-claims')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-claims'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Claims
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submit'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Claim
            </button>
            <button
              onClick={() => setActiveTab('jury-claims')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jury-claims'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Jury Voting
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'my-claims' && (
          <div className="space-y-6">
            {/* Claims List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {/* Claim 1 - Approved */}
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Travel Claim #TC-2024-001</div>
                        <div className="text-sm text-gray-500">Flight delay compensation • Policy NFT #1234</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">₹15,000</div>
                        <div className="text-sm text-green-600">Approved & Paid</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Parametric
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Submitted: Dec 15, 2024 • Processed in 2 minutes via oracle verification
                  </div>
                </li>

                {/* Claim 2 - Under Review */}
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Health Claim #HC-2024-045</div>
                        <div className="text-sm text-gray-500">Medical treatment • Policy NFT #5678</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">₹45,000</div>
                        <div className="text-sm text-yellow-600">AI Analysis</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        AI-Assisted
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Submitted: Dec 20, 2024 • AI fraud score: Low (95% confidence) • Est. completion: 2-3 days
                  </div>
                </li>

                {/* Claim 3 - Jury Voting */}
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Vehicle Claim #VC-2024-023</div>
                        <div className="text-sm text-gray-500">Accident damage • Policy NFT #9012</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">₹125,000</div>
                        <div className="text-sm text-purple-600">Jury Deliberation</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Discretionary
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Submitted: Dec 18, 2024 • Jury votes: 8/12 • Time remaining: 3 days 14 hours
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Submit Insurance Claim</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Policy
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Choose your policy NFT</option>
                    <option value="nft-1234">Travel Insurance - NFT #1234</option>
                    <option value="nft-5678">Health Insurance - NFT #5678</option>
                    <option value="nft-9012">Vehicle Insurance - NFT #9012</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                      <input type="radio" name="claim-type" value="parametric" className="sr-only" />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">Parametric</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">Instant oracle verification</span>
                        </span>
                      </span>
                    </label>
                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                      <input type="radio" name="claim-type" value="ai-assisted" className="sr-only" />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">AI-Assisted</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">AI document analysis</span>
                        </span>
                      </span>
                    </label>
                    <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                      <input type="radio" name="claim-type" value="discretionary" className="sr-only" />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">Discretionary</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">Community jury review</span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Amount (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter claim amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe the incident in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload files</span>
                          <input type="file" className="sr-only" multiple />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Document Analysis</h4>
                  <p className="text-sm text-blue-700">
                    Our AI will automatically analyze your documents for fraud detection and faster processing. 
                    Documents are processed securely and never stored permanently.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Processing Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Parametric Claims:</span>
                      <span className="font-medium">2-5 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI-Assisted Claims:</span>
                      <span className="font-medium">2-3 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discretionary Claims:</span>
                      <span className="font-medium">5-7 days</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I certify that all information provided is true and accurate to the best of my knowledge
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
                    Submit Claim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'jury-claims' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Available for Jury Voting</h3>
                <div className="text-sm text-gray-500">
                  Your staked tokens: <span className="font-medium text-indigo-600">5,000 CSGT</span>
                </div>
              </div>

              {/* Jury Claims List */}
              <div className="space-y-4">
                {/* Claim 1 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-900">Health Claim #HC-2024-087</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Value
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Time remaining: <span className="font-medium">2 days 8 hours</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim Amount:</span>
                        <span className="font-medium">₹85,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Fraud Score:</span>
                        <span className="font-medium text-yellow-600">Medium (78%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Required Votes:</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Votes:</span>
                        <span className="font-medium">7/12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approve Votes:</span>
                        <span className="font-medium text-green-600">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reject Votes:</span>
                        <span className="font-medium text-red-600">3</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700 mb-2"><strong>Incident:</strong> Medical treatment for chronic condition</p>
                    <p className="text-sm text-gray-600">AI flagged potential pre-existing condition concerns. Manual review required.</p>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                      Vote Approve
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                      Vote Reject
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Claim 2 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-900">Vehicle Claim #VC-2024-156</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Medium Value
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Time remaining: <span className="font-medium">4 days 2 hours</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim Amount:</span>
                        <span className="font-medium">₹35,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Fraud Score:</span>
                        <span className="font-medium text-green-600">Low (92%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Required Votes:</span>
                        <span className="font-medium">8</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Votes:</span>
                        <span className="font-medium">3/8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approve Votes:</span>
                        <span className="font-medium text-green-600">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reject Votes:</span>
                        <span className="font-medium text-red-600">0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700 mb-2"><strong>Incident:</strong> Minor vehicle damage from hailstorm</p>
                    <p className="text-sm text-gray-600">Weather data confirms hailstorm. Damage assessment matches reported incident.</p>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                      Vote Approve
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                      Vote Reject
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Jury Participation Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Votes Cast This Month:</span>
                    <div className="font-medium text-blue-900">23</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Accuracy Rate:</span>
                    <div className="font-medium text-blue-900">91%</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Rewards Earned:</span>
                    <div className="font-medium text-blue-900">142 CSGT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 