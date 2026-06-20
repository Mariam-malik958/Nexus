import React, { useState } from 'react';
import { Document } from '../../services/documentService';
import { SignaturePad } from './SignaturePad';

interface Props {
  document: Document;
  onSign: (id: string, signature: string) => void;
  onClose: () => void;
}

export const DocumentViewer: React.FC<Props> = ({ document, onSign, onClose }) => {
  const [showSignPad, setShowSignPad] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{document.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕ Close</button>
      </div>

      {/* Mock Document Viewer Frame */}
      <div className="bg-gray-100 border rounded h-96 flex items-center justify-center mb-4">
        <p className="text-gray-500">[ Document Viewer Canvas / PDF Embed for {document.name} ]</p>
      </div>

      {document.status === 'pending' && !showSignPad && (
        <button
          onClick={() => setShowSignPad(true)}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
        >
          Sign Document
        </button>
      )}

      {showSignPad && (
        <SignaturePad
          onCancel={() => setShowSignPad(false)}
          onSave={(sig) => {
            onSign(document.id, sig);
            setShowSignPad(false);
          }}
        />
      )}
    </div>
  );
};