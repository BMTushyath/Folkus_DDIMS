import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import { DocumentManager } from './DocumentManager';
import { SecurityAudit } from './SecurityAudit';
import { DigitalInheritance } from './DigitalInheritance';
import { Document, Credential, Heir } from '../types';
import { ShieldCheckIcon, DocumentTextIcon, UsersIcon } from './IconComponents';

type Tab = 'documents' | 'security' | 'inheritance';

interface MainViewProps {
  walletAddress: string;
  documents: Document[];
  credentials: Credential[];
  heirs: Heir[];
  onDisconnect: () => void;
  onAddDocument: (file: File) => void;
  onAddHeir: (heir: Omit<Heir, 'id'>) => void;
}

export const MainView: React.FC<MainViewProps> = (props) => {
  const {
    walletAddress,
    documents,
    credentials,
    heirs,
    onDisconnect,
    onAddDocument,
    onAddHeir,
  } = props;
  
  const [activeTab, setActiveTab] = useState<Tab>('documents');

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'documents', label: 'Documents', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { id: 'security', label: 'AI Security Audit', icon: <ShieldCheckIcon className="w-5 h-5 mr-2" /> },
    { id: 'inheritance', label: 'Digital Inheritance', icon: <UsersIcon className="w-5 h-5 mr-2" /> },
  ];

  const renderContent = useMemo(() => {
    switch(activeTab) {
      case 'documents':
        return <DocumentManager documents={documents} credentials={credentials} onAddDocument={onAddDocument} />;
      case 'security':
        return <SecurityAudit />;
      case 'inheritance':
        return <DigitalInheritance heirs={heirs} onAddHeir={onAddHeir} />;
      default:
        return null;
    }
  }, [activeTab, documents, credentials, heirs, onAddDocument, onAddHeir]);

  return (
    <>
      <Header walletAddress={walletAddress} onConnect={() => {}} onDisconnect={onDisconnect} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-background-secondary rounded-lg shadow-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-1 sm:space-x-4 px-4 overflow-x-auto" aria-label="Tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 md:p-8">
            {renderContent}
          </div>
        </div>
      </main>
    </>
  );
};
