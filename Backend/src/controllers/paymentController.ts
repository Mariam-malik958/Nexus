import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-05-27.dahlia",
});

// ─── Deposit ──────────────────────────────────────────────────────────────────
// POST /api/payment/deposit
export const deposit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: "Valid amount is required" });
      return;
    }

    // Stripe PaymentIntent banao (amount cents mein hota hai)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // e.g. $10 → 1000 cents
      currency,
      metadata: {
        userId: (req as any).user.id,
        type: "deposit",
      },
    });

    res.status(200).json({
      message: "Deposit initiated",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: "Pending",
    });

  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: "Deposit failed" });
  }
};

// ─── Withdraw ─────────────────────────────────────────────────────────────────
// POST /api/payment/withdraw
export const withdraw = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: "Valid amount is required" });
      return;
    }

    // Mock withdrawal (Stripe mein real withdrawal ke liye Payout API hoti hai)
    const mockTransaction = {
      id: `withdraw_${Date.now()}`,
      userId: (req as any).user.id,
      type: "withdraw",
      amount,
      currency,
      status: "Completed",
      createdAt: new Date(),
    };

    res.status(200).json({
      message: "Withdrawal successful (sandbox)",
      transaction: mockTransaction,
    });

  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ message: "Withdrawal failed" });
  }
};

// ─── Transfer ─────────────────────────────────────────────────────────────────
// POST /api/payment/transfer
export const transfer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = "usd", recipientId } = req.body;

    if (!amount || !recipientId) {
      res.status(400).json({ message: "Amount and recipientId are required" });
      return;
    }

    // Mock transfer
    const mockTransaction = {
      id: `transfer_${Date.now()}`,
      senderId: (req as any).user.id,
      recipientId,
      type: "transfer",
      amount,
      currency,
      status: "Completed",
      createdAt: new Date(),
    };

    res.status(200).json({
      message: "Transfer successful (sandbox)",
      transaction: mockTransaction,
    });

  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Transfer failed" });
  }
};

// ─── Transaction History ──────────────────────────────────────────────────────
// GET /api/payment/history
export const transactionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Stripe se real payment intents fetch karo
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 20,
    });

    // Sirf is user ke transactions filter karo
    const userTransactions = paymentIntents.data
      .filter((pi) => pi.metadata.userId === userId)
      .map((pi) => ({
        id: pi.id,
        type: pi.metadata.type || "deposit",
        amount: pi.amount / 100, // cents → dollars
        currency: pi.currency,
        status:
          pi.status === "succeeded"
            ? "Completed"
            : pi.status === "canceled"
            ? "Failed"
            : "Pending",
        createdAt: new Date(pi.created * 1000),
      }));

    res.status(200).json({
      message: "Transaction history fetched",
      transactions: userTransactions,
    });

  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};