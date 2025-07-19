'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalPolicies: number;
  activeClaims: number;
  totalStaked: string;
  monthlyPremiums: string;
  claimsProcessed: number;
  fraudDetected: number;
  avgProcessingTime: string;
  customerSatisfaction: number;
  trends: {
    policies: string;
    claims: string;
    fraud: string;
    satisfaction: string;
  };
  recentActivity: Array<{
    type: string;
    amount: string;
    user: string;
    time: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/analytics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChainSure Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your decentralized insurance platform</p>
          <div className="flex space-x-4 mt-4">
            <Link href="/policies/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create New Policy
            </Link>
            <Link href="/claims/submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Submit Claim
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Policies" 
            value={stats?.totalPolicies.toLocaleString() || '0'} 
            trend={stats?.trends.policies}
            icon="📋"
          />
          <MetricCard 
            title="Active Claims" 
            value={stats?.activeClaims.toLocaleString() || '0'} 
            trend={stats?.trends.claims}
            icon="⚡"
          />
          <MetricCard 
            title="Total Staked" 
            value={`$${stats?.totalStaked || '0'}`} 
            trend="+5.2%"
            icon="💰"
          />
          <MetricCard 
            title="Monthly Premiums" 
            value={`$${stats?.monthlyPremiums || '0'}`} 
            trend="+12.5%"
            icon="📈"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Claims Processed" 
            value={stats?.claimsProcessed.toLocaleString() || '0'} 
            trend="+8.3%"
            icon="✅"
          />
          <MetricCard 
            title="Fraud Detected" 
            value={stats?.fraudDetected.toLocaleString() || '0'} 
            trend={stats?.trends.fraud}
            icon="🔍"
          />
          <MetricCard 
            title="Avg Processing Time" 
            value={stats?.avgProcessingTime || '0'} 
            trend="-15%"
            icon="⏱️"
          />
          <MetricCard 
            title="Customer Satisfaction" 
            value={`${stats?.customerSatisfaction || '0'}/5`} 
            trend={stats?.trends.satisfaction}
            icon="⭐"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{getActivityLabel(activity.type)}</p>
                    <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${activity.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/policies" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-medium text-gray-900">View Policies</h4>
                <p className="text-sm text-gray-600">Manage insurance policies</p>
              </Link>
              <Link href="/claims" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-medium text-gray-900">Process Claims</h4>
                <p className="text-sm text-gray-600">Review and process claims</p>
              </Link>
              <Link href="/blockchain" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="text-2xl mb-2">🔗</div>
                <h4 className="font-medium text-gray-900">Blockchain</h4>
                <p className="text-sm text-gray-600">View contract interactions</p>
              </Link>
              <Link href="/governance" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="text-2xl mb-2">🗳️</div>
                <h4 className="font-medium text-gray-900">Governance</h4>
                <p className="text-sm text-gray-600">Participate in voting</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon }: { title: string; value: string; trend?: string; icon: string }) {
  const trendColor = trend?.startsWith('+') ? 'text-green-600' : trend?.startsWith('-') ? 'text-red-600' : 'text-gray-600';
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        {trend && <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

function getActivityLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'policy_created': 'New Policy Created',
    'claim_approved': 'Claim Approved',
    'governance_vote': 'Governance Vote',
    'premium_paid': 'Premium Payment',
    'claim_submitted': 'Claim Submitted',
  };
  return labels[type] || 'Unknown Activity';
} 