
const express = require("express");
const router = express.Router();

const db = require("../config/db");

// Отримати всю історію GPS власних тварин користувача
router.get("/user/:userId", async (req, res) => {
  try {
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
      [req.params.userId],
    );

    res.json(locations);
  } catch (error) {
    console.error("Помилка отримання GPS-історії:", error);

    res.status(500).json({
      message: "Не вдалося отримати GPS-історію",
    });
  }
});

module.exports = router;
