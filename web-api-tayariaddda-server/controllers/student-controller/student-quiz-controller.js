const QuizResult = require("../../models/QuizResult");

const saveQuizResult = async (req, res) => {
    try {
        const { userId, quizId, score, totalQuestions } = req.body;

        const percentage = Math.round((score / totalQuestions) * 100);
        let status = "attempted";

        if (percentage >= 80) {
            status = "pass"; // "Completed" in UI
        } else if (percentage < 40) {
            status = "fail";
        } else {
            status = "attempted"; // "Good Effort" intermediate
        }

        const newResult = new QuizResult({
            userId,
            quizId,
            score,
            totalQuestions,
            percentage,
            status,
            dateTaken: new Date(),
        });

        await newResult.save();

        res.status(201).json({
            success: true,
            message: "Quiz result saved successfully",
            data: newResult,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error saving quiz result",
        });
    }
};

const getStudentQuizResults = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await QuizResult.find({ userId });

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching quiz results",
        });
    }
};

const QuizSet = require("../../models/Quiz");
const Question = require("../../models/Question");

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quizSet = await QuizSet.findById(id).lean();

        if (!quizSet) {
            return res.status(404).json({ success: false, message: "Quiz Set not found" });
        }

        // Fetch questions associated with this quiz set
        const questions = await Question.find({ quizSetId: id }).lean();

        // Combine quiz set data with questions
        res.status(200).json({
            success: true,
            data: {
                ...quizSet,
                questions
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching quiz",
            error: error.message
        });
    }
};

module.exports = { saveQuizResult, getStudentQuizResults, getQuizById };
