'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { documentsAPI } from '@/lib/api';
import type { ExtractionResponse } from '@/lib/types';

type UploadState = 'idle' | 'uploading' | 'processing' | 'extracting' | 'success' | 'error';

export function DealUpload() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [extractionResult, setExtractionResult] = useState<ExtractionResponse | null>(null);

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number | undefined) => {
    if (!value) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatMultiple = (value: number | undefined) => {
    if (!value) return 'N/A';
    return `${value.toFixed(2)}x`;
  };

  const pollForCompletion = useCallback(async (documentId: string): Promise<void> => {
    const maxAttempts = 60; // 2 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await documentsAPI.getStatus(documentId);

      if (status.parsing_status === 'completed') {
        return;
      }

      if (status.parsing_status === 'failed') {
        throw new Error(status.parsing_error || 'Document parsing failed');
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Document processing timed out');
  }, []);

  const handleUpload = async (file: File) => {
    setFileName(file.name);
    setErrorMessage('');
    setExtractionResult(null);

    try {
      // Step 1: Upload the file
      setUploadState('uploading');
      const uploadResponse = await documentsAPI.upload(file);
      const documentId = uploadResponse.id;

      // Step 2: Poll for parsing completion
      setUploadState('processing');
      await pollForCompletion(documentId);

      // Step 3: Extract data using AI
      setUploadState('extracting');
      const extractionResponse = await documentsAPI.extract(documentId);

      if (!extractionResponse.success) {
        throw new Error('Extraction failed');
      }

      setExtractionResult(extractionResponse);
      setUploadState('success');

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadState('error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleUpload(file);
    } else {
      setErrorMessage('Please upload a PDF file');
      setUploadState('error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleViewResult = () => {
    if (extractionResult?.classification === 'fund' && extractionResult?.populated_records.fund_id) {
      router.push(`/funds/${extractionResult.populated_records.fund_id}`);
    } else if (extractionResult?.populated_records.deal_id) {
      router.push(`/deals/${extractionResult.populated_records.deal_id}`);
    }
  };

  const handleReset = () => {
    setUploadState('idle');
    setFileName('');
    setErrorMessage('');
    setExtractionResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <h1 className="mb-8">Upload Deal</h1>

        {/* Idle State - Drop Zone */}
        {uploadState === 'idle' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-colors ${
                isDragging
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <Upload size={28} className="text-gray-400" />
                </div>

                <h2 className="text-2xl text-black mb-3">Upload Deal</h2>

                <p className="text-sm text-gray-500 mb-6">
                  Drop pitch deck PDF here, or click to browse
                </p>

                <button className="px-6 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors">
                  Choose file
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              Supported format: PDF (max 25MB)
            </div>
          </div>
        )}

        {/* Uploading State */}
        {uploadState === 'uploading' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 mx-auto">
                <Loader2 size={28} className="text-gray-600 animate-spin" />
              </div>

              <h2 className="text-2xl text-black mb-3">Uploading...</h2>

              <p className="text-sm text-gray-500">
                Uploading {fileName}
              </p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {uploadState === 'processing' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 mx-auto">
                <FileText size={28} className="text-gray-600" />
              </div>

              <h2 className="text-2xl text-black mb-3">Processing PDF...</h2>

              <p className="text-sm text-gray-500 mb-6">
                Extracting text from your document
              </p>

              <div className="flex justify-center">
                <Loader2 size={24} className="text-gray-400 animate-spin" />
              </div>
            </div>
          </div>
        )}

        {/* Extracting State */}
        {uploadState === 'extracting' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 mx-auto">
                <FileText size={28} className="text-gray-600" />
              </div>

              <h2 className="text-2xl text-black mb-3">Analyzing with AI...</h2>

              <p className="text-sm text-gray-500 mb-6">
                Extracting deal information from your document
              </p>

              <div className="flex justify-center">
                <Loader2 size={24} className="text-gray-400 animate-spin" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {uploadState === 'error' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-red-50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 mx-auto">
                <AlertCircle size={28} className="text-red-500" />
              </div>

              <h2 className="text-2xl text-black mb-3">Upload Failed</h2>

              <p className="text-sm text-red-600 mb-6">
                {errorMessage}
              </p>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {uploadState === 'success' && extractionResult && (
          <div className="max-w-4xl mx-auto mt-12">
            {/* Success Message */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#D4FF00] flex items-center justify-center">
                <Check size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl text-black">
                  {extractionResult.classification === 'fund' ? 'Fund created successfully' : 'Deal created successfully'}
                </h2>
                <p className="text-sm text-gray-500">Here&apos;s what we extracted from your document</p>
              </div>
            </div>

            {/* Extracted Data - Deal */}
            {extractionResult.classification === 'deal' && extractionResult.extracted_data.deal && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-black mb-4">Deal Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Deal Name</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.deal.deal_name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sponsor</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.operator.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Market</div>
                      <div className="text-sm text-black">
                        {extractionResult.extracted_data.deal.msa || extractionResult.extracted_data.deal.state || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Strategy</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.deal.strategy_type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Asset Type</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.deal.asset_type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Units / SF</div>
                      <div className="text-sm text-black">
                        {extractionResult.extracted_data.deal.num_units
                          ? `${extractionResult.extracted_data.deal.num_units} units`
                          : extractionResult.extracted_data.deal.building_sf
                            ? `${extractionResult.extracted_data.deal.building_sf.toLocaleString()} SF`
                            : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4">Financial Metrics</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Project Cost</div>
                      <div className="text-sm text-black">
                        {formatCurrency(extractionResult.extracted_data.underwriting?.total_project_cost)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Equity Required</div>
                      <div className="text-sm text-black">
                        {formatCurrency(extractionResult.extracted_data.underwriting?.equity_required)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Projected IRR</div>
                      <div className="text-sm text-black">
                        {formatPercent(extractionResult.extracted_data.underwriting?.levered_irr)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Equity Multiple</div>
                      <div className="text-sm text-black">
                        {formatMultiple(extractionResult.extracted_data.underwriting?.equity_multiple)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Extracted Data - Fund */}
            {extractionResult.classification === 'fund' && extractionResult.extracted_data.fund && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-black mb-4">Fund Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fund Name</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.fund.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sponsor</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.operator.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Strategy</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.fund.strategy || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target Geography</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.fund.target_geography || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target Asset Types</div>
                      <div className="text-sm text-black">{extractionResult.extracted_data.fund.target_asset_types || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fund Size</div>
                      <div className="text-sm text-black">{formatCurrency(extractionResult.extracted_data.fund.fund_size)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-black mb-4">Target Metrics</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target IRR</div>
                      <div className="text-sm text-black">
                        {formatPercent(extractionResult.extracted_data.fund.target_irr)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target Equity Multiple</div>
                      <div className="text-sm text-black">
                        {formatMultiple(extractionResult.extracted_data.fund.target_equity_multiple)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Preferred Return</div>
                      <div className="text-sm text-black">
                        {formatPercent(extractionResult.extracted_data.fund.preferred_return)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">GP Commitment</div>
                      <div className="text-sm text-black">
                        {formatCurrency(extractionResult.extracted_data.fund.gp_commitment)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleViewResult}
                className="px-6 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors"
              >
                {extractionResult.classification === 'fund' ? 'View Fund' : 'View Deal'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
