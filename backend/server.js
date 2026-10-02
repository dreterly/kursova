const express = require("express");
const cors = require("cors");

const petsRoutes = require("./routes/pets");
const announcementsRoutes = require("./routes/announcements");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pets", petsRoutes);
app.use("/api/announcements", announcementsRoutes);

app.get("/", (req, res) => {
  res.send("PETFINDER backend працює!");
});

app.listen(5000, () => {
  console.log("Backend запущено: http://localhost:5000");
});
