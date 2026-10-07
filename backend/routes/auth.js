const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

// POST /api/auth/register
// Реєстрація нового користувача
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевіряємо, чи всі поля заповнені
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Заповніть усі поля",
      });
    }

    // Перевіряємо, чи існує користувач з таким email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      return res.status(400).json({
        message: "Користувач з таким email вже існує",
      });
    }

    // Додаємо нового користувача
    const [result] = await db.query(
      `INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)`,
      [name, email, password],
    );

    res.status(201).json({
      message: "Реєстрація успішна",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Помилка реєстрації:", error);

    res.status(500).json({
      message: "Помилка реєстрації",
    });
  }
});

// POST /api/auth/login
// Вхід користувача
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи заповнені поля
    if (!email || !password) {
      return res.status(400).json({
        message: "Введіть email і пароль",
      });
    }

    // Шукаємо користувача за email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Неправильний email або пароль",
      });
    }

    const user = users[0];

    // Перевіряємо пароль
    if (user.password !== password) {
      return res.status(401).json({
        message: "Неправильний email або пароль",
      });
    }

    // Створюємо token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "petfinder_secret_key",
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Вхід успішний",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Помилка входу:", error);

    res.status(500).json({
      message: "Помилка входу",
    });
  }
});
// PUT /api/auth/profile
// Оновити дані поточного користувача
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Ім'я та email є обов'язковими",
      });
    }

    // Перевіряємо, чи не зайнятий email іншим користувачем
    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
        AND id != ?
      `,
      [email, req.user.id],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Користувач з таким email вже існує",
      });
    }

    // Якщо пароль не вводили — змінюємо тільки ім'я та email
    if (!password) {
      await db.query(
        `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
        `,
        [name, email, req.user.id],
      );
    } else {
      // Якщо пароль введено — змінюємо і його
      await db.query(
        `
        UPDATE users
        SET name = ?, email = ?, password = ?
        WHERE id = ?
        `,
        [name, email, password, req.user.id],
      );
    }

    const [users] = await db.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
      `,
      [req.user.id],
    );

    res.json({
      message: "Дані профілю успішно оновлено",
      user: users[0],
    });
  } catch (error) {
    console.error("Помилка оновлення профілю:", error);

    res.status(500).json({
      message: "Не вдалося оновити профіль",
    });
  }
});

module.exports = router;
