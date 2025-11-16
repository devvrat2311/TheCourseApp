const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");

const getMyCourses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId)
            .populate("studentProfile.enrolledCourses.courseId") // populates course data in enrolled
            .lean(); // convert to plain JS object for easier manipulation

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const enrolledCourses = user.studentProfile.enrolledCourses;

        // Now manually fetch full course details for completedCourses
        const completedIds = user.studentProfile.completedCourses.map(
            (c) => c._id || c.courseId || c,
        );
        const completedCoursesData = await Course.find({
            _id: { $in: completedIds },
        }).lean();

        // Attach course details to each completed entry
        const completedCourses = user.studentProfile.completedCourses.map(
            (entry) => {
                const fullCourse = completedCoursesData.find(
                    (course) =>
                        course._id.toString() ===
                        (entry._id?.toString() || entry.courseId?.toString()),
                );
                return {
                    ...entry,
                    courseId: fullCourse || null, // attach full course
                };
            },
        );

        return res.status(200).json({
            enrolledCourses, // populated already
            completedCourses, // now contains full course info
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to fetch courses",
            error: err.message,
        });
    }
};
const returnNextSection = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;

    try {
        const course = await Course.findById(courseId);

        //all modules in this course
        const modules = course.modules;

        //total modules in course
        const totalModules = modules.length;

        //current module object
        const currentModule = modules.find(
            (module) => module._id.toString() === moduleId,
        );
        //current module index
        const currentModuleIndex = modules.findIndex(
            (module) => module._id.toString() === moduleId,
        );

        //sections in current module ( array )
        const sectionsInThisModule = currentModule.sections;
        //total sections in current module
        const totalSections = sectionsInThisModule.length;
        //current sections index
        const currentSectionIndex = sectionsInThisModule.findIndex(
            (section) => section._id.toString() === sectionId,
        );

        let nextSectionId;
        let prevSectionId;

        let nextModuleId;
        let prevModuleId;

        const isLastSection = currentSectionIndex + 1 === totalSections;
        const isLastModule = currentModuleIndex + 1 === totalModules;

        if (isLastSection && isLastModule) {
            nextSectionId = null;
            nextModuleId = null;
        } else if (isLastSection && !isLastModule) {
            const nextModule = modules[currentModuleIndex + 1];
            // console.log("nextModule from second block", nextModule);
            const nextSection = nextModule.sections[0];
            nextSectionId = nextSection._id;
            nextModuleId = nextModule._id;
        } else {
            const nextSection = sectionsInThisModule[currentSectionIndex + 1];
            nextSectionId = nextSection._id;
            nextModuleId = currentModule._id;
        }

        //pretty confident about this piece of code, that its not going to be leaking anywhere
        const isFirstSection = currentSectionIndex === 0;
        const isFirstModule = currentModuleIndex === 0;
        if (isFirstSection && isFirstModule) {
            prevSectionId = null;
            prevModuleId = null;
        } else if (isFirstSection && !isFirstModule) {
            //get the previous module first
            const prevModule = modules[currentModuleIndex - 1];
            const prevModuleLen = prevModule.sections.length;
            const lastSection = prevModule.sections[prevModuleLen - 1];
            prevSectionId = lastSection._id;
            prevModuleId = prevModule._id;
        } else {
            const prevSection = sectionsInThisModule[currentSectionIndex - 1];
            prevSectionId = prevSection._id;
            prevModuleId = currentModule._id;
        }

        console.log(currentModuleIndex);
        res.status(200).json({
            prevModuleId,
            prevSectionId,
            nextModuleId,
            nextSectionId,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

const markSectionComplete = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        if (!user || !course) {
            return res
                .status(404)
                .json({ message: "User or Course/Module not found" });
        }
        const enrolledCourse = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );

        if (!enrolledCourse) {
            return res
                .status(400)
                .json({ message: "User not enrolled in course" });
        }

        let moduleEntry = enrolledCourse.completedSections.find(
            (item) => item.moduleId.toString() === moduleId,
        );

        if (moduleEntry) {
            if (moduleEntry.sectionIds.includes(sectionId)) {
                return res
                    .status(200)
                    .json({ message: "Section already completed" });
            }
            moduleEntry.sectionIds.push(sectionId);
        } else {
            enrolledCourse.completedSections.push({
                moduleId,
                sectionIds: [sectionId],
                isCompleted: false,
            });
            moduleEntry =
                enrolledCourse.completedSections[
                    enrolledCourse.completedSections.length - 1
                ];
        }
        console.log("from markSectionComplete, moduleEntry is", moduleEntry);

        const module = course.modules.find(
            (module) => module._id.toString() === moduleId,
        );
        const isModuleComplete =
            moduleEntry.sectionIds.length === module.sections.length;

        if (isModuleComplete) {
            moduleEntry.isCompleted = true;
        }
        const completedSections = moduleEntry.sectionIds;

        await user.save();

        // const totalModules = course.modules.length;
        const allModulesCompleted = course.modules.every((module) => {
            const entry = enrolledCourse.completedSections.find(
                (item) => item.moduleId.toString() === module._id.toString(),
            );
            return entry && entry.isCompleted;
        });

        if (
            allModulesCompleted &&
            !user.studentProfile.completedCourses.includes(courseId)
        ) {
            console.log("all modules is completed now from markSection");
            user.studentProfile.completedCourses.push(courseId);
            await user.save();
        }

        return res.status(200).json({
            completedSections,
            message: "Section marked as completed",
            messageModule: isModuleComplete
                ? "Module Complete"
                : "Module not complete",
            messageCourse: allModulesCompleted
                ? "Course Complete"
                : "Course not complete",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

function answersMatch(correctAnswers, answers) {
    if (correctAnswers.length !== answers.length) return false;

    return correctAnswers.every((correct, index) => {
        return (
            correct.question === answers[index].question &&
            correct.answer === answers[index].answer
        );
    });
}

function checkAnswers(correctAnswers, answers) {
    if (correctAnswers.length !== answers.length) return -1;

    let score = 0;
    for (let i = 0; i < correctAnswers.length; ++i) {
        if (correctAnswers[i].answer === answers[i].answer) {
            score++;
        }
    }
    console.log("score: ", score, "/", correctAnswers.length);
    return score;
}

const submitQuiz = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const userId = req.user.userId;
    const { answers } = req.body;
    console.log(answers);

    try {
        const course = await Course.findById(courseId);
        // console.log(course);
        const user = await User.findById(userId);

        if (!course || !user) {
            return res
                .status(404)
                .json({ message: "Course or User not found" });
        }
        const currentModule = course.modules.find(
            (module) => module._id.toString() === moduleId,
        );
        // console.log("Current Module", currentModule);
        const section = currentModule.sections.find(
            (section) => section._id.toString() === sectionId,
        );
        console.log("section is: ", section);
        if (!section || !section.quiz || section.quiz.length === 0) {
            return res
                .status(400)
                .json({ message: "No quiz found for this section" });
        }

        const correctAnswers = section.quiz.map((q) => ({
            question: q.question,
            answer: q.correctAnswer,
        }));
        console.log("Correct Answers", correctAnswers);
        console.log("Answers Match?", answersMatch(correctAnswers, answers));
        console.log("Check Answers", checkAnswers(correctAnswers, answers));

        const score = checkAnswers(correctAnswers, answers);
        const passingPercentage = 80;
        const passingMarks = (passingPercentage * correctAnswers.length) / 100;
        console.log("passing marks", passingMarks);
        const passed = score >= correctAnswers.length;
        console.log("passed ? ", passed ? "yes" : "no");

        const enrolledCourse = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );

        if (!enrolledCourse) {
            return res
                .status(400)
                .json({ message: "User not enrolled in this course" });
        }

        let moduleEntry = enrolledCourse.completedSections.find(
            (item) => item.moduleId.toString() === moduleId,
        );

        // Only push quiz score if not already submitted
        const existingScore = enrolledCourse.quizScores.find(
            (qs) => qs.sectionId.toString() === sectionId,
        );

        let isModuleComplete = false;
        //only push score if not already submitted and quiz is passed, no need to save failed attempts
        if (!existingScore && passed) {
            enrolledCourse.quizScores.push({
                moduleId: moduleId,
                sectionId: sectionId,
                score,
                maxMarks: correctAnswers.length,
            });
            if (moduleEntry) {
                if (moduleEntry.sectionIds.includes(sectionId)) {
                    return res
                        .status(200)
                        .json({ message: "Section already completed" });
                }
                moduleEntry.sectionIds.push(sectionId);
            } else {
                enrolledCourse.completedSections.push({
                    moduleId,
                    sectionIds: [sectionId],
                    isCompleted: false,
                });
                moduleEntry =
                    enrolledCourse.completedSections[
                        enrolledCourse.completedSections.length - 1
                    ];
            }
            isModuleComplete =
                moduleEntry.sectionIds.length === currentModule.sections.length;

            if (isModuleComplete) {
                moduleEntry.isCompleted = true;
            }
        } else if (!passed) {
            return res.status(200).json({
                message: passed ? "Quiz passed" : "Quiz failed",
                score,
                total: correctAnswers.length,
                passed,
            });
        }

        await user.save();

        const completedSections = moduleEntry?.sectionIds || [];

        const allModulesCompleted = course.modules.every((module) => {
            const entry = enrolledCourse.completedSections.find(
                (item) => item.moduleId.toString() === module._id.toString(),
            );
            return entry && entry.isCompleted;
        });

        if (
            allModulesCompleted &&
            !user.studentProfile.completedCourses.includes(courseId)
        ) {
            console.log("all modules completed from quizzes");
            user.studentProfile.completedCourses.push(courseId);
            await user.save();
        }

        return res.status(200).json({
            completedSections,
            messagePassed: passed ? "Quiz passed" : "Quiz failed",
            messageSection: "Section Marked as completed",
            score,
            total: correctAnswers.length,
            passed,
            messageModule: isModuleComplete
                ? "Module Complete"
                : "Module not complete",
            messageCourse: allModulesCompleted
                ? "Course Complete"
                : "Course not complete",
        });
    } catch (err) {
        console.error("Error submitting quiz:", err);
        return res.status(500).json({
            message: "Server error while submitting quiz",
            error: err.message,
        });
    }
};

const getCompletedQuizDetails = async (req, res) => {
    const userId = req.user.userId;
    const { courseId, moduleId, sectionId } = req.params;

    try {
        const user = await User.findById(userId);
        const enrolledCourseUser = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );
        const course = await Course.findById(courseId, {
            modules: {
                $elemMatch: {
                    _id: moduleId,
                },
            },
        });
        const module = course.modules[0];
        const quizSection = module.sections.find(
            (section) => section._id.toString() === sectionId,
        );
        if (quizSection.sectionType != "quiz") {
            return res.status(200).json({ message: "not a quiz Section" });
        }
        // console.log(
        //     "from getCompletedQuizDetails, quizSection is: ",
        //     quizSection,
        // );
        const quizScore = enrolledCourseUser.quizScores.find(
            (score) => score.sectionId.toString() === sectionId,
        );
        // console.log(
        //     "from getCompletedQuizDetails, userData about quizMarks is: ",
        //     quizScore,
        // );

        return res.status(200).json({
            quizSection,
            quizScore,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err,
        });
    }
};

const enrollInCourse = async (req, res) => {
    const userId = req.user.userId;
    const courseId = req.params.id;

    try {
        //check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        //Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //Check if already enrolled
        const alreadyEnrolled = user.studentProfile.enrolledCourses.some(
            (c) => c.courseId.toString() === courseId,
        );
        if (alreadyEnrolled) {
            return res
                .status(400)
                .json({ message: "Already enrolled in this course" });
        }

        //Now add course to user's enrolledCourses
        user.studentProfile.enrolledCourses.push({
            courseId: courseId,
            status: "enrolled",
            progress: 0,
            enrolledAt: new Date(),
        });

        //Also add student to course's enrolledStudents
        course.enrolledStudents.push(user._id);

        //save borth
        await user.save();
        await course.save();

        return res.status(200).json({
            message: "Successfully enrolled in course",
            courseId,
        });
    } catch (err) {
        console.error("Enroll error: ", err);
        return res.status(500).json({
            message: "Server error while enrolling",
            error: err.message,
        });
    }
};

/*
the function getCourseById needs only to return the course being queried along with
all its modules array, in its modules array the sections themselves shouldn't be there
instead only metadata for these sections need to be present.
 */

const getSectionById = async (req, res) => {
    const courseId = req.params.courseId;
    const moduleId = req.params.moduleId;
    const sectionId = req.params.sectionId;
    console.log("sectionId from getSectionById", sectionId);
    const userId = req.user.userId;
    let isSectionCompleted;

    try {
        const userInfo = await User.findById(userId);
        // console.log(userInfo.studentProfile);
        const userCourseInfo = userInfo.studentProfile.enrolledCourses.find(
            (course) => course.courseId.toString() === courseId,
        );
        // console.log("Hello this courseInfo", userCourseInfo);
        if (userCourseInfo) {
            const moduleInfo = userCourseInfo.completedSections.find(
                (module) => module.moduleId.toString() === moduleId,
            );
            // console.log("Module Info", moduleInfo);
            if (moduleInfo) {
                const sectionComplete = moduleInfo.sectionIds.find(
                    (sectId) => sectId.toString() === sectionId,
                );
                if (sectionComplete) {
                    isSectionCompleted =
                        sectionComplete.toString() === sectionId;
                }
            }
        }
        // console.log("section is complete", isSectionCompleted);

        const section = await Course.findById(courseId, {
            modules: {
                $elemMatch: {
                    _id: moduleId,
                },
            },
        });

        const module = section.modules;
        // console.log("In da backend");
        // console.log(module[0]);
        var sectionIndex = 0;
        module[0].sections.map((section, index) => {
            if (section._id == sectionId) {
                sectionIndex = index;
            }
            // console.log(section._id == sectionId);
        });

        if (!section)
            return res.status(404).json({ message: "Section Not Found" });

        const sectionData = section.modules[0].sections[sectionIndex];
        // console.log("sectiondata from getSectionById", sectionData);
        // console.log(typeof sectionData);

        if (sectionData.sectionType === "quiz") {
            const sanitizedSection = {
                sectionId: sectionData._id,
                title: sectionData.title,
                sectionType: sectionData.sectionType,
                quiz: sectionData.quiz.map((q) => ({
                    question: q.question,
                    options: q.options,
                    _id: q._id,
                })),
            };

            return res
                .status(200)
                .json({ sanitizedSection, isSectionCompleted });
        }

        return res.status(200).json({ sectionData, isSectionCompleted });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const getAllSections = async (req, res) => {
    const courseId = req.params.courseId;
    const moduleId = req.params.moduleId;
    const userId = req.user.userId;
    // console.log("userid from getAllSections", userId);

    try {
        const user = await User.findById(userId);
        // console.log("user from getAllSections", user._id);
        const enrolledCourse = user.studentProfile.enrolledCourses.find(
            (course) => course.courseId.toString() === courseId,
        );
        // console.log("enrolledCourse from getAllSections", enrolledCourse);
        const currentModule = enrolledCourse.completedSections.find(
            (item) => item.moduleId.toString() === moduleId,
        );
        // console.log("currentModule from getAllSections", currentModule);
        const sectionsCompleted = currentModule?.sectionIds || [];
        // console.log("sectionsCompleted from getAllSections", sectionsCompleted);
        const result = await Course.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            { $unwind: "$modules" },
            {
                $match: {
                    "modules._id": new mongoose.Types.ObjectId(moduleId),
                },
            },
            {
                $project: {
                    "modules.sections.content": 0,
                    "modules.sections.quiz": 0,
                },
            },
        ]);

        const sections = result[0]?.modules;
        if (!sections)
            return res.status(404).json({ message: "Sections Data Not Found" });

        return res
            .status(200)
            .json({ allSections: sections, sectionsCompleted });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const getCourseById = async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user.userId;

    try {
        const course = await Course.findById(courseId)
            .select("-modules.sections.content -modules.sections.quiz")
            .lean();

        if (!course)
            return res.status(404).json({ message: "Course Not Found" });

        const user = await User.findById(userId);
        const enrolledCourseEntry = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );
        const isEnrolled = Boolean(enrolledCourseEntry);
        const isCompleted = user.studentProfile.completedCourses.some(
            (entry) => entry._id.toString() === courseId,
        );
        if (!isEnrolled && !isCompleted) {
            //Not enrolled: preview preview
            return res.status(200).json({
                id: courseId,
                view: "preview",
                title: course.title,
                description: course.description,
                enrollable: true,
            });
        } else if (isCompleted) {
            // Completed: Completion view
            return res.status(200).json({
                id: courseId,
                view: "completed",
                title: course.title,
                certificate: `Congratulations, you completed the course ${course.title}`,
            });
        } else {
            const completedModuleIds = enrolledCourseEntry.completedSections
                .filter((section) => section.isCompleted)
                .map((section) => section.moduleId.toString());
            return res.status(200).json({
                id: courseId,
                view: "ongoing",
                title: course.title,
                modules: course.modules,
                completedModules: completedModuleIds,
                quizScores: enrolledCourseEntry.quizScores || [],
            });
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({
            message: "failed to fetch courses",
            error: err.message,
        });
    }
};

module.exports = {
    enrollInCourse,
    getCourseById,
    getAllCourses,
    markSectionComplete,
    submitQuiz,
    getMyCourses,
    getSectionById,
    getAllSections,
    getCompletedQuizDetails,
    returnNextSection,
};
