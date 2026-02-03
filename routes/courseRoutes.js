const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
    verifyStudent,
    verifyInstructor,
} = require("../middleware/roleMiddleware");
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
    editContentBlock,
    editQuizQuestion,

    editSectionTitle,
    editModuleInfo,
    editCourseInfo,

    reorderModules,
    reorderSections,
    reorderContentBlocks,
    reorderQuizQuestions,
} = require("../controllers/courseController");

router.use(verifyToken);

//instructor endpoints
//Endpoints which follow RESTful conventions
router.get("/:id/modules", verifyInstructor, getModulesForCreatedCourse);

//patch
router.patch("/:courseId/", verifyInstructor, editCourseInfo);
router.patch("/:courseId/modules/:moduleId/", verifyInstructor, editModuleInfo);
router.patch(
    "/:courseId/modules/:moduleId/sections/:sectionId",
    verifyInstructor,
    editSectionTitle,
);

router.post("/create", verifyInstructor, createCourse);
router.get("/my-created-courses", verifyInstructor, getMyCreatedCourses);
router.post("/:id/modules/create", verifyInstructor, createModule);
router.get(
    "/:courseId/modules/:moduleId/sections",
    verifyInstructor,
    getSectionsForModule,
);
router.post(
    "/:courseId/modules/:moduleId/sections/create",
    verifyInstructor,
    createFreshSection,
);
router.get(
    "/:courseId/modules/:moduleId/sections/:sectionId/children",
    verifyInstructor,
    getContentForSection,
);
router.post(
    "/:courseId/modules/:moduleId/sections/:sectionId/content",
    verifyInstructor,
    createContentBlock,
);
router.post(
    "/:courseId/modules/:moduleId/sections/:sectionId/quiz-questions",
    verifyInstructor,
    createQuizQuestion,
);

router.patch(
    "/:courseId/modules/:moduleId/sections/:sectionId/content",
    verifyInstructor,
    editContentBlock,
);
router.patch(
    "/:courseId/modules/:moduleId/sections/:sectionId/quiz-questions",
    verifyInstructor,
    editQuizQuestion,
);

//students endpoints
router.get("/my-courses", verifyStudent, getMyCourses);
router.get("/", verifyStudent, getAllCourses);
router.get("/:id", verifyStudent, getCourseById);
router.post("/:id/enroll", verifyStudent, enrollInCourse);
router.get(
    "/:courseId/:moduleId/sections/:sectionId",
    verifyStudent,
    getSectionById,
);
router.get("/:courseId/:moduleId", verifyStudent, getAllSections);
router.post(
    "/:courseId/:moduleId/sections/:sectionId/complete",
    verifyStudent,
    markSectionComplete,
);
router.post(
    "/:courseId/:moduleId/sections/:sectionId/submit-quiz",
    verifyStudent,
    submitQuiz,
);
router.get(
    "/:courseId/:moduleId/sections/:sectionId/completed-quiz",
    verifyStudent,
    getCompletedQuizDetails,
);
router.get(
    "/:courseId/:moduleId/sections/:sectionId/next",
    verifyStudent,
    returnNextSection,
);

module.exports = router;
