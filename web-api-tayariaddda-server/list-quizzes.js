const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

const MONGODB_URI = "mongodb://localhost:27017/sikshyalaya";

async function listAllQuizzes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        console.log(`📊 Total quizzes: ${quizzes.length}\n`);

        for (const quiz of quizzes) {
            const questions = await Question.countDocuments({ quizSetId: quiz._id });
            console.log(`📝 ${quiz.title}`);
            console.log(`   ID: ${quiz._id}`);
            console.log(`   Category: ${quiz.category}`);
            console.log(`   Questions: ${questions}`);
            console.log(`   Created: ${quiz.createdAt}\n`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

listAllQuizzes();
