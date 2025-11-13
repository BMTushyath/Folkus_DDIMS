
import React from 'react';

interface WalletConnectProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  if (walletAddress) {
    const displayAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
    return (
      <div className="flex items-center space-x-4">
        <div className="bg-brand-dark text-brand-light px-4 py-2 rounded-full text-sm font-mono hidden sm:block">
          {displayAddress}
        </div>
        <button
          onClick={onDisconnect}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity duration-200"
    >
      Connect Wallet
    </button>
  );
};
