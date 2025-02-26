import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

router.use(authenticate); // ต้อง Login ก่อนใช้งานทุกเส้นทาง

// สร้าง Order (User)
router.post("/", createOrder);

// ดึงข้อมูล Orders (User ดูของตัวเอง, Admin ดูทั้งหมด)
router.get("/", getAllOrders);

// ดึงข้อมูล Order โดย ID (ตรวจสอบสิทธิ์)
router.get("/:id", getOrderById);

// อัปเดต Order (User เจ้าของหรือ Admin)
router.put("/:id", updateOrder);

// ลบ Order (User เจ้าของหรือ Admin)
router.delete("/:id", deleteOrder);

export default router;
