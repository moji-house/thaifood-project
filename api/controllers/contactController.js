import db from "../config/db.js";

// สร้าง Contact
export const createContact = async (req, res) => {
  const { firstname, lastname, email, phone_no, subject, details } = req.body;

  try {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!firstname || !email || !subject || !details) {
      return res
        .status(400)
        .json({ error: "Required fields: firstname, email, subject, details" });
    }

    // สร้าง Contact ใหม่
    const [result] = await db.query(
      "INSERT INTO Contact_us (Date, firstname, lastname, email, phone_no, subject, details) VALUES (NOW(), ?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, phone_no, subject, details]
    );

    res.status(201).json({
      id: result.insertId,
      Date: new Date(),
      firstname,
      lastname,
      email,
      phone_no,
      subject,
      details,
    });
  } catch (error) {
    console.error("createContact Error:", error);
    res.status(500).json({ error: "Failed to submit contact" });
  }
};

// ดึงข้อมูลทั้งหมด (Admin Only)
export const getAllContacts = async (req, res) => {
  try {
    const [contacts] = await db.query("SELECT * FROM Contact_us");
    res.status(200).json(contacts);
  } catch (error) {
    console.error("getAllContacts Error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// ดึงข้อมูลโดย ID (Admin Only)
export const getContactById = async (req, res) => {
  const contactId = req.params.id;

  try {
    const [contacts] = await db.query("SELECT * FROM Contact_us WHERE id = ?", [
      contactId,
    ]);
    if (contacts.length === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(contacts[0]);
  } catch (error) {
    console.error("getContactById Error:", error);
    res.status(500).json({ error: "Failed to fetch contact" });
  }
};

// อัปเดตข้อมูล (Admin Only)
export const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const { firstname, lastname, email, phone_no, subject, details } = req.body;

  try {
    // ตรวจสอบว่ามี Contact นี้หรือไม่
    const [existingContact] = await db.query(
      "SELECT * FROM Contact_us WHERE id = ?",
      [contactId]
    );
    if (existingContact.length === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // อัปเดตข้อมูล
    await db.query(
      "UPDATE Contact_us SET Date = NOW(), firstname = ?, lastname = ?, email = ?, phone_no = ?, subject = ?, details = ? WHERE id = ?",
      [firstname, lastname, email, phone_no, subject, details, contactId]
    );

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.error("updateContact Error:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
};

// ลบข้อมูล (Admin Only)
export const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM Contact_us WHERE id = ?", [
      contactId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(204).json({});
  } catch (error) {
    console.error("deleteContact Error:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
