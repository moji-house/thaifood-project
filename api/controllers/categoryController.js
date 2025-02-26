import db from "../config/db.js";

// สร้าง Category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // สร้าง Category ใหม่
    const [result] = await db.query(
      "INSERT INTO Category (name, description) VALUES (?, ?)",
      [name, description]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
    });
  } catch (error) {
    console.error("🔥 createCategory Error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// ดึงข้อมูลทั้งหมด
export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT id, name, description FROM Category"
    );
    res.status(200).json(categories);
  } catch (error) {
    console.error("🔥 getAllCategories Error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ดึงข้อมูลโดย ID
export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const [categories] = await db.query(
      "SELECT id, name, description FROM Category WHERE id = ?",
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(categories[0]);
  } catch (error) {
    console.error("🔥 getCategoryById Error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// อัปเดตข้อมูล
export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  try {
    // ตรวจสอบว่ามี Category นี้หรือไม่
    const [existingCategory] = await db.query(
      "SELECT * FROM Category WHERE id = ?",
      [categoryId]
    );
    if (existingCategory.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE Category SET name = ?, description = ? WHERE id = ?",
      [name, description, categoryId]
    );

    res.status(200).json({
      id: categoryId,
      name,
      description,
    });
  } catch (error) {
    console.error("🔥 updateCategory Error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// ลบข้อมูล
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM Category WHERE id = ?", [
      categoryId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).json({});
  } catch (error) {
    console.error("🔥 deleteCategory Error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
