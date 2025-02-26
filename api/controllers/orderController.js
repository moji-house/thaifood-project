import db from "../config/db.js";

// สร้าง Order
export const createOrder = async (req, res) => {
  const userId = req.userId;
  const {
    sub_total,
    delivery_fee,
    service_charge,
    delivery_address,
    rider_note,
  } = req.body;

  try {
    // คำนวณ total
    const total = sub_total + delivery_fee + service_charge;

    // สร้าง Order ใหม่
    const [result] = await db.query(
      `INSERT INTO Orders 
        (user_id, sub_total, delivery_fee, service_charge, total, delivery_address, rider_note, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, // ใช้ NOW() สำหรับ timestamp
      [
        userId,
        sub_total,
        delivery_fee,
        service_charge,
        total,
        delivery_address,
        rider_note,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      sub_total,
      delivery_fee,
      service_charge,
      total,
      delivery_address,
      rider_note,
      date: new Date().toISOString(), // ส่งค่าวันที่กลับไปด้วย
    });
  } catch (error) {
    console.error("createOrder Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ดึงข้อมูล Orders ทั้งหมด
export const getAllOrders = async (req, res) => {
  const userId = req.userId;
  const isAdmin = req.userRole === "admin";

  try {
    let query = "SELECT * FROM Orders";
    let params = [];

    if (!isAdmin) {
      query += " WHERE user_id = ?";
      params.push(userId);
    }

    const [orders] = await db.query(query, params);
    res.status(200).json(orders);
  } catch (error) {
    console.error("getAllOrders Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ดึงข้อมูล Order โดย ID
export const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.userId;
  const isAdmin = req.userRole === "admin";

  try {
    const [orders] = await db.query("SELECT * FROM Orders WHERE id = ?", [
      orderId,
    ]);

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    // ตรวจสอบสิทธิ์ (เจ้าของหรือ Admin)
    if (order.user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// อัปเดต Order
export const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.userId;
  const isAdmin = req.userRole === "admin";
  const { delivery_address, rider_note } = req.body;

  try {
    // ตรวจสอบสิทธิ์
    const [existingOrder] = await db.query(
      "SELECT * FROM Orders WHERE id = ?",
      [orderId]
    );
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (existingOrder[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE Orders SET delivery_address = ?, rider_note = ? WHERE id = ?",
      [delivery_address, rider_note, orderId]
    );

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("updateOrder Error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// ลบ Order
export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.userId;
  const isAdmin = req.userRole === "admin";

  try {
    const [existingOrder] = await db.query(
      "SELECT * FROM Orders WHERE id = ?",
      [orderId]
    );
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (existingOrder[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await db.query("DELETE FROM Orders WHERE id = ?", [orderId]);
    res.status(204).json({});
  } catch (error) {
    console.error("deleteOrder Error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
