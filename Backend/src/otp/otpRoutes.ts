import { Router, Request, Response } from "express";
import { sendOTP, verifyOTP } from "./otpService";
import { protect } from "../middleware/authMiddleware"; // tumhara existing auth middleware

const router = Router();

// ─── Send OTP ─────────────────────────────────────────────────────────────────
// POST /api/otp/send
router.post("/send", protect, async (req: Request, res: Response) => {
  try {
    const email = (req as any).user.email;

    if (!email) {
      res.status(400).json({ message: "Email not found" });
      return;
    }

    await sendOTP(email);
    res.status(200).json({ message: "OTP sent to your email successfully" });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────
// POST /api/otp/verify
router.post("/verify", protect, (req: Request, res: Response) => {
  try {
    const email = (req as any).user.email;
    const { otp } = req.body;

    if (!otp) {
      res.status(400).json({ message: "OTP is required" });
      return;
    }

    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    res.status(200).json({ message: "OTP verified successfully", verified: true });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;