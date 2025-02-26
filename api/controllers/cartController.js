import db from "../config/db.js";

// เพิ่มสินค้าเข้าตะกร้า
export const addToCart = async (req, res) => {
  const { product_id, quantity, note } = req.body;
  const userId = req.userId; // ได้จาก middleware authenticate

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!product_id || !quantity) {
      return res
        .status(400)
        .json({ error: "Product and quantity are required" });
    }

    // ตรวจสอบว่าสินค้ามีอยู่ในระบบหรือไม่
    const [product] = await db.query("SELECT * FROM Product WHERE id = ?", [
      product_id,
    ]);
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // เพิ่มลงตะกร้า
    const [result] = await db.query(
      "INSERT INTO Cart (user_id, product_id, note, quantity) VALUES (?, ?, ?, ?)",
      [userId, product_id, note, quantity]
    );

    res.status(201).json({
      id: result.insertId,
      product_id,
      quantity,
      note,
    });
  } catch (error) {
    console.error("addToCart Error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// ดึงข้อมูลตะกร้าของผู้ใช้ปัจจุบัน (พร้อมข้อมูลสินค้า)
export const getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const [cartItems] = await db.query(
      `SELECT
        c.id, c.quantity, c.note,
        p.id AS product_id, p.name, p.image_url, p.price
      FROM Cart c
      JOIN Product p ON c.product_id = p.id
      WHERE c.user_id = ?`,
      [userId]
    );

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("getCartItems Error:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

// อัปเดตสินค้าในตะกร้า
export const updateCartItem = async (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.userId;
  const { quantity, note } = req.body;

  try {
    // ตรวจสอบว่าสินค้าในตะกร้าเป็นของผู้ใช้ปัจจุบันหรือไม่
    const [cartItem] = await db.query(
      "SELECT * FROM Cart WHERE id = ? AND user_id = ?",
      [cartItemId, userId]
    );
    if (cartItem.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // อัปเดตข้อมูล
    await db.query("UPDATE Cart SET quantity = ?, note = ? WHERE id = ?", [
      quantity,
      note,
      cartItemId,
    ]);

    res.status(200).json({
      id: cartItemId,
      quantity,
      note,
    });
  } catch (error) {
    console.error("updateCartItem Error:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// ลบสินค้าจากตะกร้า
export const deleteCartItem = async (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.userId;

  try {
    const [result] = await db.query(
      "DELETE FROM Cart WHERE id = ? AND user_id = ?",
      [cartItemId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(204).json({});
  } catch (error) {
    console.error("deleteCartItem Error:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
};

// เพิ่มสินค้าหลายรายการเข้าตะกร้าพร้อมกัน
export const addBulkToCart = async (req, res) => {
  const { items } = req.body;
  const userId = req.userId;

  try {
    const values = items.map((item) => [
      userId,
      item.product_id,
      item.note || null,
      item.quantity,
    ]);

    const [result] = await db.query(
      "INSERT INTO Cart (user_id, product_id, note, quantity) VALUES ?",
      [values]
    );

    res.status(201).json({
      message: "Items added to cart successfully",
      count: result.affectedRows,
    });
  } catch (error) {
    console.error("addBulkToCart Error:", error);
    res.status(500).json({ error: "Failed to add items to cart" });
  }
};
