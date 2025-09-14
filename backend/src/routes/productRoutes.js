import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  addSupplierToProduct,
  updateSupplierForProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", protect, adminOnly, createProduct);

// Wholesalers
router.put("/:id/suppliers", protect, addSupplierToProduct);
router.put("/:id/suppliers/update", protect, updateSupplierForProduct);

export default router;
