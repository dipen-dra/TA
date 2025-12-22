
const express = require("express");
const {
    createQuizSet,
    getAllQuizSets,
    getQuizSetsByCategory,
    deleteQuizSet,
    getQuizSetById,
    updateQuizSet
} = require("../../controllers/instructor-controller/quiz-controller");

const router = express.Router();

router.post("/create", createQuizSet);
router.get("/", getAllQuizSets);
router.get("/get/:id", getQuizSetById); // New route
router.put("/update/:id", updateQuizSet); // New route
router.get("/category/:category", getQuizSetsByCategory);
router.delete("/delete/:id", deleteQuizSet);

module.exports = router;
