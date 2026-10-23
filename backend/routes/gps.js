
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

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
      console.log(
        `Видалено старих GPS-записів: ${result.affectedRows}`
      );
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
// ПЕРЕВІРКА ДОСТУПУ ДО GPS-ДАНИХ
// ======================================

function canAccessUser(req, userId) {
  const currentUserId = req.user?.id;
  const isAdmin = req.user?.role === "admin";

  return (
    isAdmin ||
    (
      currentUserId !== undefined &&
      currentUserId !== null &&
      String(currentUserId) === String(userId)
    )
  );
}

// ======================================
// ОТРИМАТИ GPS-ІСТОРІЮ КОРИСТУВАЧА
// ======================================

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Некоректний ID користувача",
      });
    }

    // Користувач може переглядати лише власні GPS-дані.
    // Адміністратор може переглядати дані інших користувачів.
    if (!canAccessUser(req, userId)) {
      return res.status(403).json({
        message: "У вас немає доступу до GPS-даних цього користувача",
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
      [userId]
    );

    return res.json(locations);
  } catch (error) {
    console.error("Помилка отримання GPS-історії:", error);

    return res.status(500).json({
      message: "Не вдалося отримати GPS-історію",
    });
  }
});

// ======================================
// ДОДАТИ ДЕМОНСТРАЦІЙНІ GPS-ТОЧКИ
// ======================================

router.post(
  "/demo/user/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          message: "Некоректний ID користувача",
        });
      }

      // Не дозволяємо створювати GPS-точки
      // для чужого облікового запису.
      if (!canAccessUser(req, userId)) {
        return res.status(403).json({
          message: "У вас немає доступу до GPS-даних цього користувача",
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
        [userId]
      );

      let savedCount = 0;

      for (const pet of pets) {
        // Захист від некоректних або відсутніх координат.
        const baseLatitude = Number(pet.latitude);
        const baseLongitude = Number(pet.longitude);

        if (
          !Number.isFinite(baseLatitude) ||
          !Number.isFinite(baseLongitude) ||
          baseLatitude < -90 ||
          baseLatitude > 90 ||
          baseLongitude < -180 ||
          baseLongitude > 180
        ) {
          continue;
        }

        // Це демонстраційні координати, а не реальне відстеження.
        const latitude =
          baseLatitude + (Math.random() - 0.5) * 0.0004;

        const longitude =
          baseLongitude + (Math.random() - 0.5) * 0.0004;

        await db.query(
          `
          INSERT INTO pet_locations
            (pet_id, latitude, longitude, battery)
          VALUES (?, ?, ?, ?)
          `,
          [
            pet.pet_id,
            latitude,
            longitude,
            pet.battery ?? 100,
          ]
        );

        savedCount++;
      }

      return res.json({
        message: "Демонстраційні GPS-точки збережено",
        savedCount,
      });
    } catch (error) {
      console.error("Помилка запису GPS-точок:", error);

      return res.status(500).json({
        message: "Не вдалося зберегти GPS-точки",
      });
    }
  }
);

module.exports = router;
