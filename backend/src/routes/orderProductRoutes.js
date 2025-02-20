import express from "express";
import {
  createOrderProduct,
  getAllOrderProducts,
  getOrderProductById,
  updateOrderProduct,
  deleteOrderProduct,
  createBulkOrderProducts,
} from "../controllers/orderProductController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

router.use(authenticate); // ต้อง Login ก่อนใช้งานทุกเส้นทาง

// สร้าง Order Product (Admin หรือ เจ้าของ Order)
router.post("/", createOrderProduct);

// ดึงข้อมูลทั้งหมด (Admin เท่านั้น)
router.get("/", isAdmin, getAllOrderProducts);

// ดึงข้อมูลโดย ID (Admin หรือ เจ้าของ Order)
router.get("/:id", getOrderProductById);

// อัปเดตข้อมูล (Admin หรือ เจ้าของ Order)
router.put("/:id", updateOrderProduct);

// ลบข้อมูล (Admin หรือ เจ้าของ Order)
router.delete("/:id", deleteOrderProduct);

// bulk
router.post("/bulk", createBulkOrderProducts);

export default router;
