const express = require("express");
const {
  getCoursesByStudentId,
  enrollStudentInCourse,
  getStudentWeeklyActivity,
  getStudentStats
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.get("/activity/:studentId", getStudentWeeklyActivity);
router.get("/stats/:studentId", getStudentStats);
router.post("/enroll", enrollStudentInCourse);

module.exports = router;
