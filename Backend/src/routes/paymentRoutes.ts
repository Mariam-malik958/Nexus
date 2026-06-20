import { Router } from "express";
import { deposit, withdraw, transfer, transactionHistory } from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/securityMiddleware";

const router = Router();

router.post("/deposit",  protect, authLimiter, deposit);
router.post("/withdraw", protect, authLimiter, withdraw);
router.post("/transfer", protect, authLimiter, transfer);
router.get("/history",   protect, transactionHistory);

export default router;