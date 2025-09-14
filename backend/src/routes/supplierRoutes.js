import express from "express";
import {
  registerSupplier,
  getSuppliers,
  getSupplierById,
  verifySupplier,
  reviewSupplier,
} from "../controllers/supplierController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);

// Private
router.post("/", protect, registerSupplier);
router.post("/:id/review", protect, reviewSupplier);

// Admin
router.put("/:id/verify", protect, adminOnly, verifySupplier);

export default router;
