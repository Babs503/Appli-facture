import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'invoice' | 'quote' | 'payment';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'invoice' }) => {
  // Define colors for different statuses
  const getStatusColor = () => {
    if (type === 'invoice') {
      switch (status) {
        case 'draft':
          return 'bg-gray-200 text-gray-800';
        case 'sent':
          return 'bg-blue-100 text-blue-800';
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'overdue':
          return 'bg-red-100 text-red-800';
        case 'cancelled':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'quote') {
      switch (status) {
        case 'draft':
          return 'bg-gray-200 text-gray-800';
        case 'sent':
          return 'bg-blue-100 text-blue-800';
        case 'accepted':
          return 'bg-green-100 text-green-800';
        case 'rejected':
          return 'bg-red-100 text-red-800';
        case 'expired':
          return 'bg-yellow-100 text-yellow-800';
        case 'converted':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      // Payment status
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'complete':
          return 'bg-green-100 text-green-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        case 'refunded':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const getStatusLabel = () => {
    if (type === 'invoice') {
      switch (status) {
        case 'draft':
          return 'Brouillon';
        case 'sent':
          return 'Envoyée';
        case 'paid':
          return 'Payée';
        case 'overdue':
          return 'En retard';
        case 'cancelled':
          return 'Annulée';
        default:
          return status;
      }
    } else if (type === 'quote') {
      switch (status) {
        case 'draft':
          return 'Brouillon';
        case 'sent':
          return 'Envoyé';
        case 'accepted':
          return 'Accepté';
        case 'rejected':
          return 'Rejeté';
        case 'expired':
          return 'Expiré';
        case 'converted':
          return 'Converti';
        default:
          return status;
      }
    } else {
      // Payment status
      switch (status) {
        case 'pending':
          return 'En attente';
        case 'complete':
          return 'Complété';
        case 'failed':
          return 'Échoué';
        case 'refunded':
          return 'Remboursé';
        default:
          return status;
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;