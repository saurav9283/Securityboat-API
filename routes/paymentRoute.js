import express from "express";
import { paymentVerification, getPaymentKey } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/index.js";

const router = express.Router();

router.get("/key", getPaymentKey);
router.post("/verify", paymentVerification);

export default router;

