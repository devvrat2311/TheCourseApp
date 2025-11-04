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
    getSectionById,
    getAllSections,
} = require("../controllers/courseController");

router.get("/my-courses", verifyToken, getMyCourses);
router.get("/", verifyToken, getAllCourses);
router.get("/:id", verifyToken, getCourseById);
router.post("/:id/enroll", verifyToken, enrollInCourse);
router.get(
    "/:courseId/:moduleId/sections/:sectionId",
    verifyToken,
    getSectionById,
);
router.get("/:courseId/:moduleId", verifyToken, getAllSections);
router.post(
    "/:courseId/:moduleId/sections/:sectionId/complete",
    verifyToken,
    markSectionComplete,
);
// router.post("/:courseId/section/:sectionIndex/quiz", verifyToken, submitQuiz);

module.exports = router;
