import db from "../config/db.js";

// สร้าง Product
export const createProduct = async (req, res) => {
  const { name, image_url, description, price, category_id } = req.body;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !price || !category_id) {
      return res
        .status(400)
        .json({ error: "Name, price, and category are required" });
    }

    // ตรวจสอบว่า category_id มีอยู่ในฐานข้อมูลหรือไม่
    const [category] = await db.query("SELECT * FROM Category WHERE id = ?", [
      category_id,
    ]);
    if (category.length === 0) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // สร้าง Product ใหม่
    const [result] = await db.query(
      "INSERT INTO Product (name, image_url, description, price, category_id) VALUES (?, ?, ?, ?, ?)",
      [name, image_url, description, price, category_id]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      image_url,
      description,
      price,
      category_id,
    });
  } catch (error) {
    console.error("🔥 createProduct Error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ดึงข้อมูลทั้งหมด (พร้อมข้อมูล Category)
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.id, p.name, p.image_url, p.description, p.price,
        c.id AS category_id, c.name AS category_name
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.id
    `);
    res.status(200).json(products);
  } catch (error) {
    console.error("🔥 getAllProducts Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ดึงข้อมูลโดย ID
export const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const [products] = await db.query("SELECT * FROM Product WHERE id = ?", [
      productId,
    ]);

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(products[0]);
  } catch (error) {
    console.error("🔥 getProductById Error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// อัปเดตข้อมูล
export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, image_url, description, price, category_id } = req.body;

  try {
    // ตรวจสอบว่ามี Product นี้หรือไม่
    const [existingProduct] = await db.query(
      "SELECT * FROM Product WHERE id = ?",
      [productId]
    );
    if (existingProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ตรวจสอบ category_id (ถ้ามีการอัปเดต)
    if (category_id) {
      const [category] = await db.query("SELECT * FROM Category WHERE id = ?", [
        category_id,
      ]);
      if (category.length === 0) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE Product SET name = ?, image_url = ?, description = ?, price = ?, category_id = ? WHERE id = ?",
      [name, image_url, description, price, category_id, productId]
    );

    res.status(200).json({
      id: productId,
      name,
      image_url,
      description,
      price,
      category_id,
    });
  } catch (error) {
    console.error("🔥 updateProduct Error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ลบข้อมูล
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM Product WHERE id = ?", [
      productId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).json({});
  } catch (error) {
    console.error("🔥 deleteProduct Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
