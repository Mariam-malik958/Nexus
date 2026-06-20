import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OTPRecord {
  otp: string;
  expiresAt: number; // timestamp in ms
}

// ─── In-Memory OTP Store ───────────────────────────────────────────────────────
// NOTE: Production mein isko Redis se replace karo

const otpStore: Record<string, OTPRecord> = {};

// ─── Nodemailer Transporter ───────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string, // Gmail App Password use karo
  },
});

// ─── Send OTP ─────────────────────────────────────────────────────────────────

export const sendOTP = async (email: string): Promise<void> => {
  // 6-digit numeric OTP generate karo
  const otp: string = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // Store karo with 5 minute expiry
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  // Email bhejo
  await transporter.sendMail({
    from: `"Nexus Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Nexus – Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1d4ed8;">Nexus Platform</h2>
        <p style="font-size: 15px; color: #374151;">Your One-Time Password (OTP) for verification:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #111827; margin: 24px 0;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #6b7280;">This OTP will expire in <strong>5 minutes</strong>.</p>
        <p style="font-size: 13px; color: #ef4444;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export const verifyOTP = (email: string, inputOtp: string): boolean => {
  const record = otpStore[email];

  // Record exist nahi karta
  if (!record) return false;

  // OTP expire ho gaya
  if (Date.now() > record.expiresAt) {
    delete otpStore[email]; // cleanup
    return false;
  }

  // OTP match nahi karta
  if (record.otp !== inputOtp) return false;

  // Verified – record delete karo (one-time use)
  delete otpStore[email];
  return true;
};

// ─── Clear Expired OTPs (Optional Cleanup) ───────────────────────────────────
// Yeh function server start pe chal sakta hai ya cron job se

export const clearExpiredOTPs = (): void => {
  const now = Date.now();
  for (const email in otpStore) {
    if (otpStore[email].expiresAt < now) {
      delete otpStore[email];
    }
  }
};

// Auto cleanup every 10 minutes
setInterval(clearExpiredOTPs, 10 * 60 * 1000);