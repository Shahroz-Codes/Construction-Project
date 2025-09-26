import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addSupplierToProduct,
  updateSupplierForProduct,
} from "../controllers/productController.js";



import {
  protect,
  adminOnly,
  adminOrWholesaler,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Wholesalers (suppliers)
router.put("/:id/suppliers", protect, adminOrWholesaler, addSupplierToProduct);
router.put("/:id/suppliers/update", protect, adminOrWholesaler, updateSupplierForProduct);

export default router;
