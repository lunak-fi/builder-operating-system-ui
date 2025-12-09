'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dealsAPI, operatorsAPI, underwritingAPI } from './api';
import type { Deal, Operator, Underwriting } from './types';

// Types for sponsors data
export interface SponsorData {
  id: string;
  name: string;
  primaryContact: string;
  dealsSubmitted: number;
  dealsCommitted: number;
  totalGPCommit: string;
  geography: string;
  lastActivity: string;
  status: 'Active' | 'Watching' | 'New';
}

export interface SponsorsData {
  sponsors: SponsorData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper: Format currency
function formatCurrency(amount: number): string {
  if (amount === 0) return '$0';
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
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
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Helper: Determine sponsor status based on activity
function determineSponsorStatus(deals: Deal[], operator: Operator): 'Active' | 'Watching' | 'New' {
  if (deals.length === 0) {
    // New sponsor if no deals
    return 'New';
  }

  // Check last activity
  const lastDeal = deals.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0];

  const daysSinceActivity = Math.floor(
    (new Date().getTime() - new Date(lastDeal.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Active if recent activity
  if (daysSinceActivity < 14) {
    return 'Active';
  }

  // Watching if some activity but not recent
  return 'Watching';
}

// Transform operators and deals to sponsor format
function transformToSponsors(
  operators: Operator[],
  deals: Deal[],
  underwritings: Map<string, Underwriting>
): SponsorData[] {
  return operators.map(operator => {
    // Get deals for this operator
    const operatorDeals = deals.filter(d => d.operator_id === operator.id);

    // Count deals by status
    const dealsSubmitted = operatorDeals.length;
    const dealsCommitted = operatorDeals.filter(d => d.status === 'committed').length;

    // Calculate total GP commit from committed deals
    const totalGPCommit = operatorDeals
      .filter(d => d.status === 'committed')
      .reduce((sum, deal) => {
        const underwriting = underwritings.get(deal.id);
        return sum + Number(underwriting?.equity_required || 0);
      }, 0);

    // Get geography from operator or deals
    const geography = operator.primary_geography_focus ||
      operator.hq_state ||
      (operatorDeals[0]?.state) ||
      'N/A';

    // Get last activity from most recent deal
    const lastActivity = operatorDeals.length > 0
      ? formatRelativeTime(
          operatorDeals.sort((a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0].updated_at
        )
      : formatRelativeTime(operator.created_at);

    // Determine status
    const status = determineSponsorStatus(operatorDeals, operator);

    return {
      id: operator.id,
      name: operator.name,
      primaryContact: 'N/A', // We don't have principals loaded here
      dealsSubmitted,
      dealsCommitted,
      totalGPCommit: formatCurrency(totalGPCommit),
      geography,
      lastActivity,
      status,
    };
  }).sort((a, b) => {
    // Sort by deals submitted (most active first)
    return b.dealsSubmitted - a.dealsSubmitted;
  });
}

// Main hook
export function useSponsorsData(): SponsorsData {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [underwritings, setUnderwritings] = useState<Map<string, Underwriting>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [operatorsData, dealsData, underwritingsData] = await Promise.all([
        operatorsAPI.getAll(),
        dealsAPI.getAll(),
        underwritingAPI.getAll(),
      ]);

      setOperators(operatorsData);
      setDeals(dealsData);
      setUnderwritings(new Map(underwritingsData.map(u => [u.deal_id, u])));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sponsors data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform data to sponsors format
  const sponsors = useMemo(
    () => transformToSponsors(operators, deals, underwritings),
    [operators, deals, underwritings]
  );

  return {
    sponsors,
    isLoading,
    error,
    refetch: fetchData,
  };
}
