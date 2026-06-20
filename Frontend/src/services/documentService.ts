export interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed';
  url: string;
  uploadedAt: string;
}

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    // Replace with actual API call: fetch('/api/documents')
    return [
      { id: '1', name: 'NDA_Agreement.pdf', status: 'pending', url: '#', uploadedAt: '2026-06-15' },
      { id: '2', name: 'Employment_Contract.pdf', status: 'signed', url: '#', uploadedAt: '2026-06-18' },
    ];
  },

  async uploadDocument(file: File): Promise<Document> {
    // Replace with actual FormData upload
    return {
      id: Math.random().toString(),
      name: file.name,
      status: 'pending',
      url: '#',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
  },

  async signDocument(id: string, signatureDataUrl: string): Promise<void> {
    // Replace with API call to save the signature payload
    console.log(`Document ${id} signed with payload:`, signatureDataUrl);
  }
};