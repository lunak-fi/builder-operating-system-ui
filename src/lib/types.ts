// API Response Types matching FastAPI backend

export interface Deal {
  id: string;
  deal_name: string;
  internal_code: string | null;
  operator_id: string;
  country: string | null;
  state: string | null;
  msa: string | null;
  submarket: string | null;
  address_line1: string | null;
  postal_code: string | null;
  asset_type: string | null;
  strategy_type: string | null;
  num_units: number | null;
  building_sf: number | null;
  year_built: number | null;
  business_plan_summary: string | null;
  hold_period_years: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Operator {
  id: string;
  name: string;
  legal_name: string | null;
  website_url: string | null;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  primary_geography_focus: string | null;
  primary_asset_type_focus: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Underwriting {
  id: string;
  deal_id: string;
  total_project_cost: number | null;
  land_cost: number | null;
  hard_cost: number | null;
  soft_cost: number | null;
  loan_amount: number | null;
  equity_required: number | null;
  interest_rate: number | null;
  ltv: number | null;
  ltc: number | null;
  dscr_at_stabilization: number | null;
  levered_irr: number | null;
  unlevered_irr: number | null;
  equity_multiple: number | null;
  avg_cash_on_cash: number | null;
  exit_cap_rate: number | null;
  yield_on_cost: number | null;
  project_duration_years: number | null;
  details_json: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Principal {
  id: string;
  operator_id: string;
  full_name: string;
  headline: string | null;
  linkedin_url: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  background_summary: string | null;
  years_experience: number | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  deal_id: string | null;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  upload_date: string;
  extracted_text: string | null;
  extraction_status: string | null;
  extraction_completed_at: string | null;
}

// Combined response types
export interface DealWithDetails extends Deal {
  operator?: Operator;
  underwriting?: Underwriting;
  principals?: Principal[];
  documents?: Document[];
}

// API request types
export interface UploadDocumentRequest {
  file: File;
  deal_id?: string;
}
