const express = require("express");
const {
    saveQuizResult,
    getStudentQuizResults,
    getQuizById,
} = require("../../controllers/student-controller/student-quiz-controller");

const router = express.Router();

router.post("/submit", saveQuizResult);
router.get("/get/:id", getQuizById);
router.get("/results/:userId", getStudentQuizResults);

module.exports = router;
