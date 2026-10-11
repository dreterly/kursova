const express = require("express");
const router = express.Router();

const db = require("../config/db");

// ======================================
// ОЧИЩЕННЯ СТАРИХ GPS-ЗАПИСІВ
// ======================================

async function cleanupOldLocations() {
  try {
    const [result] = await db.query(`
      DELETE FROM pet_locations
      WHERE recorded_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    if (result.affectedRows > 0) {
      console.log(`Видалено старих GPS-записів: ${result.affectedRows}`);
    }
  } catch (error) {
    console.error("Помилка очищення GPS-історії:", error);
  }
}

// Очищення під час запуску сервера
cleanupOldLocations();

// Повторне очищення кожні 24 години
setInterval(cleanupOldLocations, 24 * 60 * 60 * 1000);

// ======================================
// ОТРИМАТИ GPS-ІСТОРІЮ КОРИСТУВАЧА
// ======================================

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Некоректний ID користувача",
      });
    }

    const [locations] = await db.query(
      `
      SELECT
        pets.id AS pet_id,
        pets.name,
        pets.type,
        pets.breed,
        pets.chip_number,
        pet_locations.latitude,
        pet_locations.longitude,
        pet_locations.battery,
        pet_locations.recorded_at
      FROM pets
      INNER JOIN pet_locations
        ON pets.id = pet_locations.pet_id
      WHERE pets.user_id = ?
        AND pets.is_own = TRUE
      ORDER BY
        pets.id,
        pet_locations.recorded_at ASC
      `,
      [userId],
    );

    res.json(locations);
  } catch (error) {
    console.error("Помилка отримання GPS-історії:", error);

    res.status(500).json({
      message: "Не вдалося отримати GPS-історію",
    });
  }
});

// ======================================
// ДОДАТИ ДЕМОНСТРАЦІЙНІ GPS-ТОЧКИ
// ======================================

router.post("/demo/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Некоректний ID користувача",
      });
    }

    const [pets] = await db.query(
      `
      SELECT
        p.id AS pet_id,
        (
          SELECT pl.latitude
          FROM pet_locations pl
          WHERE pl.pet_id = p.id
          ORDER BY pl.recorded_at DESC, pl.id DESC
          LIMIT 1
        ) AS latitude,
        (
          SELECT pl.longitude
          FROM pet_locations pl
          WHERE pl.pet_id = p.id
          ORDER BY pl.recorded_at DESC, pl.id DESC
          LIMIT 1
        ) AS longitude,
        (
          SELECT pl.battery
          FROM pet_locations pl
          WHERE pl.pet_id = p.id
          ORDER BY pl.recorded_at DESC, pl.id DESC
          LIMIT 1
        ) AS battery
      FROM pets p
      WHERE p.user_id = ?
        AND p.is_own = TRUE
        AND EXISTS (
          SELECT 1
          FROM pet_locations pl
          WHERE pl.pet_id = p.id
        )
      `,
      [userId],
    );

    let savedCount = 0;

    for (const pet of pets) {
      // Невелике зміщення для демонстрації руху.
      // Це НЕ реальні GPS-координати.
      const latitude = Number(pet.latitude) + (Math.random() - 0.5) * 0.0004;

      const longitude = Number(pet.longitude) + (Math.random() - 0.5) * 0.0004;

      await db.query(
        `
        INSERT INTO pet_locations
          (pet_id, latitude, longitude, battery)
        VALUES (?, ?, ?, ?)
        `,
        [pet.pet_id, latitude, longitude, pet.battery ?? 100],
      );

      savedCount++;
    }

    res.json({
      message: "Демонстраційні GPS-точки збережено",
      savedCount,
    });
  } catch (error) {
    console.error("Помилка запису GPS-точок:", error);

    res.status(500).json({
      message: "Не вдалося зберегти GPS-точки",
    });
  }
});

module.exports = router;
