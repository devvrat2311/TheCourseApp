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

const markSectionComplete = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        if (!user || !course) {
            return res
                .status(404)
                .json({ message: "User or Course not found" });
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
                console.log(sectionId);
                console.log(moduleEntry.sectionIds.includes(sectionId));
                moduleEntry.sectionIds.map((sectionId) => {
                    console.log(sectionId);
                });
                // console.log(moduleEntry);
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
        console.log(moduleEntry);

        module = course.modules.find(
            (module) => module._id.toString() === moduleId,
        );
        const isModuleComplete =
            moduleEntry.sectionIds.length === module.sections.length;

        if (isModuleComplete) {
            moduleEntry.isCompleted = true;
        }

        await user.save();

        const totalModules = course.modules.length;
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
            user.studentProfile.completedCourses.push(courseId);
            await user.save();
        }

        return res.status(200).json({
            message: "Section marked as completed",
            isModuleComplete,
            isCourseComplete: allModulesCompleted,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const submitQuiz = async (req, res) => {
    const { courseId, sectionIndex } = req.params;
    const userId = req.user.userId;
    const { answers } = req.body; // e.g., ["B", "C", "D"]
    console.log(answers);

    try {
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course || !user) {
            return res
                .status(404)
                .json({ message: "Course or User not found" });
        }

        const section = course.sections[sectionIndex];
        if (!section || !section.quiz || section.quiz.length === 0) {
            return res
                .status(400)
                .json({ message: "No quiz found for this section" });
        }

        const correctAnswers = section.quiz.map((q) => q.correctAnswer);
        const score = answers.reduce(
            (acc, ans, i) => (ans === correctAnswers[i] ? acc + 1 : acc),
            0,
        );

        const passed = score === correctAnswers.length;

        const enrolledCourse = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );

        if (!enrolledCourse) {
            return res
                .status(400)
                .json({ message: "User not enrolled in this course" });
        }

        // Only push quiz score if not already submitted
        const existingScore = enrolledCourse.quizScores.find(
            (qs) => qs.sectionIndex === Number(sectionIndex),
        );

        if (!existingScore) {
            enrolledCourse.quizScores.push({
                sectionIndex: Number(sectionIndex),
                score,
                passed,
            });
        }

        if (
            passed &&
            !enrolledCourse.completedSections.includes(Number(sectionIndex))
        ) {
            enrolledCourse.completedSections.push(Number(sectionIndex));
        }

        await user.save();

        return res.status(200).json({
            message: passed ? "Quiz passed" : "Quiz failed",
            score,
            total: correctAnswers.length,
            passed,
        });
    } catch (err) {
        console.error("Error submitting quiz:", err);
        return res.status(500).json({
            message: "Server error while submitting quiz",
            error: err.message,
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
    console.log(sectionId);
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
            console.log(section._id == sectionId);
        });

        if (!section)
            return res.status(404).json({ message: "Section Not Found" });

        const sectionData = section.modules[0].sections[sectionIndex];
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
    console.log(typeof courseId);
    const moduleId = req.params.moduleId;
    console.log(typeof moduleId);

    try {
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
        // console.log("Logging sections where content is not to be sent");
        // console.log(sections);
        if (!sections)
            return res.status(404).json({ message: "Sections Data Not Found" });

        // const realSections = sections.modules[0].sections;
        return res.status(200).json(sections);
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
            return res.status(200).json({
                id: courseId,
                view: "ongoing",
                title: course.title,
                modules: course.modules,
                completedSections: enrolledCourseEntry.completedSections || [],
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
};
