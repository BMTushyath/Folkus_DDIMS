
export interface Document {
  id: string;
  name: string;
  ipfsHash: string;
  encrypted: boolean;
  type: 'pdf' | 'image' | 'other';
  expiryDate?: string;
}

export interface Credential {
  id: string;
  docId: string;
  issuer: string;
  owner: string;
  fields: Record<string, string | number>;
}

export interface Heir {
  id: string;
  name: string;
  address: string;
  triggerCondition: string;
}

// FIX: Add and export ApiKey interface.
export interface ApiKey {
  id: string;
  serviceName: string;
  key: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  requestedProof: string;
  requiredField: string;
  derivation: (credential: Credential) => Record<string, any> | null;
}

export interface Connection {
  serviceProviderId: string;
  date: string;
  dataShared: Record<string, any>;
}

export interface User {
  loginCode: string;
  walletAddress: string;
  dob: string; // YYYY-MM-DD
  documents: Document[];
  credentials: Credential[];
  heirs: Heir[];
}