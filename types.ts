export interface Document {
  id: string;
  name: string;
  ipfsHash: string;
  encrypted: boolean;
  type: 'pdf' | 'image' | 'other';
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
