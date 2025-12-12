const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { verifyStudent } = require("../middleware/roleMiddleware");
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
    createCourse,
    getMyCreatedCourses,
} = require("../controllers/courseController");

router.use(verifyToken);

//teacher endpoints
router.post("/create-course", createCourse);
router.get("/my-created-courses", getMyCreatedCourses);

//students endpoints
router.get("/my-courses", getMyCourses);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/:id/enroll", enrollInCourse);
router.get("/:courseId/:moduleId/sections/:sectionId", getSectionById);
router.get("/:courseId/:moduleId", getAllSections);
router.post(
    "/:courseId/:moduleId/sections/:sectionId/complete",
    markSectionComplete,
);
router.post("/:courseId/:moduleId/sections/:sectionId/submit-quiz", submitQuiz);
router.get(
    "/:courseId/:moduleId/sections/:sectionId/completed-quiz",
    getCompletedQuizDetails,
);
router.get("/:courseId/:moduleId/sections/:sectionId/next", returnNextSection);

module.exports = router;
