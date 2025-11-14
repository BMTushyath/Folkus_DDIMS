
import { User, Document, Credential } from '../types';

const DB_KEY = 'digital_identity_vault_users';

// --- MOCK USER DATABASE CREATION ---
const createInitialUsers = (): User[] => {
  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + 25);

  const farDate = new Date();
  farDate.setFullYear(farDate.getFullYear() + 1);

  const user1Wallet = '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
  const user1Dob = '1990-01-01'; // YYYY-MM-DD
  
  // Code: DDMMYY + first 4 of wallet (post-0x) -> 0101901a2b
  const user1LoginCode = '010190' + user1Wallet.substring(2, 6);

  return [
    {
      loginCode: user1LoginCode,
      walletAddress: user1Wallet,
      dob: user1Dob,
      documents: [
        { id: 'doc-1', name: 'Passport.pdf', ipfsHash: 'QmXoW8..A4o', encrypted: true, type: 'pdf', expiryDate: soonDate.toISOString().split('T')[0] },
        { id: 'doc-2', name: 'DriversLicense.jpg', ipfsHash: 'QmYp4o..B7i', encrypted: true, type: 'image', expiryDate: farDate.toISOString().split('T')[0] },
      ],
      credentials: [
        { id: 'cred-1', docId: 'doc-1', issuer: '0xGov...', owner: user1Wallet, fields: { name: 'Alice', dob: '1990-01-01', country: 'USA' } },
        { id: 'cred-2', docId: 'doc-2', issuer: '0xDMV...', owner: user1Wallet, fields: { name: 'Alice', licenseNo: 'D12345', state: 'CA' } },
      ],
      heirs: [
        { id: 'heir-1', name: 'Bob Smith', address: '0x123...abc', triggerCondition: 'Inactive for 180 days' }
      ]
    }
  ];
};


// --- DB Interaction Functions ---

export function getUsers(): User[] {
  const usersJson = localStorage.getItem(DB_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(users, null, 2));
}

export function initializeDB(): void {
  if (!localStorage.getItem(DB_KEY)) {
    console.log('Initializing database with mock data...');
    saveUsers(createInitialUsers());
  }
}

export function findUserByLoginCode(loginCode: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.loginCode.toLowerCase() === loginCode.toLowerCase());
}

export function doesUserExist(walletAddress: string, loginCode: string): boolean {
    const users = getUsers();
    return users.some(u => 
        u.walletAddress.toLowerCase() === walletAddress.toLowerCase() ||
        u.loginCode.toLowerCase() === loginCode.toLowerCase()
    );
}

export function addUser(newUser: User): void {
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
}

export function updateUser(updatedUser: User): void {
  let users = getUsers();
  users = users.map(u => u.walletAddress === updatedUser.walletAddress ? updatedUser : u);
  saveUsers(users);
}

export function createUser(dob: string, walletAddress: string): { user: User | null; error?: string } {
    const trimmedWalletAddress = walletAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedWalletAddress)) {
      return { user: null, error: 'Invalid wallet address format.' };
    }
    if (!dob) {
      return { user: null, error: 'Date of birth is required.' };
    }
  
    try {
      const date = new Date(`${dob}T00:00:00Z`);
      if (isNaN(date.getTime())) {
        return { user: null, error: 'Invalid date format provided.' };
      }
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = String(date.getUTCFullYear()).slice(-2);
      
      const walletPart = trimmedWalletAddress.substring(2, 6).toLowerCase();
      const loginCode = `${day}${month}${year}${walletPart}`;
  
      if (doesUserExist(trimmedWalletAddress, loginCode)) {
        return { user: null, error: 'A user with this DOB and wallet address already exists.' };
      }
      
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 25);
  
      const farDate = new Date();
      farDate.setFullYear(farDate.getFullYear() + 1);
      
      const defaultDocs: Document[] = [
        { id: `doc-${Date.now()}-1`, name: 'Passport.pdf', ipfsHash: `QmNew...${Math.random().toString(36).substring(2, 8)}`, encrypted: true, type: 'pdf', expiryDate: soonDate.toISOString().split('T')[0] },
        { id: `doc-${Date.now()}-2`, name: 'DriversLicense.jpg', ipfsHash: `QmNew...${Math.random().toString(36).substring(2, 8)}`, encrypted: true, type: 'image', expiryDate: farDate.toISOString().split('T')[0] },
      ];
      
      const defaultCreds: Credential[] = [
         { id: `cred-${Date.now()}-1`, docId: defaultDocs[0].id, issuer: '0xGov...', owner: trimmedWalletAddress, fields: { name: 'New User', dob: dob, country: 'USA' } },
         { id: `cred-${Date.now()}-2`, docId: defaultDocs[1].id, issuer: '0xDMV...', owner: trimmedWalletAddress, fields: { name: 'New User', licenseNo: 'D98765', state: 'CA' } },
      ];
  
      const newUser: User = {
        loginCode,
        walletAddress: trimmedWalletAddress,
        dob,
        documents: defaultDocs,
        credentials: defaultCreds,
        heirs: [],
      };
  
      addUser(newUser);
      return { user: newUser, error: undefined };
    } catch (e) {
      return { user: null, error: 'Could not process date. Please check the format.' };
    }
}
