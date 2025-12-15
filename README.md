# Builder Operating System - Frontend

A Next.js-based dashboard for managing real estate investment deals and funds.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # For local development
# NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app  # For production backend
```

## Document Upload & Processing Flow

### Overview
The system automatically processes uploaded deal and fund documents using Claude AI to extract structured data.

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. USER UPLOADS DOCUMENT                                                │
│    - Upload page: Click "Upload Deal"                                   │
│    - Select PDF file (deal deck or fund deck)                          │
│    - Document sent to backend                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND: RECEIVE & STORE                                             │
│    - POST /api/documents/upload                                         │
│    - Save PDF to storage                                                │
│    - Extract text using pdfplumber                                      │
│    - Create document record (status: "pending")                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. DOCUMENT CLASSIFICATION (Claude AI)                                  │
│    - Analyze first 3000 chars of document                               │
│    - Prompt: "Is this a deal deck or fund deck?"                        │
│    - Model: claude-sonnet-4-20250514                                    │
│    - Output: "deal" or "fund"                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
        ┌───────────────────────┐   ┌───────────────────────┐
        │ DEAL DECK PATH        │   │ FUND DECK PATH        │
        └───────────────────────┘   └───────────────────────┘
                        │                       │
                        ▼                       ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│ 4A. DEAL EXTRACTION             │ │ 4B. FUND EXTRACTION             │
│                                 │ │                                 │
│ Extract from full document:     │ │ Extract from full document:     │
│ • Deal name                     │ │ • Fund name                     │
│ • Sponsor/Operator              │ │ • Sponsor/Manager               │
│ • Location (city, state, MSA)   │ │ • Fund size                     │
│ • Asset type & strategy         │ │ • Target IRR                    │
│ • Units/SF                      │ │ • Target multiple               │
│ • Business plan summary         │ │ • Strategy (SFR, multifamily)   │
│                                 │ │ • Target geography              │
│ ────────────────────────────── │ │ • GP commitment                 │
│ FINANCIALS (Underwriting):      │ │ • Management fee                │
│ • Total project cost            │ │ • Carried interest              │
│ • Land/Hard/Soft costs          │ │ • Preferred return              │
│ • Loan amount                   │ │ • Status (fundraising/closed)   │
│ • Equity required               │ │                                 │
│ • Interest rate, LTV, LTC       │ │                                 │
│ • Levered/Unlevered IRR         │ │                                 │
│ • Equity multiple               │ │                                 │
│ • Exit cap rate                 │ │                                 │
└─────────────────────────────────┘ └─────────────────────────────────┘
                        │                       │
                        ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. CREATE DATABASE RECORDS                                              │
│                                                                          │
│ DEAL PATH:                          FUND PATH:                          │
│ • Create/Update Operator            • Create/Update Operator            │
│ • Create Deal record                • Create Fund record                │
│ • Create DealDocument record        • Create FundDocument record        │
│ • Create DealUnderwriting record    • Link to existing/new deals        │
│ • Set status: "received"            • Set status per extraction         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND DISPLAY                                                     │
│                                                                          │
│ DEALS:                              FUNDS:                              │
│ • Dashboard: metrics update         • Funds page: new fund card         │
│ • Pipeline: new deal row            • Fund detail: all metrics          │
│ • Deal detail page:                 • Linked deals shown                │
│   - Overview tab (basics)           • Sponsor page: fund cards          │
│   - Financials tab (underwriting)   │                                   │
│   - Sponsor tab (operator info)     │                                   │
│   - Documents tab (uploaded PDF)    │                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Points

**Automatic Classification:**
- No manual selection needed
- Claude analyzes document structure and content
- Determines if it's a deal or fund based on language patterns

**Deal vs Fund Distinction:**
- **Deal Deck**: Single property/project investment opportunity
- **Fund Deck**: Portfolio/vehicle that invests in multiple deals

**Data Storage:**
- Percentages stored as decimals (0.245 = 24.5%)
- Frontend multiplies by 100 for display
- All financial values in actual dollars (not millions)

**Error Handling:**
- If extraction fails, document stays in "pending" status
- Logs show detailed error information
- Can re-trigger extraction via API

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **API**: REST (FastAPI backend)
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx           # Dashboard (/)
│   ├── pipeline/          # Deal pipeline view
│   ├── funds/             # Funds list & detail
│   ├── sponsors/          # Sponsors list & detail
│   ├── portfolio/         # Portfolio view
│   └── upload/            # Document upload
├── components/            # React components
│   ├── Dashboard.tsx
│   ├── Pipeline.tsx
│   ├── DealDetail.tsx
│   ├── FundDetail.tsx
│   └── ...
└── lib/
    ├── api.ts            # API client functions
    ├── types.ts          # TypeScript interfaces
    ├── useDealDetail.ts  # Custom hooks
    └── ...
```

## Available Pages

- **/** - Dashboard with key metrics
- **/pipeline** - Deal pipeline table
- **/deals/[id]** - Individual deal details
- **/funds** - Funds list
- **/funds/[id]** - Fund details with linked deals
- **/sponsors** - Sponsors list
- **/sponsors/[id]** - Sponsor details with deals and funds
- **/portfolio** - Portfolio overview
- **/upload** - Document upload interface

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Deployed to Vercel with automatic deployments from the `master` branch.

**Environment Variables in Vercel:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (Railway)

## Backend Integration

See the backend repository for:
- API documentation
- Database schema
- LLM extraction prompts
- Deployment configuration
