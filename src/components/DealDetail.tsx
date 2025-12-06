import { useState } from 'react';
import { ChevronLeft, ArrowRight, X, Edit } from 'lucide-react';

interface DealDetailProps {
  dealId: string | null;
  onBack: () => void;
}

const mockDealDetails = {
  '1': {
    name: 'Riverside Commons',
    stage: 'Due Diligence',
    sponsor: 'Atlas Development',
    market: 'Charleston, SC',
    strategy: 'Value-Add',
    gpCommitAsk: '$350K',
    description: 'A 245-unit multifamily community located in the rapidly growing Charleston metro area. The property features modern amenities and is positioned for significant value creation through strategic renovations and operational improvements.',
    property: {
      units: '245 units',
      sf: '225,000 SF',
      yearBuilt: '2008',
    },
    businessPlan: 'Execute a comprehensive interior and exterior renovation program over 24 months. Upgrade common areas, fitness center, and pool. Implement smart home technology and premium finishes in units to achieve market-leading rental rates.',
    investmentThesis: 'Charleston continues to experience strong population and job growth, with limited new supply in this submarket. Property is well-located near major employment centers and has significant upside potential through tactical value-add improvements.',
    dates: {
      received: 'Dec 1, 2025',
      targetClose: 'Jan 15, 2026',
    },
    costs: {
      totalProjectCost: '$45,200,000',
      acquisitionPrice: '$38,500,000',
      hardCosts: '$4,200,000',
      softCosts: '$2,500,000',
      loanAmount: '$31,000,000',
    },
    returns: {
      lpEquityRequired: '$14,200,000',
      gpCommit: '$350,000',
      gpOwnershipPercent: '35%',
      projectedIRR: '19.2%',
      equityMultiple: '2.1x',
      promoteHurdle: '15% IRR',
    },
    ourReturns: {
      lpReturn: '$735,000',
      projectedPromoteValue: '$1,250,000',
      blendedReturn: '28.4% IRR',
    },
    sponsorInfo: {
      name: 'Atlas Development',
      founded: '2008',
      aum: '$2.1B',
      projects: '45+',
      track: 'Atlas Development is a leading commercial real estate development firm specializing in value-add multifamily acquisitions across the Southeast. With over $2B in assets under management and a track record of 45+ successful projects, the firm focuses on identifying underperforming properties in high-growth markets.',
    },
    documents: [
      { name: 'Investment Summary.pdf', size: '2.4 MB', date: 'Dec 1, 2025' },
      { name: 'Financial Model.xlsx', size: '1.8 MB', date: 'Dec 1, 2025' },
      { name: 'Market Analysis.pdf', size: '5.2 MB', date: 'Dec 2, 2025' },
    ],
    notes: [
      { date: 'Dec 3, 2025', author: 'You', text: 'Strong sponsorship team with excellent track record in Charleston market. Returns look compelling vs. hurdle rate.' },
      { date: 'Dec 2, 2025', author: 'You', text: 'Initial call scheduled with sponsor for Dec 5th to discuss business plan and market positioning.' },
    ],
  },
};

