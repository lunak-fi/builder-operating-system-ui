'use client';

import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { PipelineTable } from './PipelineTable';
import { usePipelineData, parseCurrencyToNumber, parsePercentageToNumber } from '@/lib/usePipelineData';
import { usePipelineFilters } from '@/lib/usePipelineFilters';
import { MultiSelectFilter } from './MultiSelectFilter';
import { EquityRangeFilter, EQUITY_RANGES } from './EquityRangeFilter';
import { SortDropdown } from './SortDropdown';
import type { SortOption } from './SortDropdown';
import type { PipelineDeal } from '@/lib/usePipelineData';

interface PipelineProps {
  onViewDeal: (dealId: string) => void;
}

export function Pipeline({ onViewDeal }: PipelineProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'committed' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { deals, isLoading, error, refetch } = usePipelineData();

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'committed', label: 'Committed' },
    { id: 'passed', label: 'Passed' },
  ] as const;

  // Initialize filters hook
  const {
    filters,
    availableStages,
    availableMarkets,
    availableStrategies,
    setStageFilter,
    setMarketFilter,
    setStrategyFilter,
    setEquityRangeFilter,
    setSortBy,
  } = usePipelineFilters(deals);

  // Helper: Sort deals based on selected option
  const sortDeals = (dealsToSort: PipelineDeal[], sortBy: SortOption): PipelineDeal[] => {
    const sorted = [...dealsToSort];

    switch (sortBy) {
      case 'recent':
        // Already sorted by default in usePipelineData
        return sorted;

      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'irr-desc':
        return sorted.sort((a, b) => {
          const irrA = parsePercentageToNumber(a.irr);
          const irrB = parsePercentageToNumber(b.irr);
          return irrB - irrA; // Descending
        });

      default:
        return sorted;
    }
  };

  // Filter and sort deals based on all active filters
  const filteredAndSortedDeals = useMemo(() => {
    let result = deals;

    // 1. Filter by tab
    if (activeTab === 'active') {
      result = result.filter(deal => !['Committed', 'Passed'].includes(deal.stage));
    } else if (activeTab === 'committed') {
      result = result.filter(deal => deal.stage === 'Committed');
    } else if (activeTab === 'passed') {
      result = result.filter(deal => deal.stage === 'Passed');
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal =>
        deal.name.toLowerCase().includes(query) ||
        deal.sponsor.toLowerCase().includes(query) ||
        deal.market.toLowerCase().includes(query)
      );
    }

    // 3. Filter by stage
    if (filters.stages.length > 0) {
      result = result.filter(deal => filters.stages.includes(deal.stage));
    }

    // 4. Filter by market
    if (filters.markets.length > 0) {
      result = result.filter(deal => filters.markets.includes(deal.market));
    }

    // 5. Filter by strategy
    if (filters.strategies.length > 0) {
      result = result.filter(deal => filters.strategies.includes(deal.strategy));
    }

    // 6. Filter by equity range
    if (filters.equityRanges.length > 0) {
      result = result.filter(deal => {
        const equity = parseCurrencyToNumber(deal.equityRequired);
        return filters.equityRanges.some(rangeLabel => {
          const range = EQUITY_RANGES.find(r => r.label === rangeLabel);
          if (!range) return false;
          return equity >= range.min && equity < range.max;
        });
      });
    }

    // 7. Sort
    return sortDeals(result, filters.sortBy);
  }, [deals, activeTab, searchQuery, filters]);

  // Calculate tab counts
  const tabCounts = useMemo(() => ({
    all: deals.length,
    active: deals.filter(d => !['Committed', 'Passed'].includes(d.stage)).length,
    committed: deals.filter(d => d.stage === 'Committed').length,
    passed: deals.filter(d => d.stage === 'Passed').length,
  }), [deals]);

  // Calculate dynamic filter counts based on currently filtered data (after tab + search)
  const tabAndSearchFilteredDeals = useMemo(() => {
    let result = deals;

    // Filter by tab
    if (activeTab === 'active') {
      result = result.filter(deal => !['Committed', 'Passed'].includes(deal.stage));
    } else if (activeTab === 'committed') {
      result = result.filter(deal => deal.stage === 'Committed');
    } else if (activeTab === 'passed') {
      result = result.filter(deal => deal.stage === 'Passed');
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal =>
        deal.name.toLowerCase().includes(query) ||
        deal.sponsor.toLowerCase().includes(query) ||
        deal.market.toLowerCase().includes(query)
      );
    }

    return result;
  }, [deals, activeTab, searchQuery]);

  const filterCounts = useMemo(() => {
    const stageSet = new Set(tabAndSearchFilteredDeals.map(d => d.stage));
    const marketSet = new Set(tabAndSearchFilteredDeals.map(d => d.market));
    const strategySet = new Set(tabAndSearchFilteredDeals.map(d => d.strategy));
    const equityCount = tabAndSearchFilteredDeals.filter(d =>
      parseCurrencyToNumber(d.equityRequired) > 0
    ).length;

    return {
      stage: stageSet.size,
      market: marketSet.size,
      strategy: strategySet.size,
      equity: equityCount,
    };
  }, [tabAndSearchFilteredDeals]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="mb-6">Pipeline</h1>

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
              {!isLoading && (
                <span className="ml-1.5 text-gray-400">({tabCounts[tab.id]})</span>
              )}
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
              <MultiSelectFilter
                label="Stage"
                options={availableStages}
                selectedValues={filters.stages}
                onChange={setStageFilter}
                count={filterCounts.stage}
              />
              <MultiSelectFilter
                label="Market"
                options={availableMarkets}
                selectedValues={filters.markets}
                onChange={setMarketFilter}
                count={filterCounts.market}
              />
              <MultiSelectFilter
                label="Strategy"
                options={availableStrategies}
                selectedValues={filters.strategies}
                onChange={setStrategyFilter}
                count={filterCounts.strategy}
              />
              <EquityRangeFilter
                selectedRanges={filters.equityRanges}
                onChange={setEquityRangeFilter}
                count={filterCounts.equity}
              />
            </div>

            {/* Sort Dropdown */}
            <SortDropdown value={filters.sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Pipeline Table */}
        <PipelineTable
          onViewDeal={onViewDeal}
          deals={filteredAndSortedDeals}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
