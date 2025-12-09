'use client';

import { ChevronDown, Plus, RefreshCw } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { RecentActivityTable } from './RecentActivityTable';
import { MarketChart } from './MarketChart';
import { DealFlowChart } from './DealFlowChart';
import { useDashboardData } from '@/lib/useDashboardData';

interface DashboardProps {
  onViewDeal: (dealId: string) => void;
  onNavigate: (page: 'upload') => void;
}

// Helper to format currency for display
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

export function Dashboard({ onViewDeal, onNavigate }: DashboardProps) {
  const { metrics, recentDeals, marketData, dealFlowData, isLoading, error, refetch } = useDashboardData();

  const metricsRow1 = [
    { label: 'Total Deals in Pipeline', value: String(metrics.totalDeals), change: 'Active deals' },
    { label: 'Deals Under Review', value: String(metrics.dealsUnderReview), change: 'In diligence' },
    { label: 'Active Conversations', value: String(metrics.activeConversations), change: '', hasIndicator: true },
  ];

  const metricsRow2 = [
    { label: 'Pipeline Value', value: formatCurrency(metrics.pipelineValue), change: 'Potential GP commits' },
    { label: 'Capital Deployed', value: formatCurrency(metrics.capitalDeployed), change: `${metrics.dealsCommitted} committed deals` },
    { label: 'Deals Passed', value: String(metrics.dealsPassed), change: 'Total passed' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <h1>Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Last 30 days
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors"
            >
              <Plus size={16} />
              Upload Deal
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center gap-2 text-red-600 text-sm hover:text-red-800 transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Summary Metrics - Row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {metricsRow1.map((metric) => (
            <MetricCard key={metric.label} {...metric} isLoading={isLoading} />
          ))}
        </div>

        {/* Summary Metrics - Row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {metricsRow2.map((metric) => (
            <MetricCard key={metric.label} {...metric} isLoading={isLoading} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <MarketChart markets={marketData} isLoading={isLoading} />
          <DealFlowChart months={dealFlowData} isLoading={isLoading} />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Pipeline Activity</h3>
          </div>
          <RecentActivityTable
            onViewDeal={onViewDeal}
            deals={recentDeals}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
