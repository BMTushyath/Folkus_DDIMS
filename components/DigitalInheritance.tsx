
import React, { useState } from 'react';
import { Heir } from '../types';
import { UserAddIcon, UserCircleIcon } from './IconComponents';

interface DigitalInheritanceProps {
  heirs: Heir[];
  onAddHeir: (heir: Omit<Heir, 'id'>) => void;
}

export const DigitalInheritance: React.FC<DigitalInheritanceProps> = ({ heirs, onAddHeir }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [condition, setCondition] = useState('Inactive for 180 days');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && address && condition) {
      onAddHeir({ name, address, triggerCondition: condition });
      setName('');
      setAddress('');
      setCondition('Inactive for 180 days');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Digital Inheritance</h2>
      <p className="text-text-secondary mb-6">
        Designate trusted individuals to access your vault in case of an emergency. Access is granted based on predefined trigger conditions.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-text-primary">Designated Heirs</h3>
            <div className="space-y-4">
            {heirs.length > 0 ? heirs.map(heir => (
                <div key={heir.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                    <UserCircleIcon className="w-8 h-8 text-brand-light mr-4" />
                    <div>
                    <p className="font-semibold text-text-primary">{heir.name}</p>
                    <p className="text-sm text-text-secondary font-mono">{heir.address}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-text-secondary">Trigger:</p>
                    <p className="text-sm font-semibold text-brand-light">{heir.triggerCondition}</p>
                </div>
                </div>
            )) : (
                <p className="text-text-secondary">No heirs designated yet.</p>
            )}
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center"><UserAddIcon className="w-6 h-6 mr-2" /> Add New Heir</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Heir's Name</label>
                <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
                />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Wallet Address</label>
                <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
                />
            </div>
             <div>
                <label htmlFor="condition" className="block text-sm font-medium text-text-secondary">Trigger Condition</label>
                <select 
                    id="condition" 
                    value={condition} 
                    onChange={(e) => setCondition(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                >
                    <option>Inactive for 180 days</option>
                    <option>Multi-sig approval</option>
                    <option>On-chain oracle event</option>
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-2"
            >
                Add Heir
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};
