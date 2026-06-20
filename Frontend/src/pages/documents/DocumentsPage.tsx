import React, { useEffect, useState, useMemo } from 'react';
import { documentService, Document } from '../../services/documentService';
import { DocumentList } from '../../components/documents/DocumentList';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { DocumentViewer } from '../../components/documents/DocumentViewer';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'signed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch initial documents data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await documentService.getDocuments();
        setDocuments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load documents. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Compute stats for overview metrics
  const stats = useMemo(() => {
    return {
      total: documents.length,
      pending: documents.filter(d => d.status === 'pending').length,
      signed: documents.filter(d => d.status === 'signed').length,
    };
  }, [documents]);

  // Filter and search logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [documents, statusFilter, searchQuery]);

  const handleUpload = async (file: File) => {
    try {
      const newDoc = await documentService.uploadDocument(file);
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (err) {
      alert('Error uploading document. Please verify the file integrity.');
    }
  };

  const handleSign = async (id: string, signature: string) => {
    try {
      await documentService.signDocument(id, signature);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, status: 'signed' } : doc))
      );
      setSelectedDoc(null);
    } catch (err) {
      alert('Failed to process digital signature. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header and KPI Stats Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Workspace</h1>
            <p className="text-sm text-gray-500 mt-1">Upload, audit, and securely counter-sign legal agreements.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-xl font-semibold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <span className="block text-xs font-medium text-amber-600 uppercase tracking-wider">Pending</span>
              <span className="text-xl font-semibold text-amber-700">{stats.pending}</span>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <span className="block text-xs font-medium text-emerald-600 uppercase tracking-wider">Signed</span>
              <span className="text-xl font-semibold text-emerald-700">{stats.signed}</span>
            </div>
          </div>
        </div>

        {/* Global Loading / Error Notifications */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="underline font-semibold hover:text-red-900">Retry</button>
          </div>
        )}

        {/* Main Content Workspace Splitting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Upload Actions & Directory Management */}
          <div className="lg:col-span-5 space-y-6">
            <DocumentUpload onUploadSuccess={handleUpload} />
            
            {/* Context Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
              <input 
                type="text" 
                placeholder="Search file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs font-medium">
                {(['all', 'pending', 'signed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 py-1.5 capitalize rounded-md transition ${
                      statusFilter === status 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Feed */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
              </div>
            ) : (
              <DocumentList documents={filteredDocuments} onSelect={setSelectedDoc} />
            )}
          </div>

          {/* Right Panel: Interactive File Viewer & Execution Sandbox */}
          <div className="lg:col-span-7">
            {selectedDoc ? (
              <div className="sticky top-6">
                <DocumentViewer
                  document={selectedDoc}
                  onClose={() => setSelectedDoc(null)}
                  onSign={handleSign}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-16 text-center h-[540px] flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                  📄
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No active file selected</h3>
                <p className="text-xs text-gray-500 max-w-xs mt-1 mx-auto">
                  Select an audit item from your file tray list to start reviewing signatures or reading details.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};