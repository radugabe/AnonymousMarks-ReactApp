const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Rutele existente (ex. pentru update)
router.post("/update-project", projectController.updateProject);

// Rută pentru a obține toate proiectele
router.get("/projects", projectController.getAllProjects);

router.get("/user-project/:userId", projectController.getUserProject);

module.exports = router;
