'use client';

import { useState } from 'react';
import { ChevronLeft, ArrowRight, Edit, RefreshCw, FileText, Download } from 'lucide-react';
import { useDealDetail } from '@/lib/useDealDetail';

interface DealDetailProps {
  dealId: string | null;
  onBack: () => void;
}

const stageColors: Record<string, string> = {
  'Received': 'bg-gray-200 text-gray-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  'Due Diligence': 'bg-yellow-100 text-yellow-700',
  'Term Sheet': 'bg-orange-100 text-orange-700',
  'Committed': 'bg-green-100 text-green-700',
  'Passed': 'bg-purple-100 text-purple-700',
};

export function DealDetail({ dealId, onBack }: DealDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'sponsor' | 'documents' | 'notes'>('overview');
  const [noteText, setNoteText] = useState('');
  const { deal, isLoading, error, refetch } = useDealDetail(dealId);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'sponsor', label: 'Sponsor' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' },
  ] as const;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Pipeline
          </button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Pipeline
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!deal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Deal not found</p>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            ← Back to Pipeline
          </button>
        </div>
      </div>
    );
  }

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
              <span className={`text-xs px-3 py-1.5 rounded-full ${stageColors[deal.stage] || stageColors['Received']}`}>
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
              <div className="text-xs text-gray-500 mb-1">Equity Required</div>
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
              {tab.id === 'documents' && deal.documents.length > 0 && (
                <span className="ml-1.5 text-gray-400">({deal.documents.length})</span>
              )}
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
              <div className="grid grid-cols-4 gap-6 bg-gray-50 rounded-lg p-6">
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
                <div>
                  <div className="text-xs text-gray-500 mb-1">Address</div>
                  <div className="text-sm text-black">{deal.property.address}</div>
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
                    <div className="text-xs text-gray-500 mb-2">Acquisition/Land Cost</div>
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
                    <div className="text-xs text-gray-500 mb-2">Equity Required</div>
                    <div className="text-xl text-black">{deal.returns.gpCommit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Equity Multiple</div>
                    <div className="text-xl text-black">{deal.returns.equityMultiple}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sponsor' && (
          <div className="max-w-3xl">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
                  {deal.sponsorInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">{deal.sponsorInfo.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {deal.sponsorInfo.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Headquarters</div>
                  <div className="text-sm text-black">{deal.sponsorInfo.hqLocation}</div>
                </div>
                {deal.sponsorInfo.website && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Website</div>
                    <a
                      href={deal.sponsorInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {deal.sponsorInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="max-w-3xl">
            {deal.documents.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileText size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deal.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-600 uppercase">
                          {doc.type.split('/').pop()?.slice(0, 3) || 'DOC'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-black">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size} • {doc.date}</div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
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

            {/* Notes placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">No notes yet. Add your first note above.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
