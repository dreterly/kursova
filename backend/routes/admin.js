const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Дозволені формати: JPG, PNG, WEBP, GIF"));
    }
  },
});
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

router.put(
  "/pets/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("photo"),
  async (req, res) => {
    let newPhoto = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [
        req.params.id,
      ]);

      if (pets.length === 0) {
        return res.status(404).json({
          message: "Тварину не знайдено",
        });
      }

      const currentPet = pets[0];
      const body = req.body || {};

      const {
        name,
        type,
        breed,
        gender,
        birth_date,
        color,
        chip_number,
        is_own,
      } = body;

      if (!name?.trim() || !type) {
        return res.status(400).json({
          message: "Ім'я та тип тварини обов'язкові",
        });
      }

      const photo = newPhoto || currentPet.photo;

      const formattedBirthDate =
        birth_date === undefined
          ? currentPet.birth_date
          : birth_date
            ? birth_date.slice(0, 10)
            : null;

      await db.query(
        `UPDATE pets SET
          name = ?, type = ?, breed = ?, gender = ?,
          birth_date = ?, color = ?, chip_number = ?,
          photo = ?, is_own = ?
        WHERE id = ?`,
        [
          name.trim(),
          type,
          breed ?? null,
          gender ?? null,
          formattedBirthDate,
          color ?? null,
          chip_number ?? null,
          photo,
          is_own === undefined
            ? currentPet.is_own
            : is_own === "true" || is_own === true || is_own === 1,
          req.params.id,
        ],
      );

      if (newPhoto && currentPet.photo) {
        const oldName = path.basename(currentPet.photo);

        if (currentPet.photo.startsWith("/uploads/")) {
          const oldPath = path.join(uploadsDir, oldName);

          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const [updatedPets] = await db.query("SELECT * FROM pets WHERE id = ?", [
        req.params.id,
      ]);

      return res.json({
        message: "Дані тварини оновлено",
        pet: updatedPets[0],
      });
    } catch (error) {
      console.error("Помилка редагування тварини:", error);

      if (newPhoto) {
        const newPath = path.join(uploadsDir, path.basename(newPhoto));

        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
        }
      }

      return res.status(500).json({
        message: "Не вдалося оновити тварину",
      });
    }
  },
);

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
