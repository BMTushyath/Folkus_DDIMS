
import React from 'react';
import { Document } from '../types';
import { CalendarIcon, DocumentIcon, PhotographIcon } from './IconComponents';

const getExpiryStatus = (expiryDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { days: diffDays, text: 'Expired', color: 'text-red-300', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' };
    }
    if (diffDays === 0) {
        return { days: diffDays, text: 'Expires Today', color: 'text-red-300', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' };
    }
    if (diffDays <= 7) {
        return { days: diffDays, text: `${diffDays} days left`, color: 'text-red-300', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' };
    }
    if (diffDays <= 30) {
        return { days: diffDays, text: `${diffDays} days left`, color: 'text-yellow-300', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500' };
    }
    return { days: diffDays, text: `${diffDays} days left`, color: 'text-green-300', bgColor: 'bg-green-500/20', borderColor: 'border-gray-700' };
};

export const ExpiryManager: React.FC<{ documents: Document[] }> = ({ documents }) => {
    const documentsWithExpiry = documents
        .filter(doc => doc.expiryDate)
        .map(doc => ({ ...doc, status: getExpiryStatus(doc.expiryDate!) }))
        .sort((a, b) => a.status.days - b.status.days);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Expiry & Renewal Reminder</h2>
            <p className="text-text-secondary mb-6">
                Track your document expiry dates and receive timely renewal reminders. Documents expiring within 30 days are highlighted.
            </p>
            {documentsWithExpiry.length > 0 ? (
                <div className="space-y-4">
                    {documentsWithExpiry.map(doc => (
                        <div key={doc.id} className={`bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 ${doc.status.borderColor}`}>
                            <div className="flex items-center">
                                {doc.type === 'image' ? <PhotographIcon className="w-8 h-8 text-brand-light mr-4 flex-shrink-0" /> : <DocumentIcon className="w-8 h-8 text-brand-light mr-4 flex-shrink-0" />}
                                <div>
                                    <p className="font-semibold text-text-primary">{doc.name}</p>
                                    <p className="text-sm text-text-secondary">Expires on: {new Date(doc.expiryDate!).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                               <div className={`text-sm font-bold px-3 py-1 rounded-full ${doc.status.bgColor} ${doc.status.color}`}>
                                   {doc.status.text}
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary">No Documents with Expiry Dates</h3>
                    <p className="text-text-secondary mt-1">Expiry dates for uploaded documents will be tracked here.</p>
                </div>
            )}
        </div>
    );
};