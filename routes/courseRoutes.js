const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    enrollInCourse,
    getAllCourses,
    getCourseById,
    markSectionComplete,
    submitQuiz,
    getMyCourses,
} = require("../controllers/courseController");

router.get("/my-courses", verifyToken, getMyCourses);
router.get("/", verifyToken, getAllCourses);
router.get("/:id", verifyToken, getCourseById);
router.post("/:id/enroll", verifyToken, enrollInCourse);
router.post(
    "/:courseId/section/:sectionIndex/complete",
    verifyToken,
    markSectionComplete,
);
router.post("/:courseId/section/:sectionIndex/quiz", verifyToken, submitQuiz);

module.exports = router;
