const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const db = require("../config/db");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [[usersResult]] = await db.query(
      "SELECT COUNT(*) AS count FROM users",
    );

    const [[petsResult]] = await db.query("SELECT COUNT(*) AS count FROM pets");

    const [[announcementsResult]] = await db.query(
      "SELECT COUNT(*) AS count FROM announcements",
    );

    const [[activeResult]] = await db.query(
      "SELECT COUNT(*) AS count FROM announcements WHERE status = 'active'",
    );

    res.json({
      message: "Вітаємо в адмін-панелі",

      user: req.user,

      statistics: {
        users: usersResult.count,
        pets: petsResult.count,
        announcements: announcementsResult.count,
        active: activeResult.count,
      },
    });
  } catch (error) {
    console.error("Помилка отримання статистики:", error);

    res.status(500).json({
      message: "Не вдалося отримати статистику",
    });
  }
});

router.put(
  "/announcements/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { type, description, city, address, latitude, longitude, status } =
        req.body;
      const [result] = await db.query(
        `UPDATE announcements SET type = ?, description = ?, city = ?, address = ?, latitude = ?, longitude = ?, status = ? WHERE id = ?`,
        [
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
        return res.status(404).json({ message: "Оголошення не знайдено" });
      }
      res.json({ message: "Оголошення оновлено" });
    } catch (error) {
      console.error("Помилка редагування оголошення:", error);
      res.status(500).json({ message: "Не вдалося оновити оголошення" });
    }
  },
);
router.put("/pets/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      gender,
      birth_date,
      color,
      chip_number,
      photo,
      is_own,
    } = req.body;
    const [result] = await db.query(
      `UPDATE pets SET name = ?, type = ?, breed = ?, gender = ?, birth_date = ?, color = ?, chip_number = ?, photo = ?, is_own = ? WHERE id = ?`,
      [
        name,
        type,
        breed,
        gender,
        birth_date,
        color,
        chip_number,
        photo,
        is_own,
        req.params.id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Тварину не знайдено" });
    }
    res.json({ message: "Дані тварини оновлено" });
  } catch (error) {
    console.error("Помилка редагування тварини:", error);
    res.status(500).json({ message: "Не вдалося оновити тварину" });
  }
});
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`,
    );
    res.json(users);
  } catch (error) {
    console.error("Помилка отримання користувачів:", error);
    res.status(500).json({ message: "Не вдалося отримати користувачів" });
  }
});

router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT
          id,
          name,
          email,
          role,
          created_at
        FROM users
        WHERE id = ?`,
      [req.params.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Помилка отримання користувача:", error);

    res.status(500).json({
      message: "Не вдалося отримати користувача",
    });
  }
});

// Редагування користувача
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Заповніть усі поля",
      });
    }

    const [result] = await db.query(
      `UPDATE users
        SET name = ?,
            email = ?,
            role = ?
        WHERE id = ?`,
      [name, email, role, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    res.json({
      message: "Користувача оновлено",
    });
  } catch (error) {
    console.error("Помилка редагування користувача:", error);

    res.status(500).json({
      message: "Не вдалося оновити користувача",
    });
  }
});

// Видалення користувача
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const [result] = await db.query("DELETE FROM users WHERE id = ?", [
        req.params.id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Користувача не знайдено",
        });
      }

      res.json({
        message: "Користувача видалено",
      });
    } catch (error) {
      console.error("Помилка видалення користувача:", error);

      res.status(500).json({
        message: "Не вдалося видалити користувача",
      });
    }
  },
);

module.exports = router;
