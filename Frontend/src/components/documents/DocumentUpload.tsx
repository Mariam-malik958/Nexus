import React, { useRef } from 'react';

interface Props {
  onUploadSuccess: (file: File) => void;
}

export const DocumentUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadSuccess(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center py-12">
      <p className="text-gray-600 mb-4">Upload PDFs or Documents to manage and sign</p>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Select File
      </button>
    </div>
  );
};