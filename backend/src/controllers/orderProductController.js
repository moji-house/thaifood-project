import db from "../config/db.js";

// สร้าง Order Product
export const createOrderProduct = async (req, res) => {
  const { name, price, quantity, order_id } = req.body;
  const userId = req.userId;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !price || !quantity || !order_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ตรวจสอบว่า Order นี้เป็นของผู้ใช้หรือไม่
    const [order] = await db.query("SELECT user_id FROM Orders WHERE id = ?", [
      order_id,
    ]);
    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order[0].user_id !== userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // สร้าง Order Product
    const [result] = await db.query(
      "INSERT INTO Order_Product (name, price, quantity, order_id) VALUES (?, ?, ?, ?)",
      [name, price, quantity, order_id]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price,
      quantity,
      order_id,
    });
  } catch (error) {
    console.error("createOrderProduct Error:", error);
    res.status(500).json({ error: "Failed to create order product" });
  }
};

// ดึงข้อมูลทั้งหมด (Admin Only)
export const getAllOrderProducts = async (req, res) => {
  try {
    const [orderProducts] = await db.query("SELECT * FROM Order_Product");
    res.status(200).json(orderProducts);
  } catch (error) {
    console.error("getAllOrderProducts Error:", error);
    res.status(500).json({ error: "Failed to fetch order products" });
  }
};

// ดึงข้อมูลโดย ID
export const getOrderProductById = async (req, res) => {
  const orderProductId = req.params.id;

  try {
    const [orderProducts] = await db.query(
      "SELECT * FROM Order_Product WHERE id = ?",
      [orderProductId]
    );

    if (orderProducts.length === 0) {
      return res.status(404).json({ error: "Order product not found" });
    }

    // ตรวจสอบสิทธิ์ (Admin หรือ เจ้าของ Order)
    const [order] = await db.query("SELECT user_id FROM Orders WHERE id = ?", [
      orderProducts[0].order_id,
    ]);
    if (order[0].user_id !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json(orderProducts[0]);
  } catch (error) {
    console.error("🔥 getOrderProductById Error:", error);
    res.status(500).json({ error: "Failed to fetch order product" });
  }
};

// อัปเดตข้อมูล
export const updateOrderProduct = async (req, res) => {
  const orderProductId = req.params.id;
  const { name, price, quantity } = req.body;

  try {
    // ตรวจสอบว่ามี Order Product นี้หรือไม่
    const [existingOrderProduct] = await db.query(
      "SELECT * FROM Order_Product WHERE id = ?",
      [orderProductId]
    );
    if (existingOrderProduct.length === 0) {
      return res.status(404).json({ error: "Order product not found" });
    }

    // ตรวจสอบสิทธิ์
    const [order] = await db.query("SELECT user_id FROM Orders WHERE id = ?", [
      existingOrderProduct[0].order_id,
    ]);
    if (order[0].user_id !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE Order_Product SET name = ?, price = ?, quantity = ? WHERE id = ?",
      [name, price, quantity, orderProductId]
    );

    res.status(200).json({ message: "Order product updated successfully" });
  } catch (error) {
    console.error("🔥 updateOrderProduct Error:", error);
    res.status(500).json({ error: "Failed to update order product" });
  }
};

// ลบข้อมูล
export const deleteOrderProduct = async (req, res) => {
  const orderProductId = req.params.id;

  try {
    // ตรวจสอบว่ามี Order Product นี้หรือไม่
    const [existingOrderProduct] = await db.query(
      "SELECT * FROM Order_Product WHERE id = ?",
      [orderProductId]
    );
    if (existingOrderProduct.length === 0) {
      return res.status(404).json({ error: "Order product not found" });
    }

    // ตรวจสอบสิทธิ์
    const [order] = await db.query("SELECT user_id FROM Orders WHERE id = ?", [
      existingOrderProduct[0].order_id,
    ]);
    if (order[0].user_id !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // ลบข้อมูล
    await db.query("DELETE FROM Order_Product WHERE id = ?", [orderProductId]);
    res.status(204).json({});
  } catch (error) {
    console.error("🔥 deleteOrderProduct Error:", error);
    res.status(500).json({ error: "Failed to delete order product" });
  }
};

// Bulk Insert
export const createBulkOrderProducts = async (req, res) => {
  const { order_id, products } = req.body;

  try {
    // ตรวจสอบข้อมูล
    if (!order_id || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
    }

    // สร้างข้อมูลสำหรับ bulk insert
    const values = products.map((p) => [p.name, p.price, p.quantity, order_id]);

    // Bulk Insert
    await db.query(
      `INSERT INTO Order_Product 
        (name, price, quantity, order_id)
      VALUES ?`,
      [values]
    );

    res.status(201).json({ message: "บันทึกสินค้าสำเร็จ" });
  } catch (error) {
    console.error("createBulkOrderProducts Error:", error);
    res.status(500).json({ error: "บันทึกสินค้าล้มเหลว" });
  }
};
