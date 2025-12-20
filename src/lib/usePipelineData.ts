'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dealsAPI, operatorsAPI, underwritingAPI } from './api';
import type { Deal, Operator, Underwriting } from './types';

// Types for pipeline data
export interface PipelineDeal {
  id: string;
  name: string;
  sponsor: string;
  market: string;
  strategy: string;
  totalCost: string;
  equityRequired: string;
  irr: string;
  stage: string;
  daysInStage: number;
  lastUpdated: string;
}

export interface PipelineData {
  deals: PipelineDeal[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper: Format currency
function formatCurrency(amount: number | string | null | undefined): string {
  const num = Number(amount || 0);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
}

// Helper: Format percentage
function formatPercentage(value: number | string | null | undefined): string {
  const num = Number(value || 0);
  // Values are stored as decimals (0.245 = 24.5%), multiply by 100 for display
  return `${(num * 100).toFixed(1)}%`;
}

// Helper: Parse currency string back to number
export function parseCurrencyToNumber(currency: string): number {
  if (!currency || currency === '$0') return 0;

  // Remove $ and any spaces
  const cleaned = currency.replace(/\$|,/g, '').trim();

  // Handle M (millions) and K (thousands)
  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000000;
  }
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }

  // Plain number
  return parseFloat(cleaned) || 0;
}

// Helper: Parse percentage string back to decimal
export function parsePercentageToNumber(percentage: string): number {
  if (!percentage) return 0;

  // Remove % and any spaces
  const cleaned = percentage.replace('%', '').trim();
  const num = parseFloat(cleaned);

  // Convert percentage to decimal (24.5% → 0.245)
  return (num / 100) || 0;
}

// Helper: Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Helper: Calculate days in current stage
function calculateDaysInStage(updatedAt: string): number {
  const date = new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Helper: Map backend status to UI stage
function mapStatusToStage(status: string | null): string {
  const mapping: Record<string, string> = {
    'received': 'Received',
    'inbox': 'Received',
    'pending': 'Received',
    'screening': 'Under Review',
    'under_review': 'Under Review',
    'due_diligence': 'Due Diligence',
    'term_sheet': 'Term Sheet',
    'committed': 'Committed',
    'passed': 'Passed',
  };
  return mapping[status || 'pending'] || 'Received';
}

// Transform deals to pipeline format
function transformToPipelineDeals(
  deals: Deal[],
  operators: Map<string, Operator>,
  underwritings: Map<string, Underwriting>
): PipelineDeal[] {
  return deals
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map(deal => {
      const operator = operators.get(deal.operator_id);
      const underwriting = underwritings.get(deal.id);

      const marketParts = [deal.msa || deal.submarket, deal.state].filter(Boolean);
      const market = marketParts.join(', ') || 'Unknown';

      return {
        id: deal.id,
        name: deal.deal_name,
        sponsor: operator?.name || 'Unknown Sponsor',
        market,
        strategy: deal.strategy_type || 'N/A',
        totalCost: formatCurrency(underwriting?.total_project_cost),
        equityRequired: formatCurrency(underwriting?.equity_required),
        irr: formatPercentage(underwriting?.levered_irr),
        stage: mapStatusToStage(deal.status),
        daysInStage: calculateDaysInStage(deal.updated_at),
        lastUpdated: formatRelativeTime(deal.updated_at),
      };
    });
}

// Main hook
export function usePipelineData(): PipelineData {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [operators, setOperators] = useState<Map<string, Operator>>(new Map());
  const [underwritings, setUnderwritings] = useState<Map<string, Underwriting>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [dealsData, operatorsData, underwritingsData] = await Promise.all([
        dealsAPI.getAll(),
        operatorsAPI.getAll(),
        underwritingAPI.getAll(),
      ]);

      setDeals(dealsData);
      setOperators(new Map(operatorsData.map(o => [o.id, o])));
      setUnderwritings(new Map(underwritingsData.map(u => [u.deal_id, u])));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pipeline data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform deals to pipeline format
  const pipelineDeals = useMemo(
    () => transformToPipelineDeals(deals, operators, underwritings),
    [deals, operators, underwritings]
  );

  return {
    deals: pipelineDeals,
    isLoading,
    error,
    refetch: fetchData,
  };
}
