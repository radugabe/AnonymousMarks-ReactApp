const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");

// Rute pentru evaluări
router.get("/evaluation-teams/:userId", evaluationController.getEvaluationTeams);
router.post("/assign-mark", evaluationController.assignMark);
router.get("/project-evaluations/:teamId", evaluationController.getProjectEvaluations);

module.exports = router;
