export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  recipient?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export interface Balance {
  available: number;
  currency: string;
}

export const paymentService = {
  async getBalance(): Promise<Balance> {
    return { available: 5420.50, currency: 'USD' };
  },

  async getTransactionHistory(): Promise<Transaction[]> {
    return [
      { id: 'TXN-9082', type: 'deposit', amount: 1200.00, currency: 'USD', status: 'completed', timestamp: '2026-06-19 14:32' },
      { id: 'TXN-7612', type: 'transfer', amount: 350.00, currency: 'USD', recipient: 'Sarah Jenkins', status: 'completed', timestamp: '2026-06-18 09:15' },
      { id: 'TXN-4321', type: 'withdrawal', amount: 150.00, currency: 'USD', status: 'pending', timestamp: '2026-06-20 11:02' },
    ];
  },

  async executeDeposit(amount: number): Promise<Transaction> {
    return {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'deposit',
      amount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
  },

  async executeWithdrawal(amount: number): Promise<Transaction> {
    return {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'withdrawal',
      amount,
      currency: 'USD',
      status: 'pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
  },

  async executeTransfer(amount: number, recipient: string): Promise<Transaction> {
    return {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'transfer',
      amount,
      currency: 'USD',
      recipient,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
  }
};