
import React, { useState } from 'react';
import { Heir } from '../types';
import { UserCircleIcon, UsersIcon, UserPlusIcon } from './IconComponents';

interface DigitalInheritanceProps {
  heirs: Heir[];
  onAddHeir: (name: string, address: string, triggerCondition: string) => void;
}

export const DigitalInheritance: React.FC<DigitalInheritanceProps> = ({ heirs, onAddHeir }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && address && triggerCondition) {
      onAddHeir(name, address, triggerCondition);
      setName('');
      setAddress('');
      setTriggerCondition('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Digital Inheritance</h2>
      <p className="text-text-secondary mb-6">
        Designate trusted individuals (heirs) to inherit your digital assets under specific conditions. This ensures your valuable digital identity is never lost.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Designated Heirs</h3>
          <div className="space-y-4">
            {heirs.length > 0 ? heirs.map(heir => (
              <div key={heir.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <UserCircleIcon className="w-10 h-10 text-brand-light mr-4" />
                  <div>
                    <p className="font-semibold text-text-primary">{heir.name}</p>
                    <p className="text-sm text-text-secondary font-mono">{heir.address}</p>
                    <p className="text-sm text-text-secondary mt-1">Trigger: {heir.triggerCondition}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
                <UsersIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-text-primary">No Heirs Designated</h3>
                <p className="text-text-secondary mt-1">Add a trusted individual to manage your assets in the future.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
             <UserPlusIcon className="w-6 h-6 mr-2"/> Add New Heir
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="heirName" className="block text-sm font-medium text-text-secondary">Heir's Name</label>
              <input
                type="text"
                id="heirName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="heirAddress" className="block text-sm font-medium text-text-secondary">Heir's Wallet Address</label>
              <input
                type="text"
                id="heirAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="triggerCondition" className="block text-sm font-medium text-text-secondary">Trigger Condition</label>
              <input
                type="text"
                id="triggerCondition"
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                placeholder="e.g., Inactive for 180 days"
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-2 flex items-center justify-center"
            >
              Add Heir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};