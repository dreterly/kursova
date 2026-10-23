const express = require("express");
const router = express.Router();

const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

// ======================================
// ПАПКА ДЛЯ ФОТОГРАФІЙ
// ======================================

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================================
// НАЛАШТУВАННЯ ЗАВАНТАЖЕННЯ ФОТО
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  return cb(new Error("Дозволені формати: JPG, PNG, WEBP, GIF"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// ======================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ======================================

function deletePhoto(photo) {
  if (typeof photo !== "string" || !photo.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(photo);
  const filePath = path.join(uploadsDir, filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Не вдалося видалити фотографію:", error);
  }
}

function canAccessUser(req, userId) {
  const isOwner =
    req.user?.id != null && String(req.user.id) === String(userId);

  const isAdmin = req.user?.role === "admin";

  return isOwner || isAdmin;
}

function canManagePet(req, pet) {
  return canAccessUser(req, pet.user_id);
}

function parsePetId(value) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

// Публічні дані тварини.
// Не повертаємо user_id та інші внутрішні поля.
const publicPetFields = `
  id,
  name,
  type,
  breed,
  gender,
  birth_date,
  color,
  photo,
  is_own,
  created_at
`;

// ======================================
// GET /api/pets
// ПУБЛІЧНИЙ СПИСОК ТВАРИН
// ======================================

router.get("/", async (req, res) => {
  try {
    const [pets] = await db.query(`
      SELECT ${publicPetFields}
      FROM pets
      WHERE is_own = FALSE
      ORDER BY created_at DESC
    `);

    return res.json(pets);
  } catch (error) {
    console.error("Помилка отримання тварин:", error);

    return res.status(500).json({
      message: "Помилка отримання тварин",
    });
  }
});

// ======================================
// GET /api/pets/user/:userId
// ВЛАСНІ ТВАРИНИ КОРИСТУВАЧА
// ======================================

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = parsePetId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Некоректний ID користувача",
      });
    }

    if (!canAccessUser(req, userId)) {
      return res.status(403).json({
        message: "Немає доступу до тварин цього користувача",
      });
    }

    const [pets] = await db.query(
      `
      SELECT *
      FROM pets
      WHERE user_id = ? AND is_own = TRUE
      ORDER BY created_at DESC
      `,
      [userId],
    );

    return res.json(pets);
  } catch (error) {
    console.error("Помилка отримання тварин користувача:", error);

    return res.status(500).json({
      message: "Помилка отримання тварин користувача",
    });
  }
});

// ======================================
// GET /api/pets/:id
// ОТРИМАТИ ОДНУ ПУБЛІЧНУ ТВАРИНУ
// ======================================

// Отримати тварину за ID
// Публічні тварини доступні всім.
// Власні тварини доступні лише власнику або адміністратору.
router.get("/:id", async (req, res) => {
  try {
    const petId = parsePetId(req.params.id);

    if (!petId) {
      return res.status(400).json({
        message: "Некоректний ID тварини",
      });
    }

    // Шукаємо тварину незалежно від її типу
    const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [petId]);

    if (pets.length === 0) {
      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    const pet = pets[0];

    // Публічні тварини доступні без авторизації
    if (!pet.is_own) {
      const { user_id, chip_number, ...publicPet } = pet;

      return res.json(publicPet);
    }

    // Власні тварини потребують авторизації
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Для перегляду цієї тварини потрібно увійти в акаунт",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      const jwt = require("jsonwebtoken");

      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Недійсний або прострочений токен",
      });
    }

    // Перевіряємо, чи користувач є власником або адміністратором
    const isOwner = String(decoded.id) === String(pet.user_id);

    const isAdmin = decoded.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "У вас немає доступу до цієї тварини",
      });
    }

    // Приватні дані повертаємо лише авторизованому користувачу
    return res.json(pet);
  } catch (error) {
    console.error("Помилка отримання тварини:", error);

    return res.status(500).json({
      message: "Помилка сервера під час отримання тварини",
    });
  }
});

// ======================================
// POST /api/pets
// ДОДАТИ ВЛАСНУ ТВАРИНУ
// ======================================

