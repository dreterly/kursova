const express = require("express");
const router = express.Router();

const db = require("../config/db");

// GET /api/announcements
// Отримати всі оголошення
router.get("/", async (req, res) => {
  try {
    const [announcements] = await db.query("SELECT * FROM announcements");

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Помилка отримання оголошень",
    });
  }
});

// GET /api/announcements/:id
// Отримати одне оголошення
router.get("/:id", async (req, res) => {
  try {
    const [announcements] = await db.query(
      "SELECT * FROM announcements WHERE id = ?",
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

// POST /api/announcements
// Створити оголошення
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
      `INSERT INTO announcements
      (user_id, pet_id, type, description, city, address, latitude, longitude, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

// PUT /api/announcements/:id
// Редагувати оголошення
router.put("/:id", async (req, res) => {
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
      `UPDATE announcements
      SET pet_id = ?,
          type = ?,
          description = ?,
          city = ?,
          address = ?,
          latitude = ?,
          longitude = ?,
          status = ?
      WHERE id = ?`,
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
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Оголошення не знайдено",
      });
    }

    res.json({
      message: "Оголошення оновлено",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Помилка редагування оголошення",
    });
  }
});

// DELETE /api/announcements/:id
// Видалити оголошення
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM announcements WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Оголошення не знайдено",
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
