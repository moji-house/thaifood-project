import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes (ต้อง Login)
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

// Admin Routes (ต้อง Login และเป็น Admin)
router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/:id", authenticate, isAdmin, getUserById);
router.put("/:id", authenticate, isAdmin, updateUser);
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;
