import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  addBulkToCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/userMiddleware.js";

const router = express.Router();

// ต้อง Login ก่อนใช้งานทุกเส้นทาง
router.use(authenticate);

// สร้าง/เพิ่มสินค้าในตะกร้า
router.post("/", addToCart);

// ดึงข้อมูลตะกร้าของผู้ใช้ปัจจุบัน
router.get("/", getCartItems);

// อัปเดตสินค้าในตะกร้า
router.put("/:id", updateCartItem);

// ลบสินค้าจากตะกร้า
router.delete("/:id", deleteCartItem);

// สร้าง/เพิ่มสินค้าหลายรายการในตะกร้า
router.post("/bulk", addBulkToCart);

export default router;
