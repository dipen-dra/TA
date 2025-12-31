require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/tayariadda-server";

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected for global seeding"))
    .catch((err) => console.error("MongoDB connection error:", err));

const seedAllbooks = async () => {
    try {
        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses.`);

        for (const course of courses) {
            if (course.curriculum && course.curriculum.length > 0) {
                // Add to the first lecture of EVERY course
                course.curriculum[0].recommendedBooks = [
                    {
                        title: "React Design Patterns",
                        author: "Test User",
                        coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
                        bookUrl: "https://pdfobject.com/pdf/sample.pdf", // Multi-page sample (3 pages)
                        description: "A seed book for testing."
                    }
                ];
                await course.save();
                console.log(`Added book to: ${course.title}`);
            }
        }
    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedAllbooks();
