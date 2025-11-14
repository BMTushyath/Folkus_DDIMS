import React, { useState, useMemo } from 'react';
import { Document, Credential } from '../types';
import { DocumentIcon, PhotographIcon, ShareIcon, UploadIcon, CalendarIcon } from './IconComponents';
import { ShareCredentialModal } from './ShareCredentialModal';

interface DocumentManagerProps {
  documents: Document[];
  credentials: Credential[];
  onAddDocument: (file: File) => void;
}

const getExpiryInfo = (expiryDateStr?: string) => {
    if (!expiryDateStr) return null;

    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date parts only

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: 'Expired', color: 'text-red-400' };
    }
    if (diffDays === 0) {
        return { text: 'Expires Today', color: 'text-red-400' };
    }
    if (diffDays <= 7) {
        return { text: `Expires in ${diffDays} days`, color: 'text-red-400' };
    }
    if (diffDays <= 30) {
        return { text: `Expires in ${diffDays} days`, color: 'text-yellow-400' };
    }
    return { text: `Expires on ${expiryDate.toLocaleDateString()}`, color: 'text-text-secondary' };
};


export const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, credentials, onAddDocument }) => {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onAddDocument(event.target.files[0]);
    }
  };
  
  const getCredentialForDocument = useMemo(() => {
    return (docId: string) => credentials.find(c => c.docId === docId);
  }, [credentials]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">My Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
           const credential = getCredentialForDocument(doc.id);
           const expiryInfo = getExpiryInfo(doc.expiryDate);
           return (
            <div key={doc.id} className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-200">
              <div>
                <div className="flex items-center mb-3">
                  {doc.type === 'image' ? <PhotographIcon className="w-6 h-6 text-brand-light mr-3" /> : <DocumentIcon className="w-6 h-6 text-brand-light mr-3" />}
                  <h3 className="text-lg font-semibold truncate text-text-primary">{doc.name}</h3>
                </div>
                <p className="text-sm text-text-secondary font-mono break-all">IPFS: {doc.ipfsHash}</p>
                {credential && <p className="text-sm text-green-400 mt-1">Verifiable Credential Attached</p>}
                {expiryInfo && (
                    <div className="flex items-center text-sm mt-2">
                        <CalendarIcon className={`w-4 h-4 mr-2 ${expiryInfo.color}`} />
                        <p className={`font-semibold ${expiryInfo.color}`}>{expiryInfo.text}</p>
                    </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                {credential && (
                   <button onClick={() => setSelectedCredential(credential)} className="flex items-center bg-brand-secondary hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">
                      <ShareIcon className="w-4 h-4 mr-2"/>
                      Share
                  </button>
                )}
              </div>
            </div>
           );
        })}
        <label htmlFor="file-upload" className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-text-secondary hover:bg-gray-800 hover:border-brand-primary transition-colors duration-200 p-5 min-h-[150px]">
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="font-semibold">Upload New Document</span>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {selectedCredential && (
        <ShareCredentialModal
          credential={selectedCredential}
          document={documents.find(d => d.id === selectedCredential.docId)!}
          onClose={() => setSelectedCredential(null)}
        />
      )}
    </div>
  );
};
