import React from 'react';
import { Document } from '../../services/documentService';

interface Props {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

export const DocumentList: React.FC<Props> = ({ documents, onSelect }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
      <ul className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <li key={doc.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{doc.name}</p>
              <p className="text-sm text-gray-500">Uploaded on {doc.uploadedAt}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                doc.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status}
              </span>
              <button
                onClick={() => onSelect(doc)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};