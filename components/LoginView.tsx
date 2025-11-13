import React from 'react';
import { LockClosedIcon } from './IconComponents';

interface LoginViewProps {
  onConnect: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onConnect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="mb-8">
            <div className="inline-flex items-center justify-center bg-brand-dark p-4 rounded-full mb-4">
                <LockClosedIcon className="w-12 h-12 text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">Digital Identity Vault</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                A decentralized hub to securely manage your digital documents and credentials. 
                Own your data, control your identity.
            </p>
        </div>
        <button
            onClick={onConnect}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-10 rounded-full hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
            Connect Wallet to Enter
        </button>
    </div>
  );
};
