require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/tayariadda-server";

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected for seeding"))
    .catch((err) => console.error("MongoDB connection error:", err));

const seedBook = async () => {
    try {
        // Find the most recently updated course to ensure it's likely one the user is looking at
        const course = await Course.findOne().sort({ date: -1 });

        if (!course) {
            console.log("No courses found to seed.");
            return;
        }

        if (course.curriculum && course.curriculum.length > 0) {
            const targetLecture = course.curriculum[0];

            targetLecture.recommendedBooks = [
                {
                    title: "Learning React Patterns",
                    author: "Community",
                    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
                    bookUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf", // Simple sample for test
                    description: "A comprehensive guide to modern React patterns and best practices."
                }
            ];

            await course.save();
            console.log(`Successfully added book to course: "${course.title}", Lecture: "${targetLecture.title}"`);
        } else {
            console.log("Course found but has no lectures.");
        }

    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedBook();
