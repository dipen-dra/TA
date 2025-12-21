const express = require("express");
const {
    saveQuizResult,
    getStudentQuizResults,
} = require("../../controllers/student-controller/student-quiz-controller");

const router = express.Router();

router.post("/submit", saveQuizResult);
router.get("/results/:userId", getStudentQuizResults);

module.exports = router;
