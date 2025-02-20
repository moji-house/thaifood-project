import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

// สร้าง Category (Admin Only)
router.post("/", authenticate, isAdmin, createCategory);

// ดึงข้อมูลทั้งหมด (Public)
router.get("/", getAllCategories);

// ดึงข้อมูลโดย ID (Public)
router.get("/:id", getCategoryById);

// อัปเดตข้อมูล (Admin Only)
router.put("/:id", authenticate, isAdmin, updateCategory);

// ลบข้อมูล (Admin Only)
router.delete("/:id", authenticate, isAdmin, deleteCategory);

export default router;
