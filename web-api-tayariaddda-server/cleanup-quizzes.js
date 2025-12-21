const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

const MONGODB_URI = "mongodb://localhost:27017/tayariadda-server";

async function cleanupQuizzes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Delete all old quizzes that are NOT Loksewa related
        const oldQuizzes = await Quiz.find({
            title: {
                $nin: [
                    "Loksewa General Knowledge - Part 1",
                    "Nepal Constitution & Governance",
                    "Current Affairs 2024"
                ]
            }
        });

        console.log(`🗑️  Found ${oldQuizzes.length} old quizzes to delete\n`);

        for (const quiz of oldQuizzes) {
            console.log(`   Deleting: ${quiz.title}`);
            // Delete questions for this quiz
            await Question.deleteMany({ quizSetId: quiz._id });
            // Delete the quiz
            await Quiz.deleteOne({ _id: quiz._id });
        }

        console.log("\n✅ Cleanup complete!");

        // Show remaining quizzes
        const remainingQuizzes = await Quiz.find();
        console.log(`\n📊 Remaining quizzes: ${remainingQuizzes.length}`);
        for (const quiz of remainingQuizzes) {
            const questionCount = await Question.countDocuments({ quizSetId: quiz._id });
            console.log(`   ✓ ${quiz.title} (${questionCount} questions)`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n👋 Database connection closed");
    }
}

cleanupQuizzes();
