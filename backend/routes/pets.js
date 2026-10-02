const express = require("express");

const router = express.Router();

const db = require("../config/db");

// GET /api/pets
// Отримати всіх тварин

router.get("/", async (req, res) => {
  try {
    const [pets] = await db.query("SELECT * FROM pets");

    res.json(pets);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання тварин",
    });
  }
});

// GET /api/pets/:id
// Отримати одну тварину

router.get("/:id", async (req, res) => {
  try {
    const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [
      req.params.id,
    ]);

    if (pets.length === 0) {
      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    res.json(pets[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання тварини",
    });
  }
});

// POST /api/pets
// Додати тварину

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      name,
      type,
      breed,
      gender,
      birth_date,
      color,
      chip_number,
      photo,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO pets
      (
        user_id,
        name,
        type,
        breed,
        gender,
        birth_date,
        color,
        chip_number,
        photo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        type,
        breed,
        gender,
        birth_date,
        color,
        chip_number,
        photo,
      ],
    );

    res.status(201).json({
      message: "Тварину додано",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка додавання тварини",
    });
  }
});

// PUT /api/pets/:id
// Редагувати тварину

router.put("/:id", async (req, res) => {
  try {
    const { name, type, breed, gender, birth_date, color, chip_number, photo } =
      req.body;

    // Перевіряємо, чи існує тварина
    const [pets] = await db.query("SELECT * FROM pets WHERE id = ?", [
      req.params.id,
    ]);

    if (pets.length === 0) {
      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    // Перетворюємо дату у формат YYYY-MM-DD
    const formattedBirthDate = birth_date ? birth_date.slice(0, 10) : null;

    // Оновлюємо дані тварини
    await db.query(
      `UPDATE pets
       SET
         name = ?,
         type = ?,
         breed = ?,
         gender = ?,
         birth_date = ?,
         color = ?,
         chip_number = ?,
         photo = ?
       WHERE id = ?`,
      [
        name,
        type,
        breed,
        gender,
        formattedBirthDate,
        color,
        chip_number,
        photo,
        req.params.id,
      ],
    );

    // Отримуємо оновлені дані
    const [updatedPets] = await db.query("SELECT * FROM pets WHERE id = ?", [
      req.params.id,
    ]);

    res.json(updatedPets[0]);
  } catch (error) {
    console.error("Помилка редагування тварини:", error);

    res.status(500).json({
      message: "Помилка редагування тварини",
    });
  }
});

// DELETE /api/pets/:id
// Видалити тварину

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM pets WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Тварину не знайдено",
      });
    }

    res.json({
      message: "Тварину видалено",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Тварину не вдалося видалити",
    });
  }
});

module.exports = router;
