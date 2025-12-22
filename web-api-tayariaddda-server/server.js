require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/auth-routes/index");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorQuizRoutes = require("./routes/instructor-routes/quiz-routes");
const instructorQuestionRoutes = require("./routes/instructor-routes/question-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentQuizRoutes = require("./routes/student-routes/student-quiz-routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tayariadda-server";

// ✅ Asynchronous function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit if database connection fails
  }
}

// 🔄 Call the function only if NOT in test mode
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// ✅ Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend Server is Running!");
});


// ✅ Routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/quiz", instructorQuizRoutes);
app.use("/instructor/question", instructorQuestionRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/quiz", studentQuizRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// 🔄 Start the server (Only in non-test environments)
let server;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Accessible via: http://localhost:${PORT} (for local testing)`);
  console.log(`🚀 Use 'ngrok http ${PORT}' to expose publicly`);
});




// ✅ Export `app` and `server` for testing
module.exports = { app, server, connectDB };
