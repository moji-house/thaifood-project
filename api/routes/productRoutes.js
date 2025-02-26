import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

// สร้าง Product (Admin Only)
router.post("/", authenticate, isAdmin, createProduct);

// ดึงข้อมูลทั้งหมด (Public)
router.get("/", getAllProducts);

// ดึงข้อมูลโดย ID (Public)
router.get("/:id", getProductById);

// อัปเดตข้อมูล (Admin Only)
router.put("/:id", authenticate, isAdmin, updateProduct);

// ลบข้อมูล (Admin Only)
router.delete("/:id", authenticate, isAdmin, deleteProduct);

export default router;
