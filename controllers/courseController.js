const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");

const editCourseInfo = async (req, res) => {
    const { courseId } = req.params;
    const { newTitle, newDescription } = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.title = newTitle;
        course.description = newDescription;

        await course.save();
        return res.status(201).json({
            message: "Module Updated Successfully",
            courseId,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const editModuleInfo = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const { newTitle, newDescription, newLearningObjective } = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const module = course.modules.id(moduleId);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        module.title = newTitle;
        module.description = newDescription;
        module.learningObjective = newLearningObjective;

        await course.save();
        return res.status(201).json({
            message: "Module Updated Successfully",
            moduleId,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const editSectionTitle = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const { newTitle } = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const module = course.modules.id(moduleId);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const section = module.sections.id(sectionId);
        section.title = newTitle;

        await course.save();
        return res.status(201).json({
            message: "Section Updated Successfully",
            sectionId,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const editContentBlock = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const { index, type, text, src, code, alt, language } = req.body;
    // console.log("index found", index + 1);

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // const courseTitle = course.title;

        const module = course.modules.id(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        // const moduleTitle = module.title;

        const section = module.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        const contentBlock = section.content[index];
        // console.log("contentBlock", contentBlock);

        switch (type) {
            case "heading":
            case "subheading":
            case "paragraph":
            case "bullet":
            case "latex":
                // console.log("text");
                contentBlock.text = text;
                break;
            case "image":
                // console.log("image");
                contentBlock.src = src;
                contentBlock.alt = alt;
                break;
            case "code":
                // console.log("code");
                contentBlock.code = code;
                contentBlock.language = language;
                break;
            default:
                break;
        }
        await course.save();
        res.status(200).json({
            message: "ContentBlock updated successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editQuizQuestion = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    // console.log("req.body from editQuizQuestion is: ", req.body);

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // const courseTitle = course.title;

        const module = course.modules.id(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        // const moduleTitle = module.title;

        const section = module.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        // const sectionTitle = section.title;
        const question = section.quiz[req.body.index];
        question.question = req.body.questionData.question;
        question.options = req.body.questionData.options;
        question.correctAnswer = req.body.questionData.correctAnswer;
        await course.save();

        return res
            .status(201)
            .json({ message: "Successfully modified the course" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
};

const createQuizQuestion = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    // console.log("req.body is: ", req.body);

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // const courseTitle = course.title;

        const module = course.modules.id(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        // const moduleTitle = module.title;

        const section = module.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        // const sectionTitle = section.title;
        section.quiz.push(req.body);
        await course.save();

        return res
            .status(201)
            .json({ message: "Successfully modified the course" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
};

const createContentBlock = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    // console.log("req.body is: ", req.body);

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // const courseTitle = course.title;

        const module = course.modules.id(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        // const moduleTitle = module.title;

        const section = module.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        // const sectionTitle = section.title;
        section.content.push(req.body);
        await course.save();

        return res
            .status(201)
            .json({ message: "Successfully modified the course" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
};

const getContentForSection = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const courseTitle = course.title;

        const module = course.modules.id(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        const moduleTitle = module.title;

        const section = module.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }
        const sectionTitle = section.title;

        if (section.sectionType === "normal") {
            // console.log(
            //     "From getContentForSection controller method",
            //     section.content,
            // );
            return res.status(200).json({
                content: section.content,
                contentType: section.sectionType,
                sectionDetails: {
                    courseTitle,
                    moduleTitle,
                    sectionTitle,
                },
            });
        } else if (section.sectionType === "quiz") {
            // console.log(
            //     "From getContentForSection controller method",
            //     section.quiz,
            // );
            return res.status(200).json({
                content: section.quiz,
                contentType: section.sectionType,
                sectionDetails: {
                    courseTitle,
                    moduleTitle,
                    sectionTitle,
                },
            });
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
const createFreshSection = async (req, res) => {
    const { courseId, moduleId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const module = course.modules.id(moduleId);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        module.sections.push(req.body);

        await course.save();
        return res.status(201).json({
            message: "Section Created Successfully",
            sectionId: module.sections[module.sections.length - 1]._id,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const getSectionsForModule = async (req, res) => {
    const { courseId, moduleId } = req.params;

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

        // console.log(result[0]);
        // console.log("course title", result[0].title);
        const sectionDetails = {
            courseTitle: result[0]?.title,
            moduleTitle: result[0]?.modules.title,
        };
        // console.log("sectionDetails", sectionDetails);
        const sections = result[0]?.modules.sections;
        // console.log("sections", sections);
        if (!sections)
            return res.status(404).json({ message: "Sections Data Not Found" });

        return res.status(200).json({ sections, sectionDetails });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};

const createModule = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        const newModule = course.modules.create(req.body);
        course.modules.push(newModule);
        await course.save();
        return res.status(201).json({ newModuleId: newModule._id });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
    }
};

const getModulesForCreatedCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);

        return res.status(200).json({
            modules: course.modules,
            courseTitle: course.title,
        });
    } catch (err) {
        console.log(err.message);
        return res
            .status(500)
            .json({ message: "Server Error", error: err.message });
    }
};

const getMyCreatedCourses = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        const myCreatedCourses = user.teacherProfile.createdCourses;
        //do some more work here to actually return good information
        // for each course
        const myCreatedCoursesProper = await Course.find(
            {
                _id: { $in: myCreatedCourses },
            },
            {
                title: 1,
                description: 1,
                courseStatus: 1,
                enrolledStudents: 1,
                createdAt: 1,
            },
        );
        // console.log(myCreatedCoursesProper);

        return res.status(200).json(myCreatedCoursesProper);
    } catch (err) {
        console.log(err.message);
        return res
            .status(500)
            .json({ message: "Server Error", error: err.message });
    }
};

const createCourse = async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            author: req.user.userFullName,
        });
        await course.save();
        const user = await User.findById(req.user.userId);
        user.teacherProfile.createdCourses.push(course._id);
        await user.save();
        return res.status(201).json({ courseId: course._id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

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
        const completedIds = user.studentProfile.completedCourses.map((c) =>
            c.courseId.toString(),
        );
        console.log("completed IDS", completedIds);
        const completedCoursesData = await Course.find({
            _id: { $in: completedIds },
        }).lean();
        console.log("completed Courses Data", completedCoursesData);

        // Attach course details to each completed entry
        // const completedCourses = user.studentProfile.completedCourses.map(
        //     (entry) => {
        //         const fullCourse = completedCoursesData.find(
        //             (course) =>
        //                 course._id.toString() ===
        //                 (entry._id?.toString() || entry.courseId?.toString()),
        //         );
        //         return {
        //             ...entry,
        //             courseId: fullCourse || null, // attach full course
        //         };
        //     },
        // );

        return res.status(200).json({
            enrolledCourses, // populated already
            completedCoursesData, // now contains full course info
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

        // console.log(currentModuleIndex);
        return res.status(200).json({
            prevModuleId,
            prevSectionId,
            nextModuleId,
            nextSectionId,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
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
            } else {
                moduleEntry.sectionIds.push(sectionId);
            }
        } else {
            //create a entry in the array, a module's first section is pushed
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
            // console.log("all modules is completed now from markSection");
            user.studentProfile.enrolledCourses =
                user.studentProfile.enrolledCourses.filter(
                    (course) => !course.courseId.equals(courseId),
                );
            user.studentProfile.completedCourses.push({
                courseId: courseId,
                completedAt: new Date(),
                certificationUrl: null,
                grade: null,
            });
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
    // console.log("score: ", score, "/", correctAnswers.length);
    return score;
}

const submitQuiz = async (req, res) => {
    const { courseId, moduleId, sectionId } = req.params;
    const userId = req.user.userId;
    const { answers } = req.body;
    // console.log(answers);

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
        // console.log("section is: ", section);
        if (!section || !section.quiz || section.quiz.length === 0) {
            return res
                .status(400)
                .json({ message: "No quiz found for this section" });
        }

        const correctAnswers = section.quiz.map((q) => ({
            question: q.question,
            answer: q.correctAnswer,
        }));
        // console.log("Correct Answers", correctAnswers);
        // console.log("Answers Match?", answersMatch(correctAnswers, answers));
        // console.log("Check Answers", checkAnswers(correctAnswers, answers));

        const score = checkAnswers(correctAnswers, answers);
        const passingPercentage = 80;
        const passingMarks = (passingPercentage * correctAnswers.length) / 100;
        // console.log("passing marks", passingMarks);
        const passed = score >= correctAnswers.length;
        // console.log("passed ? ", passed ? "yes" : "no");

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
            // console.log("all modules completed from quizzes");
            user.studentProfile.enrolledCourses =
                user.studentProfile.enrolledCourses.filter(
                    (course) => !course.courseId.equals(courseId),
                );
            user.studentProfile.completedCourses.push({
                courseId: courseId,
                completedAt: new Date(),
                certificationUrl: null,
                grade: null,
            });
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
    // console.log("sectionId from getSectionById", sectionId);
    const userId = req.user.userId;
    let isSectionCompleted;
    let isCourseCompleted;

    try {
        const userInfo = await User.findById(userId);
        console.log(userInfo.studentProfile);
        isCourseCompleted = userInfo.studentProfile.completedCourses.find(
            (course) => course.courseId.toString() === courseId,
        );
        if (isCourseCompleted) {
            let courseCompleted = true;
            isSectionCompleted = true;
            return res
                .status(200)
                .json({ courseCompleted, isSectionCompleted });
        }
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

        const course = await Course.findById(courseId, {
            modules: {
                $elemMatch: {
                    _id: moduleId,
                },
            },
        });

        const module = course.modules[0];
        // console.log("In da backend");
        // console.log(module[0]);
        var sectionIndex = 0;
        module.sections.map((section, index) => {
            if (section._id == sectionId) {
                sectionIndex = index;
            }
            // console.log(section._id == sectionId);
        });

        if (!course)
            return res.status(404).json({ message: "Section Not Found" });

        const sectionData = module.sections[sectionIndex];

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
        const userFullName = user.fullName;
        const enrolledCourseEntry = user.studentProfile.enrolledCourses.find(
            (c) => c.courseId.toString() === courseId,
        );
        const isEnrolled = Boolean(enrolledCourseEntry);
        const isCompleted = user.studentProfile.completedCourses.some(
            (entry) => entry.courseId.toString() === courseId,
        );

        if (!isEnrolled && !isCompleted) {
            //Not enrolled: preview
            //we can actually get the module names and their learningObjectives and descriptions metadata and return it in another variable for the preview view
            const moduleInfo = course.modules.map((module) => ({
                name: module.title,
                learningObjective: module.learningObjective,
            }));
            return res.status(200).json({
                id: courseId,
                view: "preview",
                title: course.title,
                description: course.description,
                learningObjectives: moduleInfo,
                enrollable: true,
            });
        } else if (isCompleted) {
            // Completed: Completion view
            return res.status(200).json({
                id: courseId,
                view: "completed",
                title: course.title,
                description: course.description,
                certificate: `Congratulations ${userFullName}! You have completed the course ${course.title} from thecourseapp.in`,
                userName: userFullName,
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
        const courses = await Course.find(
            { courseStatus: "published" },
            {
                title: 1,
                description: 1,
                author: 1,
            },
        ).lean();
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
};