export function DealDetail({ dealId, onBack }: DealDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'sponsor' | 'documents' | 'notes'>('financials');
  const [noteText, setNoteText] = useState('');
  
  const deal = dealId ? mockDealDetails[dealId as keyof typeof mockDealDetails] : mockDealDetails['1'];

  if (!deal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Deal not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'sponsor', label: 'Sponsor' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' },
  ] as const;

  const stageColors: Record<string, string> = {
    'Received': 'bg-gray-200 text-gray-700',
    'Under Review': 'bg-blue-100 text-blue-700',
    'Due Diligence': 'bg-yellow-100 text-yellow-700',
    'Term Sheet': 'bg-orange-100 text-orange-700',
    'Committed': 'bg-green-100 text-green-700',
    'Passed': 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Pipeline
        </button>

        {/* Deal Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-3">{deal.name}</h1>
              <span className={`text-xs px-3 py-1.5 rounded-full ${stageColors[deal.stage]}`}>
                {deal.stage}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors">
                Move to Next Stage
                <ArrowRight size={16} />
              </button>
              <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Pass
              </button>
              <button className="p-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit size={16} />
              </button>
            </div>
          </div>

          {/* Key Deal Info Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">Sponsor</div>
              <button className="text-sm text-black hover:underline">{deal.sponsor}</button>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">Market</div>
              <div className="text-sm text-black">{deal.market}</div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">Strategy</div>
              <div className="text-sm text-black">{deal.strategy}</div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">GP Commit Ask</div>
              <div className="text-sm text-black">{deal.gpCommitAsk}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 mb-8 border-b border-gray-100">
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
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h3 className="mb-4">Property Details</h3>
              <div className="grid grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Units</div>
                  <div className="text-sm text-black">{deal.property.units}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Square Feet</div>
                  <div className="text-sm text-black">{deal.property.sf}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Year Built</div>
                  <div className="text-sm text-black">{deal.property.yearBuilt}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4">Business Plan</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-6">
                {deal.businessPlan}
              </p>
            </div>

            <div>
              <h3 className="mb-4">Investment Thesis</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-6">
                {deal.investmentThesis}
              </p>
            </div>

            <div>
              <h3 className="mb-4">Key Dates</h3>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Received</div>
                  <div className="text-sm text-black">{deal.dates.received}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Target Close</div>
                  <div className="text-sm text-black">{deal.dates.targetClose}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="max-w-5xl">
            <div className="grid grid-cols-2 gap-8 mb-12">
              {/* Project Costs */}
              <div>
                <h3 className="mb-6">Project Costs</h3>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Total Project Cost</div>
                    <div className="text-3xl text-black">{deal.costs.totalProjectCost}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Acquisition Price</div>
                    <div className="text-xl text-black">{deal.costs.acquisitionPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Hard Costs</div>
                    <div className="text-xl text-black">{deal.costs.hardCosts}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Soft Costs</div>
                    <div className="text-xl text-black">{deal.costs.softCosts}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Loan Amount</div>
                    <div className="text-xl text-black">{deal.costs.loanAmount}</div>
                  </div>
                </div>
              </div>

              {/* Returns */}
              <div>
                <h3 className="mb-6">Projected Returns</h3>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Projected IRR (Levered)</div>
                    <div className="text-3xl text-black">{deal.returns.projectedIRR}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">LP Equity Required</div>
                    <div className="text-xl text-black">{deal.returns.lpEquityRequired}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">GP Commit (Our Investment)</div>
                    <div className="text-xl text-black">{deal.returns.gpCommit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">GP Ownership % (Our Promote Share)</div>
                    <div className="text-xl text-black">{deal.returns.gpOwnershipPercent}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Equity Multiple</div>
                    <div className="text-xl text-black">{deal.returns.equityMultiple}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Promote Hurdle</div>
                    <div className="text-xl text-black">{deal.returns.promoteHurdle}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Returns Analysis */}
            <div className="bg-[#D4FF00] bg-opacity-10 border border-[#D4FF00] border-opacity-30 rounded-lg p-8">
              <h3 className="mb-6">Our Returns Analysis</h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-xs text-gray-500 mb-2">LP Return (from equity)</div>
                  <div className="text-2xl text-black">{deal.ourReturns.lpReturn}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Projected Promote Value</div>
                  <div className="text-2xl text-black">{deal.ourReturns.projectedPromoteValue}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Blended Return (LP + Promote)</div>
                  <div className="text-2xl text-black">{deal.ourReturns.blendedReturn}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sponsor' && (
          <div className="max-w-3xl">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div>
                  <h3 className="mb-2">{deal.sponsorInfo.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {deal.sponsorInfo.track}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Founded</div>
                  <div className="text-sm text-black">{deal.sponsorInfo.founded}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">AUM</div>
                  <div className="text-sm text-black">{deal.sponsorInfo.aum}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Projects</div>
                  <div className="text-sm text-black">{deal.sponsorInfo.projects}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="text-sm text-gray-600 hover:text-black transition-colors">
                  View full sponsor profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="max-w-3xl">
            <div className="space-y-3">
              {deal.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-600">PDF</span>
                    </div>
                    <div>
                      <div className="text-sm text-black">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.size} • {doc.date}</div>
                    </div>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="max-w-3xl">
            {/* Add Note */}
            <div className="mb-8">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add internal note..."
                className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <button className="px-4 py-2 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors">
                  Add Note
                </button>
              </div>
            </div>

            {/* Notes Timeline */}
            <div className="space-y-4">
              {deal.notes.map((note, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                      <span className="text-sm text-black">{note.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
