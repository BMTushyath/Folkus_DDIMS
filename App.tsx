
import React, { useState, useCallback } from 'react';
import { Document, Credential, Heir } from './types';
import { LoginView } from './components/LoginView';
import { MainView } from './components/MainView';

const MOCK_WALLET_ADDRESS = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

const MOCK_DATA = {
  // FIX: Explicitly cast `documents` to `Document[]` to resolve a TypeScript type inference issue.
  // This ensures the `type` property matches the `Document` interface.
  documents: [
    { id: 'doc-1', name: 'Passport.pdf', ipfsHash: 'QmXoW8..A4o', encrypted: true, type: 'pdf' },
    { id: 'doc-2', name: 'DriversLicense.jpg', ipfsHash: 'QmYp4o..B7i', encrypted: true, type: 'image' },
  ] as Document[],
  credentials: [
    { id: 'cred-1', docId: 'doc-1', issuer: '0xGov...', owner: MOCK_WALLET_ADDRESS, fields: { name: 'Alice', dob: '1990-01-01', country: 'USA' } },
    { id: 'cred-2', docId: 'doc-2', issuer: '0xDMV...', owner: MOCK_WALLET_ADDRESS, fields: { name: 'Alice', licenseNo: 'D12345', state: 'CA' } },
  ],
  heirs: [
    { id: 'heir-1', name: 'Bob', address: '0xabc...def', triggerCondition: 'Inactive for 180 days' }
  ],
};


const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [heirs, setHeirs] = useState<Heir[]>([]);

  const handleConnect = useCallback(() => {
    setWalletAddress(MOCK_WALLET_ADDRESS);
    setDocuments(MOCK_DATA.documents);
    setCredentials(MOCK_DATA.credentials);
    setHeirs(MOCK_DATA.heirs);
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
    setDocuments([]);
    setCredentials([]);
    setHeirs([]);
  }, []);

  const addDocument = (file: File) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      ipfsHash: `QmClient...${Math.random().toString(36).substring(2, 8)}`,
      encrypted: true,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const addHeir = (heir: Omit<Heir, 'id'>) => {
    const newHeir: Heir = {
      id: `heir-${Date.now()}`,
      ...heir,
    };
    setHeirs(prev => [...prev, newHeir]);
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary font-sans">
      {walletAddress ? (
        <MainView
          walletAddress={walletAddress}
          documents={documents}
          credentials={credentials}
          heirs={heirs}
          onDisconnect={handleDisconnect}
          onAddDocument={addDocument}
          onAddHeir={addHeir}
        />
      ) : (
        <LoginView onConnect={handleConnect} />
      )}
    </div>
  );
};

export default App;
//hi