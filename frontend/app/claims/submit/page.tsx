'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Policy {
  id: string;
  type: string;
  status: string;
  coverageAmount: string;
  nftTokenId: string;
}

export default function SubmitClaim() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [formData, setFormData] = useState({
    policyId: '',
    claimType: '',
    requestedAmount: '',
    description: '',
    incidentDate: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  const fetchUserPolicies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/user123/policies');
      if (!response.ok) throw new Error('Failed to fetch policies');
      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (err) {
      console.error('Error fetching policies:', err);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeWithAI = async () => {
    if (documents.length === 0 && images.length === 0) {
      alert('Please upload at least one document or image before analyzing.');
      return;
    }

    setLoading(true);
    try {
      const analysisResults = [];

      // Process documents
      for (const doc of documents) {
        const formData = new FormData();
        formData.append('file', doc);
        formData.append('document_type', getDocumentType(formData.claimType));

        const response = await fetch('http://localhost:3000/api/v1/ai/process-document', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          analysisResults.push({
            type: 'document',
            filename: doc.name,
            ...result,
          });
        }
      }

      // Process images
      for (const img of images) {
        const formData = new FormData();
        formData.append('file', img);
        formData.append('analysis_type', 'damage_assessment');

        const response = await fetch('http://localhost:3000/api/v1/ai/analyze-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          analysisResults.push({
            type: 'image',
            filename: img.name,
            ...result,
          });
        }
      }

      // Advanced Gemini analysis if we have text extracted
      const extractedTexts = analysisResults
        .filter(r => r.type === 'document' && r.extracted_text)
        .map(r => r.extracted_text)
        .join('\n\n');

      if (extractedTexts) {
        const geminiResponse = await fetch('http://localhost:3000/api/v1/ai/gemini-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_text: extractedTexts,
            claim_type: formData.claimType,
          }),
        });

        if (geminiResponse.ok) {
          const geminiResult = await geminiResponse.json();
          analysisResults.push({
            type: 'advanced_analysis',
            filename: 'Gemini Analysis',
            ...geminiResult,
          });
        }
      }

      setAiAnalysis(analysisResults);
      setStep(3);
    } catch (error) {
      console.error('AI analysis error:', error);
      alert('Failed to analyze with AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          documents: documents.map(doc => doc.name),
          images: images.map(img => img.name),
          aiAnalysis: aiAnalysis,
        }),
      });
      
      if (response.ok) {
        alert('Claim submitted successfully! You will receive updates on the processing status.');
        window.location.href = '/dashboard';
      } else {
        throw new Error('Failed to submit claim');
      }
    } catch (error) {
      console.error('Failed to submit claim:', error);
      alert('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPolicy = policies.find(p => p.id === formData.policyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-green-600 hover:text-green-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Insurance Claim</h1>
          <p className="text-gray-600">AI-powered claim processing with real-time analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Claim Details</span>
            <span>Upload Evidence</span>
            <span>AI Analysis</span>
            <span>Submit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Claim Details */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Claim Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Policy</label>
                  <select
                    value={formData.policyId}
                    onChange={(e) => setFormData(prev => ({ ...prev, policyId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a policy</option>
                    {policies.map((policy) => (
                      <option key={policy.id} value={policy.id}>
                        {getClaimTypeIcon(policy.type)} {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} - 
                        Coverage: ${policy.coverageAmount} (NFT #{policy.nftTokenId})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPolicy && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Selected Policy Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Type:</span> {selectedPolicy.type}
                      </div>
                      <div>
                        <span className="text-blue-700">Coverage:</span> ${selectedPolicy.coverageAmount}
                      </div>
                      <div>
                        <span className="text-blue-700">Status:</span> {selectedPolicy.status}
                      </div>
                      <div>
                        <span className="text-blue-700">NFT Token ID:</span> #{selectedPolicy.nftTokenId}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
                  <select
                    value={formData.claimType}
                    onChange={(e) => setFormData(prev => ({ ...prev, claimType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select claim type</option>
                    <option value="health">Health Claim</option>
                    <option value="vehicle">Vehicle Claim</option>
                    <option value="travel">Travel Claim</option>
                    <option value="pet">Pet Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount ($)</label>
                  <input
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedAmount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter claim amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Describe the incident and circumstances..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.policyId || !formData.claimType || !formData.requestedAmount || !formData.description}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Evidence */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Evidence</h2>
              
              {/* Document Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Supporting Documents</h4>
                    <p className="text-gray-600 mb-4">Medical bills, receipts, reports, etc. (PDF, JPG, PNG)</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                      Choose Documents
                    </label>
                  </div>
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents:</h4>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="mr-2">📄</span>
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <button
                            onClick={() => removeDocument(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos/Images</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📸</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Evidence Photos</h4>
                    <p className="text-gray-600 mb-4">Damage photos, medical images, etc. (JPG, PNG)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
                      Choose Images
                    </label>
                  </div>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{img.name}</p>
                        </div>
                      ))}
                    </div>
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
                  onClick={analyzeWithAI}
                  disabled={documents.length === 0 && images.length === 0}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing with AI...' : 'Analyze with AI'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Analysis Results */}
          {step === 3 && aiAnalysis && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Analysis Results</h2>
              
              <div className="space-y-6">
                {/* Overall Assessment */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Assessment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{(aiAnalysis.confidence * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{(aiAnalysis.fraudScore * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Fraud Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">${aiAnalysis.estimatedAmount}</div>
                      <div className="text-sm text-gray-600">AI Estimate</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getRecommendationColor(aiAnalysis.recommendation)}`}>
                        {aiAnalysis.recommendation.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">Recommendation</div>
                    </div>
                  </div>
                </div>

                {/* Document Analysis */}
                {aiAnalysis.documents.length > 0 && (
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Analysis</h3>
                    <div className="space-y-4">
                      {aiAnalysis.documents.map((doc: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">{doc.filename}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Confidence:</span> {(doc.confidence * 100).toFixed(1)}%
                            </div>
                            <div>
                              <span className="text-gray-600">Type:</span> {doc.document_type}
                            </div>
                          </div>
                          {doc.text && (
                            <div className="mt-2">
                              <span className="text-gray-600">Extracted Text:</span>
                              <p className="text-sm text-gray-800 mt-1 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                                {doc.text.substring(0, 200)}...
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Analysis */}
                {aiAnalysis.images.length > 0 && (
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiAnalysis.images.map((img: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">{img.filename}</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Authenticity:</span> {(img.authenticity_score * 100).toFixed(1)}%
                            </div>
                            <div>
                              <span className="text-gray-600">Quality:</span> {img.image_quality || 'Good'}
                            </div>
                            {img.damage_assessment && (
                              <div>
                                <span className="text-gray-600">Damage:</span> {img.damage_assessment}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues and Recommendations */}
                {aiAnalysis.detectedIssues && aiAnalysis.detectedIssues.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">Detected Issues</h3>
                    <ul className="space-y-2">
                      {aiAnalysis.detectedIssues.map((issue: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2">⚠️</span>
                          <span className="text-yellow-700 text-sm">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Continue to Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Submission */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review and Submit</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Policy</p>
                      <p className="font-medium">{selectedPolicy?.type} - ${selectedPolicy?.coverageAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Claim Type</p>
                      <p className="font-medium">{formData.claimType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested Amount</p>
                      <p className="font-medium">${formData.requestedAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">AI Recommendation</p>
                      <p className={`font-medium ${getRecommendationColor(aiAnalysis?.recommendation || 'review')}`}>
                        {aiAnalysis?.recommendation?.toUpperCase() || 'REVIEW'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h3>
                  <ol className="space-y-2 text-sm text-blue-800">
                    <li>1. Your claim will be submitted to the blockchain</li>
                    <li>2. AI analysis results will be stored immutably</li>
                    <li>3. Community jury may review if needed</li>
                    <li>4. You'll receive updates via notifications</li>
                    <li>5. Approved claims are paid automatically</li>
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
                  onClick={submitClaim}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Submitting Claim...' : 'Submit Claim'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getClaimTypeIcon(type: string): string {
  const icons: { [key: string]: string } = {
    health: '🏥',
    vehicle: '🚗',
    travel: '✈️',
    pet: '🐕',
  };
  return icons[type] || '📋';
}

function getDocumentType(claimType: string): string {
  const types: { [key: string]: string } = {
    health: 'medical_bill',
    vehicle: 'vehicle_estimate',
    travel: 'travel_receipt',
    pet: 'veterinary_bill',
  };
  return types[claimType] || 'general';
}

function getRecommendationColor(recommendation: string): string {
  const colors: { [key: string]: string } = {
    approve: 'text-green-600',
    reject: 'text-red-600',
    review: 'text-yellow-600',
  };
  return colors[recommendation] || 'text-gray-600';
} 