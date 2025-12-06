import { useState } from 'react';
import { MetricCard } from './MetricCard';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onViewDeal: (dealId: string) => void;
}

export function Portfolio({ onViewDeal }: PortfolioProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'exited'>('active');

  const metrics = [
    { label: 'Total Deployed', value: '$3.4M', change: '14 investments' },
    { label: 'Active Deals', value: '14', change: 'Across 8 sponsors' },
    { label: 'Weighted Avg IRR', value: '19.8%', change: 'Target: 18%+' },
    { label: 'Projected Promote Value', value: '$12.4M', change: 'At exit' },
  ];

  const mockPortfolioDeals = [
    {
      id: '4',
      name: 'Parkside Development',
      sponsor: 'Summit Real Estate',
      commitmentDate: 'Oct 15, 2025',
      gpCommit: '$400K',
      gpOwnership: '40%',
      currentStatus: 'In Construction',
      projectedExit: 'Q4 2028',
    },
    {
      id: '9',
      name: 'Sunset Towers',
      sponsor: 'Atlas Development',
      commitmentDate: 'Sep 8, 2025',
      gpCommit: '$325K',
      gpOwnership: '35%',
      currentStatus: 'Stabilized',
      projectedExit: 'Q2 2028',
    },
    {
      id: '10',
      name: 'Market Street Lofts',
      sponsor: 'Coastal Partners',
      commitmentDate: 'Aug 22, 2025',
      gpCommit: '$375K',
      gpOwnership: '38%',
      currentStatus: 'Lease-Up',
      projectedExit: 'Q3 2028',
    },
    {
      id: '11',
      name: 'Highland Commons',
      sponsor: 'Urban Capital',
      commitmentDate: 'Jul 12, 2025',
      gpCommit: '$285K',
      gpOwnership: '30%',
      currentStatus: 'Stabilized',
      projectedExit: 'Q1 2028',
    },
  ];

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'exited', label: 'Exited' },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="mb-6">Portfolio</h1>

        {/* Tab Navigation */}
        <div className="flex gap-6 mb-8 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Portfolio Table */}
        {activeTab === 'active' && (
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1.2fr_1.2fr] gap-4 px-4 py-3 border-b border-gray-100">
              <div className="text-xs text-gray-500">Deal Name</div>
              <div className="text-xs text-gray-500">Sponsor</div>
              <div className="text-xs text-gray-500">Commitment Date</div>
              <div className="text-xs text-gray-500">GP Commit</div>
              <div className="text-xs text-gray-500">GP Ownership</div>
              <div className="text-xs text-gray-500">Current Status</div>
              <div className="text-xs text-gray-500">Projected Exit</div>
            </div>

            {/* Table Body */}
            <div>
              {mockPortfolioDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1.2fr_1.2fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => onViewDeal(deal.id)}
                >
                  <div className="text-sm text-black flex items-center gap-2">
                    {deal.name}
                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-600">{deal.sponsor}</span>
                  </div>
                  <div className="text-sm text-gray-600">{deal.commitmentDate}</div>
                  <div className="text-sm text-black">{deal.gpCommit}</div>
                  <div className="text-sm text-black">{deal.gpOwnership}</div>
                  <div className="text-sm text-gray-600">{deal.currentStatus}</div>
                  <div className="text-sm text-gray-600">{deal.projectedExit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exited' && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-gray-400 mb-2">No exited deals yet</div>
              <div className="text-sm text-gray-500">Deals will appear here after exit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
