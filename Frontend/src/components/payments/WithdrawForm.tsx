import React, { useState } from 'react';

interface Props {
  maxBalance: number;
  onSuccess: (amount: number) => Promise<void>;
}

export const WithdrawForm: React.FC<Props> = ({ maxBalance, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) return;
    if (numAmount > maxBalance) {
      setError('Insufficient available funds.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSuccess(numAmount);
      setAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount (USD)</label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            min="1"
            step="0.01"
            required
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (error) setError(null);
            }}
            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-900"
            placeholder="0.00"
          />
        </div>
        {error && <p className="text-xs text-red-600 mt-1.5 font-medium">⚠️ {error}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 shadow-sm"
      >
        {isSubmitting ? 'Processing...' : 'Request Payout'}
      </button>
    </form>
  );
};