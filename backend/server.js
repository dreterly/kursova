require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const petsRoutes = require("./routes/pets");
const announcementsRoutes = require("./routes/announcements");
const adminRoutes = require("./routes/admin");
const gpsRoutes = require("./routes/gps");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Дозволяємо браузеру відкривати завантажені фотографії
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Маршрути API
app.use("/api/pets", petsRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gps", gpsRoutes);

app.get("/", (req, res) => {
  res.send("PETFINDER backend працює!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PETFINDER backend запущено на порту ${PORT}`);
});
