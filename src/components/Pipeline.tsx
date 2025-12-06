import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { PipelineTable } from './PipelineTable';

interface PipelineProps {
  onViewDeal: (dealId: string) => void;
}

export function Pipeline({ onViewDeal }: PipelineProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'committed' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'committed', label: 'Committed' },
    { id: 'passed', label: 'Passed' },
  ] as const;

  const filters = [
    { label: 'Stage', count: 6 },
    { label: 'Market', count: 12 },
    { label: 'Strategy', count: 4 },
    { label: 'GP Commit Range', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="mb-6">Pipeline</h1>

        {/* Tab Navigation */}
        <div className="flex gap-6 mb-6 border-b border-gray-100">
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

        {/* Search & Filters Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-50 border-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
              </div>

              {/* Filter Pills */}
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {filter.label}
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sort by: Recent
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Pipeline Table */}
        <PipelineTable onViewDeal={onViewDeal} activeTab={activeTab} />
      </div>
    </div>
  );
}
