import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Register
export const register = async (req, res) => {
  const { firstname, lastname, email, password, phone_no, role } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้นี้ในระบบแล้วหรือไม่
    const [existingUser] = await db.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกผู้ใช้ใหม่
    await db.query(
      "INSERT INTO User (firstname, lastname, email, password, phone_no, role) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, hashedPassword, phone_no, role]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Registration Error:", error); // แสดง error ใน terminal
    res.status(500).json({
      error: "Registration failed",
      details: error.message, // (Optional) ส่งข้อความ error กลับ (เฉพาะ development)
    });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    const [users] = await db.query("SELECT * FROM User WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ตรวจสอบ JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // สร้าง JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    // ส่ง Token กลับไปในรูปแบบ Cookie (หรือ Response Body ก็ได้)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 ชั่วโมง (หน่วยมิลลิวินาที)
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone_no: user.phone_no,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const getCurrentUser = async (req, res) => {
  try {
    // ตรวจสอบว่า req.userId มีค่าหรือไม่
    if (!req.userId) {
      return res.status(401).json({ error: "User ID not found" });
    }

    const [users] = await db.query("SELECT * FROM User WHERE id = ?", [
      req.userId,
    ]);

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    res.status(200).json({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone_no: user.phone_no,
      },
    });
  } catch (error) {
    console.error("getCurrentUser Error:", error); // แสดง error ใน terminal
    res.status(500).json({
      error: "Failed to fetch user",
      details: error.message, // (Optional) สำหรับ debugging
    });
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, firstname, lastname, email, phone_no, role FROM User"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("🔥 getAllUsers Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get User by ID (Admin Only)
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [users] = await db.query(
      "SELECT id, firstname, lastname, email, phone_no, role FROM User WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error("🔥 getUserById Error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update User (Admin Only)
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email, phone_no, role } = req.body;

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่จริง
    const [existingUser] = await db.query("SELECT * FROM User WHERE id = ?", [
      userId,
    ]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE User SET firstname = ?, lastname = ?, email = ?, phone_no = ?, role = ? WHERE id = ?",
      [firstname, lastname, email, phone_no, role, userId]
    );

    res.status(200).json({
      id: userId,
      firstname,
      lastname,
      email,
      phone_no,
      role,
    });
  } catch (error) {
    console.error("updateUser Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await db.query("DELETE FROM User WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).json({});
  } catch (error) {
    console.error("deleteUser Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
