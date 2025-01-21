const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRoutes = require("./routes/loginRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const PORT = 5000;

// Middleware-uri
app.use(cors({
  origin: "http://localhost:3000", // Permite cererile de la frontend
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(bodyParser.json());

// Rute
app.use("/api", loginRoutes);
app.use("/api", evaluationRoutes);
app.use("/api", projectRoutes);

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
