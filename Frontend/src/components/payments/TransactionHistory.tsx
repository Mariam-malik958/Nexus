import React from 'react';
import { Transaction } from '../../services/paymentService';

interface Props {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<Props> = ({ transactions }) => {
  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2 py-0.5 border text-xs font-semibold rounded-full capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatAmount = (type: Transaction['type'], amount: number) => {
    const isNegative = type === 'withdrawal' || type === 'transfer';
    return `${isNegative ? '-' : '+'}$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs uppercase bg-gray-50/70 text-gray-400 font-medium tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Reference ID</th>
              <th className="px-6 py-3">Type / Description</th>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  No records found for this account pipeline.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-900 font-semibold">{txn.id}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-900 font-medium block">{txn.type}</span>
                    {txn.recipient && <span className="text-xs text-gray-400">To: {txn.recipient}</span>}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{txn.timestamp}</td>
                  <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${
                    txn.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatAmount(txn.type, txn.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};