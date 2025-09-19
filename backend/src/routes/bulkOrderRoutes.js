import express from "express";
import {
  createBulkOrder,
  getOpenBulkOrders,
  submitBid,
  selectWinningBid,
} from "../controllers/bulkOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customers
router.post("/", protect, createBulkOrder);
router.put("/:id/select/:bidId", protect, selectWinningBid);

// Suppliers
router.get("/open", protect, getOpenBulkOrders);
router.post("/:id/bid", protect, submitBid);

export default router;
