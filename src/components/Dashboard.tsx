import { ChevronDown, Plus } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { RecentActivityTable } from './RecentActivityTable';
import { MarketChart } from './MarketChart';
import { DealFlowChart } from './DealFlowChart';

interface DashboardProps {
  onViewDeal: (dealId: string) => void;
  onNavigate: (page: 'upload') => void;
}

export function Dashboard({ onViewDeal, onNavigate }: DashboardProps) {
  const metricsRow1 = [
    { label: 'Total Deals in Pipeline', value: '24', change: '+4 this month' },
    { label: 'Deals Under Review', value: '8', change: 'Active diligence' },
    { label: 'Active Conversations', value: '12', change: '', hasIndicator: true },
  ];

  const metricsRow2 = [
    { label: 'Pipeline Value', value: '$8.2M', change: 'Potential GP commits' },
    { label: 'Capital Deployed', value: '$3.4M', change: '14 committed deals' },
    { label: 'Deals Passed', value: '6', change: 'this month' },
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

        {/* Summary Metrics - Row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {metricsRow1.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Summary Metrics - Row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {metricsRow2.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <MarketChart />
          <DealFlowChart />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Pipeline Activity</h3>
          </div>
          <RecentActivityTable onViewDeal={onViewDeal} />
        </div>
      </div>
    </div>
  );
}
