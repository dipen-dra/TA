const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    status: { type: String, enum: ["pass", "fail", "attempted"], default: "attempted" },
    dateTaken: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
