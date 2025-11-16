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
    getCompletedQuizDetails,
    returnNextSection,
} = require("../controllers/courseController");

// router.get("/:courseId/:moduleId/sections/:sectionId/next", returnNextSection);

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
router.post(
    "/:courseId/:moduleId/sections/:sectionId/submit-quiz",
    verifyToken,
    submitQuiz,
);
router.get(
    "/:courseId/:moduleId/sections/:sectionId/completed-quiz",
    verifyToken,
    getCompletedQuizDetails,
);
router.get(
    "/:courseId/:moduleId/sections/:sectionId/next",
    verifyToken,
    returnNextSection,
);

module.exports = router;
