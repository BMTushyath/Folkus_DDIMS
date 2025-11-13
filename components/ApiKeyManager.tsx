import React, { useState } from 'react';
import { ApiKey } from '../types';
import { ClipboardCopyIcon, KeyIcon, TrashIcon } from './IconComponents';

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  onAddKey: (serviceName: string, key: string) => void;
  onDeleteKey: (id: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeys, onAddKey, onDeleteKey }) => {
  const [serviceName, setServiceName] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceName && keyValue) {
      onAddKey(serviceName, keyValue);
      setServiceName('');
      setKeyValue('');
    }
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };
  
  const maskKey = (key: string) => {
    if (key.length < 8) return '********';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">API Key Vault</h2>
      <p className="text-text-secondary mb-6">
        Securely store and manage your third-party API keys. Keys are stored locally and are never transmitted.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Stored Keys</h3>
          <div className="space-y-4">
            {apiKeys.length > 0 ? apiKeys.map(apiKey => (
              <div key={apiKey.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <KeyIcon className="w-8 h-8 text-brand-light mr-4" />
                  <div>
                    <p className="font-semibold text-text-primary">{apiKey.serviceName}</p>
                    <p className="text-sm text-text-secondary font-mono">{maskKey(apiKey.key)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => copyToClipboard(apiKey.key, apiKey.id)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                    {copiedKeyId === apiKey.id ? <span className="text-green-400 text-xs">Copied!</span> : <ClipboardCopyIcon className="w-5 h-5" />}
                  </button>
                  <button onClick={() => onDeleteKey(apiKey.id)} className="p-2 text-text-secondary hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-text-secondary">No API keys stored yet.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Add New API Key</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-text-secondary">Service Name</label>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., OpenAI"
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="keyValue" className="block text-sm font-medium text-text-secondary">API Key</label>
              <input
                type="password"
                id="keyValue"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="sk-..."
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-2"
            >
              Save Key
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
