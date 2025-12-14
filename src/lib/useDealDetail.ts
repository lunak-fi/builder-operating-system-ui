'use client';

import { useState, useEffect, useCallback } from 'react';
import { dealsAPI, operatorsAPI, underwritingAPI, documentsAPI } from './api';
import type { Deal, Operator, Underwriting, Document } from './types';

// Types for deal detail data
export interface DealDetailData {
  name: string;
  stage: string;
  sponsor: string;
  market: string;
  strategy: string;
  gpCommitAsk: string;
  description: string;
  property: {
    units: string;
    sf: string;
    yearBuilt: string;
    address: string;
  };
  businessPlan: string;
  dates: {
    received: string;
    targetClose: string;
  };
  costs: {
    totalProjectCost: string;
    acquisitionPrice: string;
    hardCosts: string;
    softCosts: string;
    loanAmount: string;
  };
  returns: {
    lpEquityRequired: string;
    gpCommit: string;
    projectedIRR: string;
    equityMultiple: string;
  };
  sponsorInfo: {
    id: string;
    name: string;
    description: string;
    hqLocation: string;
    website: string | null;
  };
  documents: {
    id: string;
    name: string;
    size: string;
    date: string;
    type: string;
  }[];
  // Raw data for potential future use
  rawDeal: Deal;
  rawOperator: Operator | null;
  rawUnderwriting: Underwriting | null;
}

export interface UseDealDetailResult {
  deal: DealDetailData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper: Format currency
function formatCurrency(amount: number | string | null | undefined): string {
  const num = Number(amount || 0);
  if (num === 0) return '$0';
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

// Helper: Format percentage (values stored as decimals, e.g., 0.245 = 24.5%)
function formatPercentage(value: number | string | null | undefined): string {
  const num = Number(value || 0);
  if (num === 0) return '0.0%';
  return `${(num * 100).toFixed(1)}%`;
}

// Helper: Format file size
function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

// Helper: Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

// Transform raw data to UI format
function transformDealData(
  deal: Deal,
  operator: Operator | null,
  underwriting: Underwriting | null,
  documents: Document[]
): DealDetailData {
  const marketParts = [deal.msa || deal.submarket, deal.state].filter(Boolean);
  const market = marketParts.join(', ') || 'Unknown';

  return {
    name: deal.deal_name,
    stage: mapStatusToStage(deal.status),
    sponsor: operator?.name || 'Unknown Sponsor',
    market,
    strategy: deal.strategy_type || 'N/A',
    gpCommitAsk: formatCurrency(underwriting?.equity_required),
    description: deal.business_plan_summary || 'No description available.',
    property: {
      units: deal.num_units ? `${deal.num_units} units` : 'N/A',
      sf: deal.building_sf ? `${deal.building_sf.toLocaleString()} SF` : 'N/A',
      yearBuilt: deal.year_built ? String(deal.year_built) : 'N/A',
      address: deal.address_line1 || 'N/A',
    },
    businessPlan: deal.business_plan_summary || 'No business plan summary available.',
    dates: {
      received: formatDate(deal.created_at),
      targetClose: 'TBD', // Not in current schema
    },
    costs: {
      totalProjectCost: formatCurrency(underwriting?.total_project_cost),
      acquisitionPrice: formatCurrency(underwriting?.land_cost), // Using land_cost as proxy
      hardCosts: formatCurrency(underwriting?.hard_cost),
      softCosts: formatCurrency(underwriting?.soft_cost),
      loanAmount: formatCurrency(underwriting?.loan_amount),
    },
    returns: {
      lpEquityRequired: formatCurrency(underwriting?.equity_required),
      gpCommit: formatCurrency(underwriting?.equity_required), // Same field for now
      projectedIRR: formatPercentage(underwriting?.levered_irr),
      equityMultiple: underwriting?.equity_multiple ? `${Number(underwriting.equity_multiple).toFixed(2)}x` : 'N/A',
    },
    sponsorInfo: {
      id: operator?.id || '',
      name: operator?.name || 'Unknown Sponsor',
      description: operator?.description || 'No sponsor information available.',
      hqLocation: [operator?.hq_city, operator?.hq_state].filter(Boolean).join(', ') || 'N/A',
      website: operator?.website_url || null,
    },
    documents: documents.map(doc => ({
      id: doc.id,
      name: doc.file_name,
      size: formatFileSize(doc.file_size),
      date: formatDate(doc.upload_date),
      type: doc.file_type || 'Unknown',
    })),
    rawDeal: deal,
    rawOperator: operator,
    rawUnderwriting: underwriting,
  };
}

// Main hook
export function useDealDetail(dealId: string | null): UseDealDetailResult {
  const [deal, setDeal] = useState<DealDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!dealId) {
      setDeal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [dealData, documents] = await Promise.all([
        dealsAPI.get(dealId),
        documentsAPI.getByDeal(dealId).catch(() => []),
      ]);

      // Fetch related data
      const [underwriting, operator] = await Promise.all([
        underwritingAPI.getByDeal(dealId).catch(() => null),
        dealData.operator_id
          ? operatorsAPI.get(dealData.operator_id).catch(() => null)
          : Promise.resolve(null),
      ]);

      const transformedDeal = transformDealData(dealData, operator, underwriting, documents);
      setDeal(transformedDeal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deal details');
      setDeal(null);
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    deal,
    isLoading,
    error,
    refetch: fetchData,
  };
}
