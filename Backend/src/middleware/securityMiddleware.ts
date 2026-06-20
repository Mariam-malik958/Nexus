import { Application } from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const xss = require("xss-clean");
import rateLimit from "express-rate-limit";

// ─── Rate Limiter – Login/OTP routes ke liye ──────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts allowed
  message: {
    message: "Too many attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Apply All Security Middleware ───────────────────────────────────────────
export const applySecurityMiddleware = (app: Application): void => {
  // HTTP headers secure karta hai
  app.use(helmet());

  // MongoDB injection rokta hai (e.g. { $gt: "" })
  // Note: express-mongo-sanitize is incompatible with Express 5 req.query getter
  // app.use(mongoSanitize());

  // XSS attacks rokta hai (e.g. <script> tags)
  // Note: xss-clean is incompatible with Express 5 req.query getter
  // app.use(xss());

  console.log("✅ Security middleware applied (Helmet)");
};