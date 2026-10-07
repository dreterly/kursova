const express = require("express");

const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// GET /api/announcements
// Отримати всі оголошення
// =========================================

router.get("/", async (req, res) => {
  try {
    const [announcements] = await db.query(`
      SELECT
        announcements.*,
        pets.name,
        pets.type AS pet_type,
        pets.breed,
        pets.gender,
        pets.color,
        pets.photo
      FROM announcements
      LEFT JOIN pets
        ON announcements.pet_id = pets.id
      ORDER BY announcements.created_at DESC
    `);

    res.json(announcements);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання оголошень",
    });
  }
});

// =========================================
// GET /api/announcements/user/:userId
// Отримати оголошення конкретного користувача
// =========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const [announcements] = await db.query(
      `
      SELECT
        announcements.*,
        pets.name,
        pets.type AS pet_type,
        pets.breed,
        pets.gender,
        pets.color,
        pets.photo
      FROM announcements
      LEFT JOIN pets
        ON announcements.pet_id = pets.id
      WHERE announcements.user_id = ?
      ORDER BY announcements.created_at DESC
      `,
      [req.params.userId],
    );

    res.json(announcements);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання оголошень користувача",
    });
  }
});

// =========================================
// GET /api/announcements/:id
// Отримати одне оголошення
// =========================================

router.get("/:id", async (req, res) => {
  try {
    const [announcements] = await db.query(
      `
      SELECT
        announcements.*,
        pets.name,
        pets.type AS pet_type,
        pets.breed,
        pets.gender,
        pets.color,
        pets.photo
      FROM announcements
      LEFT JOIN pets
        ON announcements.pet_id = pets.id
      WHERE announcements.id = ?
      `,
      [req.params.id],
    );

    if (announcements.length === 0) {
      return res.status(404).json({
        message: "Оголошення не знайдено",
      });
    }

    res.json(announcements[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання оголошення",
    });
  }
});

// =========================================
// POST /api/announcements
// Створити оголошення
// =========================================

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      pet_id,
      type,
      description,
      city,
      address,
      latitude,
      longitude,
      status,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO announcements
      (
        user_id,
        pet_id,
        type,
        description,
        city,
        address,
        latitude,
        longitude,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        pet_id,
        type,
        description,
        city,
        address,
        latitude,
        longitude,
        status || "active",
      ],
    );

    res.status(201).json({
      message: "Оголошення створено",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка створення оголошення",
    });
  }
});

// =========================================
// PUT /api/announcements/:id
// Редагувати власне оголошення
// =========================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      pet_id,
      type,
      description,
      city,
      address,
      latitude,
      longitude,
      status,
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE announcements
      SET
        pet_id = ?,
        type = ?,
        description = ?,
        city = ?,
        address = ?,
        latitude = ?,
        longitude = ?,
        status = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        pet_id,
        type,
        description,
        city,
        address,
        latitude,
        longitude,
        status,
        req.params.id,
        req.user.id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Оголошення не знайдено або воно вам не належить",
      });
    }

    res.json({
      message: "Оголошення успішно оновлено",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка редагування оголошення",
    });
  }
});

// =========================================
// DELETE /api/announcements/:id
// Видалити власне оголошення
// =========================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      `
      DELETE FROM announcements
      WHERE id = ? AND user_id = ?
      `,
      [req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Оголошення не знайдено або воно вам не належить",
      });
    }

    res.json({
      message: "Оголошення видалено",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Оголошення не вдалося видалити",
    });
  }
});

module.exports = router;
