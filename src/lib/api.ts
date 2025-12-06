import type { Deal, DealWithDetails, Operator, Underwriting, Document } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for fetch with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Deals API
export const dealsAPI = {
  // Get all deals
  getAll: async (filters?: {
    skip?: number;
    limit?: number;
    operator_id?: string;
    status?: string;
    asset_type?: string;
    state?: string;
  }): Promise<Deal[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<Deal[]>(`/api/deals/${query}`);
  },

  // Get single deal
  get: async (dealId: string): Promise<Deal> => {
    return fetchAPI<Deal>(`/api/deals/${dealId}`);
  },

  // Create deal
  create: async (dealData: Partial<Deal>): Promise<Deal> => {
    return fetchAPI<Deal>('/api/deals/', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  },

  // Update deal
  update: async (dealId: string, dealData: Partial<Deal>): Promise<Deal> => {
    return fetchAPI<Deal>(`/api/deals/${dealId}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  },

  // Delete deal
  delete: async (dealId: string): Promise<void> => {
    return fetchAPI<void>(`/api/deals/${dealId}`, {
      method: 'DELETE',
    });
  },
};

// Operators API
export const operatorsAPI = {
  getAll: async (): Promise<Operator[]> => {
    return fetchAPI<Operator[]>('/api/operators/');
  },

  get: async (operatorId: string): Promise<Operator> => {
    return fetchAPI<Operator>(`/api/operators/${operatorId}`);
  },

  create: async (operatorData: Partial<Operator>): Promise<Operator> => {
    return fetchAPI<Operator>('/api/operators/', {
      method: 'POST',
      body: JSON.stringify(operatorData),
    });
  },

  update: async (operatorId: string, operatorData: Partial<Operator>): Promise<Operator> => {
    return fetchAPI<Operator>(`/api/operators/${operatorId}`, {
      method: 'PUT',
      body: JSON.stringify(operatorData),
    });
  },
};

// Underwriting API
export const underwritingAPI = {
  getByDeal: async (dealId: string): Promise<Underwriting> => {
    return fetchAPI<Underwriting>(`/api/underwriting/deal/${dealId}/`);
  },

  getAll: async (): Promise<Underwriting[]> => {
    return fetchAPI<Underwriting[]>('/api/underwriting/');
  },

  create: async (underwritingData: Partial<Underwriting>): Promise<Underwriting> => {
    return fetchAPI<Underwriting>('/api/underwriting/', {
      method: 'POST',
      body: JSON.stringify(underwritingData),
    });
  },

  update: async (underwritingId: string, underwritingData: Partial<Underwriting>): Promise<Underwriting> => {
    return fetchAPI<Underwriting>(`/api/underwriting/${underwritingId}`, {
      method: 'PUT',
      body: JSON.stringify(underwritingData),
    });
  },
};

// Documents API
export const documentsAPI = {
  upload: async (file: File, dealId?: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    if (dealId) {
      formData.append('deal_id', dealId);
    }

    const url = `${API_BASE_URL}/api/documents/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || `Upload error: ${response.status}`);
    }

    return response.json();
  },

  getByDeal: async (dealId: string): Promise<Document[]> => {
    return fetchAPI<Document[]>(`/api/documents/deal/${dealId}`);
  },

  extract: async (documentId: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI<{ success: boolean; message: string }>(`/api/documents/${documentId}/extract`, {
      method: 'POST',
    });
  },
};

// Composite API calls (combining multiple endpoints)
export const compositeAPI = {
  // Get deal with all related data
  getDealWithDetails: async (dealId: string): Promise<DealWithDetails> => {
    const [deal, underwriting] = await Promise.all([
      dealsAPI.get(dealId),
      underwritingAPI.getByDeal(dealId).catch(() => null),
    ]);

    let operator;
    if (deal.operator_id) {
      operator = await operatorsAPI.get(deal.operator_id).catch(() => undefined);
    }

    return {
      ...deal,
      operator,
      underwriting: underwriting || undefined,
    };
  },

  // Get dashboard summary stats
  getDashboardStats: async () => {
    const deals = await dealsAPI.getAll();
    const underwritings = await underwritingAPI.getAll();

    const totalDeals = deals.length;
    const totalCapital = underwritings.reduce((sum, u) => sum + (u.total_project_cost || 0), 0);
    const avgIRR = underwritings.filter(u => u.levered_irr).reduce((sum, u) => sum + (u.levered_irr || 0), 0) /
                   underwritings.filter(u => u.levered_irr).length || 0;

    return {
      totalDeals,
      totalCapital,
      avgIRR,
      deals,
      underwritings,
    };
  },
};

// Export everything
export default {
  deals: dealsAPI,
  operators: operatorsAPI,
  underwriting: underwritingAPI,
  documents: documentsAPI,
  composite: compositeAPI,
};
