import React, { useEffect } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate, paymentMethodLabel } from '../../utils/format';
import { ArrowLeft, Pencil, Trash2, Printer, Plus } from 'lucide-react';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, getClientById, getPaymentsByInvoiceId, settings, deleteInvoice } = useApp();

  const invoice = id ? getInvoiceById(id) : undefined;

  // Titre du document = numéro de facture (utilisé par l'en-tête d'impression du navigateur)
  useEffect(() => {
    if (!invoice) return;
    const previousTitle = document.title;
    document.title = invoice.number;
    return () => {
      document.title = previousTitle;
    };
  }, [invoice]);

  if (!invoice) {
    return <Navigate to="/invoices" />;
  }

  const client = getClientById(invoice.clientId);
  const invoicePayments = getPaymentsByInvoiceId(invoice.id);
  const totalPaid = invoicePayments.reduce((sum, p) => sum + p.amount, 0);
  const balance = invoice.total - totalPaid;

  const handleDelete = () => {
    if (window.confirm(`Supprimer la facture ${invoice.number} ?`)) {
      deleteInvoice(invoice.id);
      navigate('/invoices');
    }
  };

  const cur = (v: number) => formatCurrency(v, settings.currencySymbol);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre d'actions (masquée à l'impression) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Link to="/invoices" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux factures
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
            Imprimer
          </Button>
          <Link to={`/invoices/${invoice.id}/edit`}>
            <Button variant="primary" icon={<Pencil className="h-4 w-4" />}>
              Modifier
            </Button>
          </Link>
          <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        {/* En-tête : société / facture */}
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
            <h1 className="text-2xl font-bold text-gray-900">FACTURE</h1>
            <p className="text-lg font-medium text-blue-600">{invoice.number}</p>
            <div className="mt-2">
              <StatusBadge status={invoice.status} type="invoice" />
            </div>
            <p className="mt-2 text-sm text-gray-500">Date : {formatDate(invoice.date)}</p>
            <p className="text-sm text-gray-500">Échéance : {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Client */}
        <div className="py-6 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Facturé à</h3>
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
              {invoice.items.map((item) => (
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
              <span className="text-gray-900">{cur(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA ({invoice.taxRate} %)</span>
              <span className="text-gray-900">{cur(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="text-gray-900">{cur(invoice.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-base font-semibold text-gray-900">Total TTC</span>
              <span className="text-lg font-bold text-blue-700">{cur(invoice.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Déjà payé</span>
              <span className="text-green-700">{cur(totalPaid)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-900">Solde dû</span>
              <span className={balance > 0 ? 'text-red-600' : 'text-green-700'}>{cur(balance)}</span>
            </div>
          </div>
        </div>

        {/* Notes & conditions */}
        {(invoice.notes || invoice.paymentTerms) && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-1">
            {invoice.paymentTerms && (
              <p>
                <span className="font-medium text-gray-700">Conditions : </span>
                {invoice.paymentTerms}
              </p>
            )}
            {invoice.notes && (
              <p>
                <span className="font-medium text-gray-700">Notes : </span>
                {invoice.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Paiements rattachés (masqués à l'impression) */}
      <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden print:hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Paiements</h3>
          <Link to={`/payments/new?invoice=${invoice.id}`}>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />}>
              Enregistrer un paiement
            </Button>
          </Link>
        </div>
        {invoicePayments.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoicePayments.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3 text-sm text-gray-500">{formatDate(p.date)}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{paymentMethodLabel(p.method)}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.reference}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">{cur(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-4 text-sm text-gray-500">Aucun paiement enregistré pour cette facture.</div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
