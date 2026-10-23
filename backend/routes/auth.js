const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

const SALT_ROUNDS = 10;

// POST /api/auth/register
// Реєстрація нового користувача
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Заповніть усі поля",
      });
    }

    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      return res.status(400).json({
        message: "Користувач з таким email вже існує",
      });
    }

    // Хешуємо пароль перед збереженням у базі даних
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
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

    if (!email || !password) {
      return res.status(400).json({
        message: "Введіть email і пароль",
      });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Неправильний email або пароль",
      });
    }

    const user = users[0];

    // Перевіряємо пароль за допомогою bcrypt
    let isPasswordValid = false;

    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch {
      // Старий пароль міг зберігатися звичайним текстом
      isPasswordValid = false;
    }

    // Тимчасова сумісність з акаунтами, створеними до хешування.
    // Після успішного входу старий пароль одразу хешується.
    if (!isPasswordValid && user.password === password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await db.query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        user.id,
      ]);

      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Неправильний email або пароль",
      });
    }

    // Створюємо токен
    const token = jwt.sign(
  {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
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
// Оновлення даних поточного користувача
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Ім'я та email є обов'язковими",
      });
    }

    const [existingUsers] = await db.query(
      `SELECT id
       FROM users
       WHERE email = ? AND id != ?`,
      [email, req.user.id],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Користувач з таким email вже існує",
      });
    }

    if (!password) {
      // Якщо пароль не змінюють, залишаємо його без змін
      await db.query(
        `UPDATE users
         SET name = ?, email = ?
         WHERE id = ?`,
        [name, email, req.user.id],
      );
    } else {
      // Новий пароль теж обов'язково хешуємо
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await db.query(
        `UPDATE users
         SET name = ?, email = ?, password = ?
         WHERE id = ?`,
        [name, email, hashedPassword, req.user.id],
      );
    }

    const [users] = await db.query(
      `SELECT id, name, email, role
       FROM users
       WHERE id = ?`,
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
