import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly, adminOrWholesaler } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order (Customer only)
 * @access  Private
 */
router.post("/", protect, createOrder);

/**
 * @route   GET /api/orders/my
 * @desc    Get logged-in user's orders
 * @access  Private (Customer)
 */
router.get("/my", protect, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order details by ID
 * @access  Private (Admin, Wholesaler, Customer who owns order)
 */
router.get("/:id", protect, getOrderById);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin or Wholesaler only)
 * @access  Private
 */
router.put("/:id/status", protect, adminOrWholesaler, updateOrderStatus);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private
 */
router.get("/", protect, adminOnly, getAllOrders);

export default router;
