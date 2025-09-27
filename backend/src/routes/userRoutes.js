import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getUsers, getUserById, updateUserRole, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Admin-only routes
router.get("/", protect, admin, getUsers);           // GET all users
router.get("/:id", protect, admin, getUserById);     // GET single user
router.put("/:id", protect, admin, updateUserRole);  // UPDATE role
router.delete("/:id", protect, admin, deleteUser);   // DELETE user

export default router;
