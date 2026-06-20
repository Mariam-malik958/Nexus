import React, { useState, useEffect } from 'react';
import { paymentService, Transaction, Balance } from '../../services/paymentService';
import { DepositForm } from '../../components/payments/DepositForm';
import { WithdrawForm } from '../../components/payments/WithdrawForm';
import { TransferForm } from '../../components/payments/TransferForm';
import { TransactionHistory } from '../../components/payments/TransactionHistory';

type ActionTab = 'deposit' | 'withdraw' | 'transfer';

export const PaymentsPage: React.FC = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<ActionTab>('deposit');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      paymentService.getBalance(),
      paymentService.getTransactionHistory()
    ]).then(([bal, txns]) => {
      setBalance(bal);
      setTransactions(txns);
      setLoading(false);
    });
  }, []);

  const handleDeposit = async (amount: number) => {
    const nextTxn = await paymentService.executeDeposit(amount);
    setTransactions((prev) => [nextTxn, ...prev]);
    setBalance((prev) => prev ? { ...prev, available: prev.available + amount } : null);
  };

  const handleWithdrawal = async (amount: number) => {
    const nextTxn = await paymentService.executeWithdrawal(amount);
    setTransactions((prev) => [nextTxn, ...prev]);
    setBalance((prev) => prev ? { ...prev, available: prev.available - amount } : null);
  };

  const handleTransfer = async (amount: number, recipient: string) => {
    const nextTxn = await paymentService.executeTransfer(amount, recipient);
    setTransactions((prev) => [nextTxn, ...prev]);
    setBalance((prev) => prev ? { ...prev, available: prev.available - amount } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <p className="text-gray-400 font-medium animate-pulse">Loading secure wallet matrices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Manage balance streams, adjust liquidity pools, and trigger immediate settlements.</p>
        </div>

        {/* Action Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Card: Current Capital Metrics */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block mb-1">Available Capital</span>
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                ${balance?.available.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-4">
              <span>● Fully Secured Vault Channel (USD)</span>
            </div>
          </div>

          {/* Card: Operations Board (Tabbed UI Box) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100 bg-gray-50/60 p-1.5 gap-1">
              {(['deposit', 'withdraw', 'transfer'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'deposit' && <DepositForm onSuccess={handleDeposit} />}
              {activeTab === 'withdraw' && <WithdrawForm maxBalance={balance?.available || 0} onSuccess={handleWithdrawal} />}
              {activeTab === 'transfer' && <TransferForm maxBalance={balance?.available || 0} onSuccess={handleTransfer} />}
            </div>
          </div>
        </div>

        {/* Bottom Ledger History Section */}
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};