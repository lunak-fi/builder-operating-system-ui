'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dealsAPI, operatorsAPI, underwritingAPI, fundsAPI } from './api';
import type { Deal, Operator, Underwriting, Fund } from './types';

// Types for sponsor detail data
export interface SponsorDeal {
  id: string;
  name: string;
  market: string;
  strategy: string;
  totalCost: string;
  gpCommit: string;
  stage: string;
  lastUpdated: string;
}

export interface SponsorFund {
  id: string;
  name: string;
  strategy: string;
  targetIRR: string;
  targetMultiple: string;
  fundSize: string;
  status: string;
}

export interface SponsorDetailData {
  id: string;
  name: string;
  legalName: string | null;
  description: string;
  hqLocation: string;
  website: string | null;
  primaryGeography: string | null;
  primaryAssetType: string | null;
  // Metrics
  dealsSubmitted: number;
  dealsCommitted: number;
  dealsPassed: number;
  totalGPCommit: string;
  // Funds list
  funds: SponsorFund[];
  // Deals list
  deals: SponsorDeal[];
}

export interface UseSponsorDetailResult {
  sponsor: SponsorDetailData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper: Format currency
function formatCurrency(amount: number | string | null | undefined): string {
  const num = Number(amount || 0);
  if (num === 0) return '$0';
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(0)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

// Helper: Format percentage (values stored as decimals, e.g., 0.245 = 24.5%)
function formatPercent(value: number | string | null): string {
  const num = Number(value || 0);
  if (num === 0) return '-';
  return `${(num * 100).toFixed(1)}%`;
}

// Helper: Format multiple
function formatMultiple(value: number | string | null): string {
  const num = Number(value || 0);
  if (num === 0) return '-';
  return `${num.toFixed(2)}x`;
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

// Transform data to sponsor detail format
function transformSponsorData(
  operator: Operator,
  deals: Deal[],
  underwritings: Map<string, Underwriting>,
  funds: Fund[]
): SponsorDetailData {
  // Get deals for this operator
  const operatorDeals = deals.filter(d => d.operator_id === operator.id);

  // Count deals by status
  const dealsSubmitted = operatorDeals.length;
  const dealsCommitted = operatorDeals.filter(d => d.status === 'committed').length;
  const dealsPassed = operatorDeals.filter(d => d.status === 'passed').length;

  // Calculate total GP commit from committed deals
  const totalGPCommit = operatorDeals
    .filter(d => d.status === 'committed')
    .reduce((sum, deal) => {
      const underwriting = underwritings.get(deal.id);
      return sum + Number(underwriting?.equity_required || 0);
    }, 0);

  // Transform deals to display format
  const sponsorDeals: SponsorDeal[] = operatorDeals
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map(deal => {
      const underwriting = underwritings.get(deal.id);
      const marketParts = [deal.msa || deal.submarket, deal.state].filter(Boolean);

      return {
        id: deal.id,
        name: deal.deal_name,
        market: marketParts.join(', ') || 'Unknown',
        strategy: deal.strategy_type || 'N/A',
        totalCost: formatCurrency(underwriting?.total_project_cost),
        gpCommit: formatCurrency(underwriting?.equity_required),
        stage: mapStatusToStage(deal.status),
        lastUpdated: formatRelativeTime(deal.updated_at),
      };
    });

  // Transform funds to display format
  const operatorFunds = funds.filter(f => f.operator_id === operator.id);
  const sponsorFunds: SponsorFund[] = operatorFunds
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(fund => ({
      id: fund.id,
      name: fund.name,
      strategy: fund.strategy || 'N/A',
      targetIRR: formatPercent(fund.target_irr),
      targetMultiple: formatMultiple(fund.target_equity_multiple),
      fundSize: formatCurrency(fund.fund_size),
      status: fund.status,
    }));

  return {
    id: operator.id,
    name: operator.name,
    legalName: operator.legal_name,
    description: operator.description || 'No description available.',
    hqLocation: [operator.hq_city, operator.hq_state].filter(Boolean).join(', ') || 'N/A',
    website: operator.website_url,
    primaryGeography: operator.primary_geography_focus,
    primaryAssetType: operator.primary_asset_type_focus,
    dealsSubmitted,
    dealsCommitted,
    dealsPassed,
    totalGPCommit: formatCurrency(totalGPCommit),
    funds: sponsorFunds,
    deals: sponsorDeals,
  };
}

// Main hook
export function useSponsorDetail(sponsorId: string | null): UseSponsorDetailResult {
  const [sponsor, setSponsor] = useState<SponsorDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!sponsorId) {
      setSponsor(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [operator, deals, underwritings, funds] = await Promise.all([
        operatorsAPI.get(sponsorId),
        dealsAPI.getAll(),
        underwritingAPI.getAll(),
        fundsAPI.getAll(),
      ]);

      const underwritingMap = new Map(underwritings.map(u => [u.deal_id, u]));
      const transformedSponsor = transformSponsorData(operator, deals, underwritingMap, funds);
      setSponsor(transformedSponsor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sponsor details');
      setSponsor(null);
    } finally {
      setIsLoading(false);
    }
  }, [sponsorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sponsor,
    isLoading,
    error,
    refetch: fetchData,
  };
}
