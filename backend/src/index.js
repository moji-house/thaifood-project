import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderProductRoutes from "./routes/orderProductRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ระบุ origin ของ Frontend
    credentials: true, // อนุญาตให้ส่ง cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", healthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-products", orderProductRoutes);
app.use("/api/contacts", contactRoutes);

// Test Database Connection
try {
  const connection = await db.getConnection();
  console.log("Connected to MySQL!");
  connection.release();
} catch (error) {
  console.error("Database connection error:", error);
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
