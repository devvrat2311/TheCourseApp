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
    getModulesForCreatedCourse,
    createModule,
    getSectionsForModule,
    createFreshSection,
    getContentForSection,
    createContentBlock,
    createQuizQuestion,
} = require("../controllers/courseController");

router.use(verifyToken);

//instructor endpoints
router.post("/create", createCourse);
router.get("/my-created-courses", getMyCreatedCourses);
router.get("/:id/modules", getModulesForCreatedCourse);
router.post("/:id/modules/create", createModule);
router.get("/:courseId/modules/:moduleId/sections", getSectionsForModule);
router.post("/:courseId/modules/:moduleId/sections/create", createFreshSection);
router.get(
    "/:courseId/modules/:moduleId/sections/:sectionId/children",
    getContentForSection,
);
router.post(
    "/:courseId/modules/:moduleId/sections/:sectionId/content",
    createContentBlock,
);
router.post(
    "/:courseId/modules/:moduleId/sections/:sectionId/quiz-questions",
    createQuizQuestion,
);
// router.post(
//     "/:courseId/modules/:moduleId/sections/:sectionId/content",
//     async (req, res) => {
//         console.log("wreck dat body", req.body);
//         res.send(req.body);
//     },
// );
// router.post("example", async (req, res) => {
//     console.log(req.body);
//     res.send({ message: "hello" });
// });
// router.post(
//     "/:courseId/modules/:moduleId/sections/create",
//     async (req, res) => {
//         console.log("wreck dat body", req.body);
//         res.send(req.body);
//     },
// );

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
