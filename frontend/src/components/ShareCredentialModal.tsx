
import React, { useState } from 'react';
import { Credential, Document } from '../types';
import { XIcon, ClipboardCopyIcon } from './IconComponents';

interface ShareCredentialModalProps {
  credential: Credential;
  document: Document;
  onClose: () => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const ShareCredentialModal: React.FC<ShareCredentialModalProps> = ({ credential, document, onClose }) => {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});
  const [sharableData, setSharableData] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const generateSharableData = () => {
    const disclosedData = Object.entries(credential.fields)
      .filter(([key]) => selectedFields[key])
      .map(([key, value]) => `${capitalize(key)}: ${value}`)
      .join('\n');

    if (disclosedData) {
        setSharableData(disclosedData);
        setIsCopied(false);
    }
  };
  
  const copyToClipboard = () => {
    if (sharableData) {
      navigator.clipboard.writeText(sharableData);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const noFieldsSelected = Object.values(selectedFields).every(v => !v);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Share Credential: {document.name}</h2>

          {!sharableData ? (
            <>
              <p className="text-text-secondary mb-4">Select the fields you want to disclose.</p>
              <div className="space-y-3 mb-6">
                {Object.keys(credential.fields).map(field => (
                  <label key={field} className="flex items-center bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded bg-gray-900 border-gray-600 text-brand-primary focus:ring-brand-secondary"
                      checked={!!selectedFields[field]}
                      onChange={() => handleFieldToggle(field)}
                    />
                    <span className="ml-3 text-text-primary capitalize">{field}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={generateSharableData}
                disabled={noFieldsSelected}
                className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Sharable Details
              </button>
            </>
          ) : (
            <div>
              <p className="text-text-secondary mb-2">Your sharable data is ready to be copied:</p>
              <div className="relative bg-gray-900 rounded-md p-4 text-gray-300 max-h-60 overflow-y-auto">
                 <div className="whitespace-pre-wrap">{sharableData}</div>
                 <button onClick={copyToClipboard} className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                  {isCopied ? <span className="text-green-400 text-xs">Copied!</span> : <ClipboardCopyIcon className="w-5 h-5 text-text-secondary" />}
                 </button>
              </div>
              <button
                onClick={() => { setSharableData(null); setSelectedFields({}); }}
                className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Select Different Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};