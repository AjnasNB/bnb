'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PolicyType {
  id: string;
  name: string;
  basePremium: number;
  description: string;
}

interface ContractAddresses {
  stablecoin: string;
  governanceToken: string;
  policyNFT: string;
}

export default function CreatePolicy() {
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>([]);
  const [contractAddresses, setContractAddresses] = useState<ContractAddresses | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    coverageAmount: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    specificDetails: {} as any,
  });
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchPolicyTypes();
    fetchContractAddresses();
  }, []);

  const fetchPolicyTypes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/policies/types/available');
      if (!response.ok) throw new Error('Failed to fetch policy types');
      const data = await response.json();
      setPolicyTypes(data.types || []);
    } catch (err) {
      console.error('Error fetching policy types:', err);
    }
  };

  const fetchContractAddresses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/blockchain/contract-addresses');
      if (!response.ok) throw new Error('Failed to fetch contract addresses');
      const data = await response.json();
      setContractAddresses(data);
    } catch (err) {
      console.error('Error fetching contract addresses:', err);
    }
  };

  const getQuote = async () => {
    if (!formData.type || !formData.coverageAmount) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/policies/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          coverageAmount: formData.coverageAmount,
          ...formData.specificDetails,
        }),
      });
      const data = await response.json();
      setQuote(data.quote);
    } catch (error) {
      console.error('Failed to get quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quote: quote,
          contractAddress: contractAddresses?.policyNFT,
        }),
      });
      
      if (response.ok) {
        alert('Policy created successfully! You can now connect your wallet to mint the NFT.');
        window.location.href = '/dashboard';
      } else {
        throw new Error('Failed to create policy');
      }
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPolicyType = policyTypes.find(type => type.id === formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Policy</h1>
          <p className="text-gray-600">Secure your future with blockchain-powered insurance</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Policy Type</span>
            <span>Coverage Details</span>
            <span>Personal Info</span>
            <span>Review & Create</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Policy Type Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Policy Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policyTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === type.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  >
                    <div className="text-2xl mb-3">{getPolicyIcon(type.id)}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-gray-600 mb-3">{type.description}</p>
                    <p className="text-sm text-gray-500">Base Premium: ${type.basePremium}/month</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.type}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Coverage Details */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Coverage Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverageAmount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter coverage amount"
                    min="1000"
                    max="1000000"
                  />
                </div>

                {/* Policy-specific fields */}
                {formData.type === 'health' && (
                  <HealthSpecificFields 
                    data={formData.specificDetails}
                    onChange={(data) => setFormData(prev => ({ ...prev, specificDetails: data }))}
                  />
                )}
                {formData.type === 'vehicle' && (
                  <VehicleSpecificFields 
                    data={formData.specificDetails}
                    onChange={(data) => setFormData(prev => ({ ...prev, specificDetails: data }))}
                  />
                )}
                {formData.type === 'travel' && (
                  <TravelSpecificFields 
                    data={formData.specificDetails}
                    onChange={(data) => setFormData(prev => ({ ...prev, specificDetails: data }))}
                  />
                )}

                {/* Quote Display */}
                {formData.coverageAmount && (
                  <div className="mt-6">
                    <button
                      onClick={getQuote}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Getting Quote...' : 'Get Quote'}
                    </button>
                    {quote && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-900">Quote Details</h4>
                        <p className="text-green-700">Monthly Premium: ${quote.premiumAmount}</p>
                        <p className="text-green-700">Coverage: ${quote.coverageAmount}</p>
                        <p className="text-sm text-green-600">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.coverageAmount || !quote}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!formData.personalInfo.firstName || !formData.personalInfo.lastName || !formData.personalInfo.email}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review and Create */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Your Policy</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Policy Type</p>
                      <p className="font-medium">{selectedPolicyType?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coverage Amount</p>
                      <p className="font-medium">${formData.coverageAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Premium</p>
                      <p className="font-medium text-green-600">${quote?.premiumAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Policy Holder</p>
                      <p className="font-medium">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                    </div>
                  </div>
                </div>

                {contractAddresses && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Blockchain Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-blue-700">Network:</span> BSC Testnet</p>
                      <p><span className="text-blue-700">Policy NFT Contract:</span> {contractAddresses.policyNFT}</p>
                      <p><span className="text-blue-700">Stablecoin Contract:</span> {contractAddresses.stablecoin}</p>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Next Steps</h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Click "Create Policy" to submit your application</li>
                    <li>2. Connect your wallet to mint the policy NFT</li>
                    <li>3. Pay the first premium using stablecoins</li>
                    <li>4. Your policy will be active immediately</li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={createPolicy}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Creating Policy...' : 'Create Policy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Policy-specific components
function HealthSpecificFields({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Health Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={data.age || ''}
            onChange={(e) => onChange({ ...data, age: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pre-existing Conditions</label>
          <select
            value={data.preExisting || 'none'}
            onChange={(e) => onChange({ ...data, preExisting: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">None</option>
            <option value="diabetes">Diabetes</option>
            <option value="hypertension">Hypertension</option>
            <option value="heart_disease">Heart Disease</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function VehicleSpecificFields({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
          <input
            type="text"
            value={data.make || ''}
            onChange={(e) => onChange({ ...data, make: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <input
            type="text"
            value={data.model || ''}
            onChange={(e) => onChange({ ...data, model: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <input
            type="number"
            value={data.year || ''}
            onChange={(e) => onChange({ ...data, year: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function TravelSpecificFields({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Travel Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <input
            type="text"
            value={data.destination || ''}
            onChange={(e) => onChange({ ...data, destination: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
          <input
            type="number"
            value={data.duration || ''}
            onChange={(e) => onChange({ ...data, duration: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function getPolicyIcon(type: string): string {
  const icons: { [key: string]: string } = {
    health: '🏥',
    vehicle: '🚗',
    travel: '✈️',
    pet: '🐕',
    product_warranty: '📱',
    agricultural: '🌾'
  };
  return icons[type] || '📋';
} 