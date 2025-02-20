import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.userId = decoded.userId;
    next();
  } catch (error) {}
};

// Middleware ตรวจสอบสิทธิ์ Admin
export const isAdmin = async (req, res, next) => {
  try {
    const [users] = await db.query("SELECT role FROM User WHERE id = ?", [
      req.userId,
    ]);
    const user = users[0];

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Admin Check Error:", error);
    res.status(500).json({ error: "Failed to verify admin role" });
  }
};