router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  let photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const { name, type, breed, gender, birth_date, color, chip_number } =
      req.body || {};

    const userId = req.user?.id;

    if (!userId) {
      deletePhoto(photo);

      return res.status(401).json({
        message: "Не вдалося визначити авторизованого користувача",
      });
    }

    if (typeof name !== "string" || !name.trim() || !type) {
      deletePhoto(photo);

      return res.status(400).json({
        message: "Заповніть обов'язкові поля: ім'я та вид тварини",
      });
    }

    const formattedBirthDate = birth_date
      ? String(birth_date).slice(0, 10)
      : null;

    const [result] = await db.query(
      `
        INSERT INTO pets (
          user_id,
          name,
          type,
          breed,
          gender,
          birth_date,
          color,
          chip_number,
          photo,
          is_own
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        userId,
        name.trim(),
        type,
        breed || null,
        gender || null,
        formattedBirthDate,
        color || null,
        chip_number || null,
        photo,
        true,
      ],
    );

    const [pets] = await db.query(
      "SELECT * FROM pets WHERE id = ? AND user_id = ?",
      [result.insertId, userId],
    );

    return res.status(201).json({
      message: "Тварину додано",
      pet: pets[0],
      id: result.insertId,
    });
  } catch (error) {
    console.error("Помилка додавання тварини:", error);
    deletePhoto(photo);

    return res.status(500).json({
      message: "Помилка додавання тварини",
    });
  }
});

// ======================================
// PUT /api/pets/:id
// РЕДАГУВАТИ ВЛАСНУ ТВАРИНУ АБО ТВАРИНУ ЯК АДМІН
// ======================================

router.put("/:id", authMiddleware, upload.single("photo"), async (req, res) => {
  let newPhoto = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const petId = parsePetId(req.params.id);

    if (!petId) {
      deletePhoto(newPhoto);

      return res.status(400).json({
        message: "Некоректний ID тварини",
      });
    }

    const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [petId]);

    if (pets.length === 0) {
      deletePhoto(newPhoto);

      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    const currentPet = pets[0];

    if (!canManagePet(req, currentPet)) {
      deletePhoto(newPhoto);

      return res.status(403).json({
        message: "Немає прав для редагування цієї тварини",
      });
    }

    const { name, type, breed, gender, birth_date, color, chip_number } =
      req.body || {};

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      deletePhoto(newPhoto);

      return res.status(400).json({
        message: "Ім'я тварини не може бути порожнім",
      });
    }

    if (type !== undefined && !type) {
      deletePhoto(newPhoto);

      return res.status(400).json({
        message: "Вид тварини не може бути порожнім",
      });
    }

    const formattedBirthDate =
      birth_date === undefined
        ? currentPet.birth_date
        : birth_date
          ? String(birth_date).slice(0, 10)
          : null;

    const photo = newPhoto || currentPet.photo;

    await db.query(
      `
        UPDATE pets
        SET
          name = ?,
          type = ?,
          breed = ?,
          gender = ?,
          birth_date = ?,
          color = ?,
          chip_number = ?,
          photo = ?
        WHERE id = ?
        `,
      [
        name === undefined ? currentPet.name : name.trim(),
        type ?? currentPet.type,
        breed === undefined ? currentPet.breed : breed || null,
        gender === undefined ? currentPet.gender : gender || null,
        formattedBirthDate,
        color === undefined ? currentPet.color : color || null,
        chip_number === undefined
          ? currentPet.chip_number
          : chip_number || null,
        photo,
        petId,
      ],
    );

    if (newPhoto && currentPet.photo !== newPhoto) {
      deletePhoto(currentPet.photo);
    }

    const [updatedPets] = await db.query("SELECT * FROM pets WHERE id = ?", [
      petId,
    ]);

    return res.json({
      message: "Дані тварини оновлено",
      pet: updatedPets[0],
    });
  } catch (error) {
    console.error("Помилка редагування тварини:", error);
    deletePhoto(newPhoto);

    return res.status(500).json({
      message: "Помилка редагування тварини",
    });
  }
});

// ======================================
// DELETE /api/pets/:id
// ВИДАЛИТИ ВЛАСНУ ТВАРИНУ АБО ТВАРИНУ ЯК АДМІН
// ======================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const petId = parsePetId(req.params.id);

    if (!petId) {
      return res.status(400).json({
        message: "Некоректний ID тварини",
      });
    }

    const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [petId]);

    if (pets.length === 0) {
      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    const pet = pets[0];

    if (!canManagePet(req, pet)) {
      return res.status(403).json({
        message: "Немає прав для видалення цієї тварини",
      });
    }

    await db.query("DELETE FROM pets WHERE id = ?", [petId]);

    deletePhoto(pet.photo);

    return res.json({
      message: "Тварину видалено",
    });
  } catch (error) {
    console.error("Помилка видалення тварини:", error);

    return res.status(500).json({
      message: "Тварину не вдалося видалити",
    });
  }
});

// ======================================
// ОБРОБКА ПОМИЛОК ЗАВАНТАЖЕННЯ ФОТО
// ======================================

router.use((error, req, res, next) => {
  console.error("Помилка завантаження:", error);

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Фотографія не повинна перевищувати 5 МБ"
        : "Помилка завантаження фотографії";

    return res.status(400).json({ message });
  }

  if (error) {
    return res.status(400).json({
      message: error.message || "Помилка завантаження фотографії",
    });
  }

  return next();
});

module.exports = router;
