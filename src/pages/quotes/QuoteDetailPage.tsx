import React, { useEffect } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';
import { ArrowLeft, Pencil, Trash2, Printer, FileCheck } from 'lucide-react';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuoteById, getClientById, settings, deleteQuote, convertQuoteToInvoice } = useApp();

  const quote = id ? getQuoteById(id) : undefined;

  // Titre du document = numéro de devis (utilisé par l'en-tête d'impression du navigateur)
  useEffect(() => {
    if (!quote) return;
    const previousTitle = document.title;
    document.title = quote.number;
    return () => {
      document.title = previousTitle;
    };
  }, [quote]);

  if (!quote) {
    return <Navigate to="/quotes" />;
  }

  const client = getClientById(quote.clientId);
  const isConverted = quote.status === 'converted';

  const handleDelete = () => {
    if (window.confirm(`Supprimer le devis ${quote.number} ?`)) {
      deleteQuote(quote.id);
      navigate('/quotes');
    }
  };

  const handleConvert = () => {
    if (window.confirm(`Convertir le devis ${quote.number} en facture ?`)) {
      const invoiceId = convertQuoteToInvoice(quote.id);
      if (invoiceId) {
        navigate(`/invoices/${invoiceId}`);
      }
    }
  };

  const cur = (v: number) => formatCurrency(v, settings.currencySymbol);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre d'actions (masquée à l'impression) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Link to="/quotes" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux devis
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
            Imprimer
          </Button>
          <Button
            variant="primary"
            icon={<FileCheck className="h-4 w-4" />}
            onClick={handleConvert}
            disabled={isConverted}
            title={isConverted ? 'Ce devis a déjà été converti en facture' : undefined}
          >
            Convertir en facture
          </Button>
          <Link to={`/quotes/${quote.id}/edit`}>
            <Button variant="outline" icon={<Pencil className="h-4 w-4" />} className="text-blue-600">
              Modifier
            </Button>
          </Link>
          <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        {/* En-tête : société / devis */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            {settings.companyLogo && (
              <img src={settings.companyLogo} alt="Logo" className="h-16 mb-3 object-contain" />
            )}
            <h2 className="text-xl font-bold text-gray-900">{settings.companyName}</h2>
            <p className="text-sm text-gray-500 whitespace-pre-line">{settings.companyAddress}</p>
            <p className="text-sm text-gray-500">{settings.companyPhone}</p>
            <p className="text-sm text-gray-500">{settings.companyEmail}</p>
            {settings.companyTaxId && <p className="text-sm text-gray-500">NINEA : {settings.companyTaxId}</p>}
          </div>
          <div className="sm:text-right">
            <h1 className="text-2xl font-bold text-gray-900">DEVIS</h1>
            <p className="text-lg font-medium text-blue-600">{quote.number}</p>
            <div className="mt-2">
              <StatusBadge status={quote.status} type="quote" />
            </div>
            <p className="mt-2 text-sm text-gray-500">Date : {formatDate(quote.date)}</p>
            <p className="text-sm text-gray-500">Valable jusqu'au : {formatDate(quote.validUntil)}</p>
          </div>
        </div>

        {/* Client */}
        <div className="py-6 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Destiné à</h3>
          {client ? (
            <>
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              <p className="text-sm text-gray-500">{client.address}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
              {client.taxId && <p className="text-sm text-gray-500">NINEA : {client.taxId}</p>}
            </>
          ) : (
            <p className="text-sm text-gray-500">Client inconnu</p>
          )}
        </div>

        {/* Lignes */}
        <div className="py-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qté</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">P.U.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Remise</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-sm text-gray-900">{item.description}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{item.unit}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{cur(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 text-right">{item.discount ? `${item.discount} %` : '—'}</td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">{cur(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="text-gray-900">{cur(quote.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA ({quote.taxRate} %)</span>
              <span className="text-gray-900">{cur(quote.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="text-gray-900">{cur(quote.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-base font-semibold text-gray-900">Total TTC</span>
              <span className="text-lg font-bold text-blue-700">{cur(quote.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Notes : </span>
              {quote.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteDetailPage;
