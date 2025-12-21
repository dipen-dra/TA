const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

const MONGODB_URI = "mongodb://localhost:27017/sikshyalaya";

async function checkQuizzes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get all quizzes
        const quizzes = await Quiz.find();
        console.log(`📊 Total quizzes in database: ${quizzes.length}\n`);

        for (const quiz of quizzes) {
            const questionCount = await Question.countDocuments({ quizSetId: quiz._id });
            console.log(`📝 ${quiz.title}`);
            console.log(`   Category: ${quiz.category}`);
            console.log(`   Questions: ${questionCount}`);
            console.log(`   ID: ${quiz._id}\n`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

checkQuizzes();
