require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("./config/db");

async function migratePasswords() {
  try {
    const [users] = await db.query("SELECT id, password FROM users");

    for (const user of users) {
      const password = user.password;

      // Пропускаємо паролі, що вже мають формат bcrypt
      if (/^\$2[aby]\$\d{2}\$/.test(password)) {
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        user.id,
      ]);

      console.log(`Пароль користувача ID ${user.id} захешовано`);
    }

    console.log("Міграцію завершено");
  } catch (error) {
    console.error("Помилка міграції:", error);
  } finally {
    await db.end();
  }
}

migratePasswords();
