import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";
import { authenticate, isAdmin } from "../middleware/userMiddleware.js";

const router = express.Router();

// สร้าง Contact (ไม่ต้อง Login)
router.post("/", createContact);

// ดึงข้อมูลทั้งหมด (Admin Only)
router.get("/", authenticate, isAdmin, getAllContacts);

// ดึงข้อมูลโดย ID (Admin Only)
router.get("/:id", authenticate, isAdmin, getContactById);

// อัปเดตข้อมูล (Admin Only)
router.put("/:id", authenticate, isAdmin, updateContact);

// ลบข้อมูล (Admin Only)
router.delete("/:id", authenticate, isAdmin, deleteContact);

export default router;
