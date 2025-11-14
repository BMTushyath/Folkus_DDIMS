import React from 'react';
import { WalletConnect } from './WalletConnect';
import { LockClosedIcon } from './IconComponents';

interface HeaderProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  return (
    <header className="bg-background-secondary shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          <LockClosedIcon className="w-8 h-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-text-primary">Digital Identity Vault</h1>
        </div>
        <WalletConnect
          walletAddress={walletAddress}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    </header>
  );
};
