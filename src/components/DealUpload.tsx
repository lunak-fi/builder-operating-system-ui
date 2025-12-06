import { useState } from 'react';
import { Upload, Check, FileText } from 'lucide-react';

export function DealUpload() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
    handleUpload();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload();
    }
  };

  const handleUpload = () => {
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadState('success'), 200);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const extractedData = {
    dealName: 'Riverside Commons',
    sponsor: 'Atlas Development',
    market: 'Charleston, SC',
    strategy: 'Value-Add',
    totalProjectCost: '$45,200,000',
    gpCommitAsk: '$350,000',
    irr: '19.2%',
    equityMultiple: '2.1x',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="mb-8">Upload Deal</h1>

        {uploadState === 'idle' && (
          <div className="max-w-2xl mx-auto mt-20">
            {/* Upload Zone */}
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

        {uploadState === 'uploading' && (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 mx-auto">
                <FileText size={28} className="text-gray-600" />
              </div>
              
              <h2 className="text-2xl text-black mb-3">Uploading...</h2>
              
              <p className="text-sm text-gray-500 mb-8">
                Processing your deal document
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="mt-4 text-sm text-gray-500">{progress}%</div>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="max-w-4xl mx-auto mt-12">
            {/* Success Message */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#D4FF00] flex items-center justify-center">
                <Check size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl text-black">Deal uploaded successfully</h2>
                <p className="text-sm text-gray-500">Here&apos;s what we extracted from your document</p>
              </div>
            </div>

            {/* Extracted Data */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-black mb-4">Deal Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Deal Name</div>
                    <div className="text-sm text-black">{extractedData.dealName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Sponsor</div>
                    <div className="text-sm text-black">{extractedData.sponsor}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Market</div>
                    <div className="text-sm text-black">{extractedData.market}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Strategy</div>
                    <div className="text-sm text-black">{extractedData.strategy}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-black mb-4">Financial Metrics</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gray-50 rounded-lg p-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Project Cost</div>
                    <div className="text-sm text-black">{extractedData.totalProjectCost}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">GP Commit Ask</div>
                    <div className="text-sm text-black">{extractedData.gpCommitAsk}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Projected IRR</div>
                    <div className="text-sm text-black">{extractedData.irr}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Equity Multiple</div>
                    <div className="text-sm text-black">{extractedData.equityMultiple}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="px-6 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors">
                  Create Deal
                </button>
                <button className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Details
                </button>
                <button
                  onClick={() => setUploadState('idle')}
                  className="px-6 py-2.5 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}