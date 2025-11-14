
import React, { useState, useMemo } from 'react';
import { Credential, Document, ServiceProvider, Connection } from '../types';
import { BuildingLibraryIcon, ShoppingBagIcon, XIcon, CheckCircleIcon, ShareIcon } from './IconComponents';

const MOCK_SERVICES: ServiceProvider[] = [
  {
    id: 'svc-1',
    name: 'Global Mart',
    description: 'Online retailer for various goods.',
    logo: <ShoppingBagIcon className="w-10 h-10 text-brand-light" />,
    requestedProof: 'Proof of being over 18 for age-restricted items.',
    requiredField: 'dob',
    derivation: (credential) => {
      const dob = credential.fields['dob'];
      if (typeof dob === 'string') {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age >= 18) {
          return { isOver18: true };
        }
      }
      return null;
    }
  },
  {
    id: 'svc-2',
    name: 'State University',
    description: 'Verify your identity for student portal access.',
    logo: <BuildingLibraryIcon className="w-10 h-10 text-brand-light" />,
    requestedProof: 'Proof of your full name.',
    requiredField: 'name',
    derivation: (credential) => {
      const name = credential.fields['name'];
      if (typeof name === 'string') {
        return { name };
      }
      return null;
    }
  }
];

interface InteroperabilityProps {
  documents: Document[];
  credentials: Credential[];
}

const ConnectionModal: React.FC<{
  service: ServiceProvider;
  credentials: Credential[];
  documents: Document[];
  onClose: () => void;
  onConnect: (connection: Connection) => void;
}> = ({ service, credentials, documents, onClose, onConnect }) => {
  const [selectedCredentialId, setSelectedCredentialId] = useState<string>('');

  const relevantCredentials = useMemo(() => {
    return credentials.filter(c => Object.keys(c.fields).includes(service.requiredField));
  }, [credentials, service.requiredField]);

  const selectedCredential = credentials.find(c => c.id === selectedCredentialId);
  const derivedProof = selectedCredential ? service.derivation(selectedCredential) : null;

  const handleConnect = () => {
    if (derivedProof) {
      onConnect({
        serviceProviderId: service.id,
        date: new Date().toISOString(),
        dataShared: derivedProof,
      });
      onClose();
    }
  };
  
  const getDocumentName = (docId: string) => {
    return documents.find(d => d.id === docId)?.name || 'Unknown Document';
  }

  const formatKey = (key: string): string => {
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-md relative">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center mb-4">
            <div className="mr-4">{service.logo}</div>
            <div>
                <h2 className="text-xl font-bold">Connection Request</h2>
                <p className="text-text-secondary">from {service.name}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="font-semibold text-text-primary">What they're requesting:</p>
            <p className="text-text-secondary text-sm">{service.requestedProof}</p>
          </div>

          <div className="my-6">
            <label htmlFor="credential-select" className="block text-sm font-medium text-text-secondary mb-2">Select a credential to generate this proof:</label>
            <select
              id="credential-select"
              value={selectedCredentialId}
              onChange={(e) => setSelectedCredentialId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            >
              <option value="">-- Choose a credential --</option>
              {relevantCredentials.map(cred => (
                <option key={cred.id} value={cred.id}>
                  {getDocumentName(cred.docId)}
                </option>
              ))}
            </select>
             {relevantCredentials.length === 0 && <p className="text-yellow-400 text-xs mt-2">You don't have a relevant credential for this request.</p>}
          </div>

          {derivedProof && (
            <div className="mb-6">
                <p className="font-semibold text-text-primary mb-2">Data to be shared:</p>
                <div className="bg-green-900/50 border border-green-500 text-green-300 rounded-lg p-3 text-sm space-y-1">
                  {Object.entries(derivedProof).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-text-secondary">{formatKey(key)}:</span>
                      <span className="font-mono font-bold text-text-primary">{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-secondary mt-2">Note: Only this derived proof will be shared, not the underlying personal data from your document.</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
             <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Cancel
             </button>
             <button onClick={handleConnect} disabled={!derivedProof} className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Approve & Share
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};


export const Interoperability: React.FC<InteroperabilityProps> = ({ documents, credentials }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requestingService, setRequestingService] = useState<ServiceProvider | null>(null);
  
  const handleAddConnection = (connection: Connection) => {
    setConnections(prev => [...prev.filter(c => c.serviceProviderId !== connection.serviceProviderId), connection]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Cross-Platform Connections</h2>
      <p className="text-text-secondary mb-6">
        Securely connect to third-party services by sharing privacy-preserving "Verifiable Presentations" instead of your raw documents. You control exactly what is shared.
      </p>
      <div className="space-y-4">
        {MOCK_SERVICES.map(service => {
          const connection = connections.find(c => c.serviceProviderId === service.id);
          return (
            <div key={service.id} className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">{service.logo}</div>
                <div>
                  <p className="font-semibold text-text-primary">{service.name}</p>
                  <p className="text-sm text-text-secondary">{service.description}</p>
                </div>
              </div>
              <div>
                {connection ? (
                  <div className="text-right">
                    <div className="flex items-center justify-end text-green-400 font-semibold text-sm mb-1">
                      <CheckCircleIcon className="w-5 h-5 mr-1.5" />
                      Connected
                    </div>
                    <p className="text-xs text-text-secondary">
                      Shared on {new Date(connection.date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <button onClick={() => setRequestingService(service)} className="flex items-center bg-brand-secondary hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 whitespace-nowrap">
                    <ShareIcon className="w-4 h-4 mr-2"/>
                    Accept
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {requestingService && (
        <ConnectionModal
          service={requestingService}
          credentials={credentials}
          documents={documents}
          onClose={() => setRequestingService(null)}
          onConnect={handleAddConnection}
        />
      )}
    </div>
  );
};