import React, { useState, useCallback, useEffect } from 'react';
import { Document, Heir, User, Credential } from './types';
import { LoginView } from './components/LoginView';
import { MainView } from './components/MainView';
import * as db from './services/db';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // On first load, ensure the database is seeded with initial data if it's empty.
    db.initializeDB();
  }, []);

  const handleLogin = useCallback((loginCode: string): boolean => {
    const user = db.findUserByLoginCode(loginCode);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const handleRegister = useCallback((dob: string, walletAddress: string): { success: boolean; error?: string } => {
    const result = db.createUser(dob, walletAddress);

    if (result.user) {
      setCurrentUser(result.user);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, []);

  const handleDisconnect = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addDocument = (file: File) => {
    if (!currentUser) return;
    
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      ipfsHash: `QmClient...${Math.random().toString(36).substring(2, 8)}`,
      encrypted: true,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
    };

    const updatedUser = { ...currentUser, documents: [...currentUser.documents, newDoc] };
    db.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };
  
  const addHeir = (name: string, address: string, triggerCondition: string) => {
    if (!currentUser) return;
    
    const newHeir: Heir = {
      id: `heir-${Date.now()}`,
      name,
      address,
      triggerCondition,
    };

    const updatedUser = { ...currentUser, heirs: [...currentUser.heirs, newHeir] };
    db.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary font-sans">
      {currentUser ? (
        <MainView
          walletAddress={currentUser.walletAddress}
          documents={currentUser.documents}
          credentials={currentUser.credentials}
          heirs={currentUser.heirs}
          onDisconnect={handleDisconnect}
          onAddDocument={addDocument}
          onAddHeir={addHeir}
        />
      ) : (
        <LoginView onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
};

export default App;
