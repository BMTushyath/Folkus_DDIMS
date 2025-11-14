import React, { useState } from 'react';
import { LockClosedIcon } from './IconComponents';

interface LoginViewProps {
  onLogin: (loginCode: string) => boolean;
  onRegister: (dob: string, walletAddress: string) => { success: boolean; error?: string };
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login state
  const [loginCode, setLoginCode] = useState('');
  
  // Register state
  const [dob, setDob] = useState('');
  const [wallet, setWallet] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
        if (!onLogin(loginCode)) {
            setError('Invalid user code. Please try again or register.');
        }
        setIsLoading(false);
    }, 500); // Simulate network delay
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        const result = onRegister(dob, wallet.trim());
        if (!result.success) {
            setError(result.error || 'Registration failed. Please try again.');
        }
        setIsLoading(false);
    }, 500);
  };

  const toggleView = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setLoginCode('');
    setDob('');
    setWallet('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center bg-brand-dark p-4 rounded-full mb-4">
          <LockClosedIcon className="w-12 h-12 text-brand-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-text-primary">Digital Identity Vault</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {isRegistering ? 'Create your secure account to get started.' : 'Enter your unique code to access your vault.'}
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-background-secondary shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-text-primary">{isRegistering ? 'Register' : 'Login'}</h2>
          
          {error && <p className="bg-red-900/50 text-red-300 text-sm p-3 rounded-md mb-4">{error}</p>}

          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-text-secondary text-left mb-1">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-text-primary focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-text-secondary text-left mb-1">Wallet Address</label>
                <input
                  id="wallet"
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-text-primary focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="loginCode" className="block text-sm font-medium text-text-secondary text-left mb-1">10-Character Access Code</label>
                <input
                  id="loginCode"
                  type="text"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  maxLength={10}
                  placeholder="DDMMYYAAAA"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-text-primary focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Enter Vault'}
              </button>
            </form>
          )}
          
          <p className="text-center text-sm text-text-secondary mt-6">
            {isRegistering ? 'Already have a code?' : "Don't have a code?"}{' '}
            <button onClick={toggleView} className="font-medium text-brand-light hover:underline">
              {isRegistering ? 'Login' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
