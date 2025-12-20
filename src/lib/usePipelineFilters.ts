'use client';

import { useState, useMemo } from 'react';
import type { PipelineDeal } from './usePipelineData';
import type { SortOption } from '@/components/SortDropdown';

export interface FilterState {
  stages: string[];
  markets: string[];
  strategies: string[];
  equityRanges: string[];
  sortBy: SortOption;
}

export interface PipelineFiltersResult {
  // State
  filters: FilterState;

  // Available options (extracted from deals)
  availableStages: string[];
  availableMarkets: string[];
  availableStrategies: string[];

  // Setters
  setStageFilter: (stages: string[]) => void;
  setMarketFilter: (markets: string[]) => void;
  setStrategyFilter: (strategies: string[]) => void;
  setEquityRangeFilter: (ranges: string[]) => void;
  setSortBy: (sort: SortOption) => void;

  // Reset
  clearAllFilters: () => void;

  // Computed
  activeFilterCount: number;
}

export function usePipelineFilters(deals: PipelineDeal[]): PipelineFiltersResult {
  const [stages, setStages] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [equityRanges, setEquityRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Extract unique values from deals
  const availableStages = useMemo(() => {
    const stageSet = new Set(deals.map((d) => d.stage));
    return Array.from(stageSet).sort();
  }, [deals]);

  const availableMarkets = useMemo(() => {
    const marketSet = new Set(deals.map((d) => d.market));
    return Array.from(marketSet).sort();
  }, [deals]);

  const availableStrategies = useMemo(() => {
    const strategySet = new Set(deals.map((d) => d.strategy));
    return Array.from(strategySet).sort();
  }, [deals]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return stages.length + markets.length + strategies.length + equityRanges.length;
  }, [stages, markets, strategies, equityRanges]);

  // Clear all filters
  const clearAllFilters = () => {
    setStages([]);
    setMarkets([]);
    setStrategies([]);
    setEquityRanges([]);
    setSortBy('recent');
  };

  return {
    filters: {
      stages,
      markets,
      strategies,
      equityRanges,
      sortBy,
    },
    availableStages,
    availableMarkets,
    availableStrategies,
    setStageFilter: setStages,
    setMarketFilter: setMarkets,
    setStrategyFilter: setStrategies,
    setEquityRangeFilter: setEquityRanges,
    setSortBy,
    clearAllFilters,
    activeFilterCount,
  };
}
