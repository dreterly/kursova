const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const petsRoutes = require("./routes/pets");
const announcementsRoutes = require("./routes/announcements");
const adminRoutes = require("./routes/admin");
const gpsRoutes = require("./routes/gps");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/pets", petsRoutes);

app.use("/api/announcements", announcementsRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/gps", gpsRoutes);

app.get("/", (req, res) => {
  res.send("PETFINDER backend працює!");
});

app.listen(5000, () => {
  console.log("Backend запущено: http://localhost:5000");
});
