'use client';

import { useState, useEffect, useCallback } from 'react';
import { dealsAPI, operatorsAPI, underwritingAPI } from './api';
import type { Deal, Operator, Underwriting } from './types';

// Types for dashboard data
export interface DashboardMetrics {
  totalDeals: number;
  dealsUnderReview: number;
  activeConversations: number;
  pipelineValue: number;
  capitalDeployed: number;
  dealsPassed: number;
  dealsCommitted: number;
}

export interface MarketData {
  name: string;
  count: number;
  percentage: number;
}

export interface DealFlowData {
  month: string;
  received: number;
  committed: number;
}

export interface RecentDeal {
  id: string;
  name: string;
  sponsor: string;
  market: string;
  gpCommit: string;
  stage: string;
  updated: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentDeals: RecentDeal[];
  marketData: MarketData[];
  dealFlowData: DealFlowData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper: Format currency
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
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
  return date.toLocaleDateString();
}

// Helper: Map backend status to UI stage
function mapStatusToStage(status: string | null): string {
  const mapping: Record<string, string> = {
    'inbox': 'Received',
    'pending': 'Received',
    'screening': 'Received',
    'under_review': 'Under Review',
    'due_diligence': 'Due Diligence',
    'term_sheet': 'Term Sheet',
    'committed': 'Committed',
    'passed': 'Passed',
  };
  return mapping[status || 'pending'] || 'Received';
}

// Helper: Get last 6 months
function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }
  return months;
}

// Compute metrics from deals and underwriting
function computeMetrics(
  deals: Deal[],
  underwritings: Underwriting[]
): DashboardMetrics {
  const underwritingByDealId = new Map(
    underwritings.map(u => [u.deal_id, u])
  );

  // Total deals in pipeline (exclude passed)
  const activeDeals = deals.filter(d => d.status !== 'passed');
  const totalDeals = activeDeals.length;

  // Deals under review
  const dealsUnderReview = deals.filter(d => d.status === 'under_review').length;

  // Active conversations (placeholder: count early-stage deals)
  const activeConversations = deals.filter(d =>
    ['inbox', 'pending', 'screening', 'under_review'].includes(d.status || 'pending')
  ).length;

  // Pipeline value (equity_required for non-committed, non-passed deals)
  const pipelineValue = activeDeals
    .filter(d => d.status !== 'committed')
    .reduce((sum, deal) => {
      const underwriting = underwritingByDealId.get(deal.id);
      return sum + Number(underwriting?.equity_required || 0);
    }, 0);

  // Capital deployed (equity_required for committed deals)
  const committedDeals = deals.filter(d => d.status === 'committed');
  const capitalDeployed = committedDeals.reduce((sum, deal) => {
    const underwriting = underwritingByDealId.get(deal.id);
    return sum + Number(underwriting?.equity_required || 0);
  }, 0);

  // Deals passed
  const dealsPassed = deals.filter(d => d.status === 'passed').length;

  // Deals committed count
  const dealsCommitted = committedDeals.length;

  return {
    totalDeals,
    dealsUnderReview,
    activeConversations,
    pipelineValue,
    capitalDeployed,
    dealsPassed,
    dealsCommitted,
  };
}

// Aggregate deals by market (state)
function aggregateByMarket(deals: Deal[]): MarketData[] {
  const stateCounts = deals.reduce((acc, deal) => {
    const state = deal.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const entries = Object.entries(stateCounts);
  if (entries.length === 0) return [];

  const maxCount = Math.max(...entries.map(([, count]) => count));

  return entries
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / maxCount) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// Aggregate deals by month
function aggregateByMonth(deals: Deal[]): DealFlowData[] {
  const last6Months = getLast6Months();

  return last6Months.map(month => {
    const monthDeals = deals.filter(d => {
      const dealMonth = new Date(d.created_at).toLocaleDateString('en-US', { month: 'short' });
      return dealMonth === month;
    });

    return {
      month,
      received: monthDeals.length,
      committed: monthDeals.filter(d => d.status === 'committed').length,
    };
  });
}

// Transform deals to recent activity format
function transformToRecentDeals(
  deals: Deal[],
  operators: Map<string, Operator>,
  underwritings: Map<string, Underwriting>
): RecentDeal[] {
  return deals
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
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
        gpCommit: formatCurrency(Number(underwriting?.equity_required || 0)),
        stage: mapStatusToStage(deal.status),
        updated: formatRelativeTime(deal.updated_at),
      };
    });
}

// Main hook
export function useDashboardData(): DashboardData {
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
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute derived data
  const metrics = computeMetrics(deals, Array.from(underwritings.values()));
  const recentDeals = transformToRecentDeals(deals, operators, underwritings);
  const marketData = aggregateByMarket(deals);
  const dealFlowData = aggregateByMonth(deals);

  return {
    metrics,
    recentDeals,
    marketData,
    dealFlowData,
    isLoading,
    error,
    refetch: fetchData,
  };
}
