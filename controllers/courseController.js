const Course = require("../models/Course");
const User = require("../models/User");

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

const getMyCourses2 = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId)
            .populate("studentProfile.enrolledCourses.courseId")
            .populate("studentProfile.completedCourses.courseId");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const enrolledCourses = user.studentProfile.enrolledCourses
            .filter((c) => c.status !== "completed")
            .map((entry) => ({
                ...entry.toObject(),
                course: entry.courseId,
            }));

        const completedCourses = user.studentProfile.completedCourses.map(
            (entry) => ({
                ...entry.toObject(),
                course: entry.courseId,
            }),
        );

        res.status(200).json({
            ongoingCourses: enrolledCourses,
            completedCourses: completedCourses,
        });
    } catch (err) {
        console.error("Error fetching my courses:", err.message);
        res.status(500).json({
            message: "Failed to fetch user's courses",
            error: err.message,
        });
    }
};

const markSectionComplete = async (req, res) => {
    const { courseId, sectionIndex } = req.params;
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

        const sectionIdx = Number(sectionIndex);

        if (!enrolledCourse.completedSections.includes(sectionIdx)) {
            enrolledCourse.completedSections.push(sectionIdx);
            // await user.save();
        }

        const totalSections = course.sections.length;
        const completedCount = enrolledCourse.completedSections.length;

        let courseJustCompleted = false;
        if (completedCount === totalSections) {
            //move to completedCourses in User.studentProfile
            user.studentProfile.completedCourses.push(courseId);

            //remove from enrolledCourses
            user.studentProfile.enrolledCourses =
                user.studentProfile.enrolledCourses.filter(
                    (c) => c.courseId.toString() !== courseId,
                );
            courseJustCompleted = true;
        }

        await user.save();

        return res.status(200).json({
            message: "Section marked as completed",
            completed: courseJustCompleted,
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

const getCourseById = async (req, res) => {
    const courseId = req.params.id;
    const userId = req.user.userId;

    try {
        const course = await Course.findById(courseId);
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
        console.log("is this completed, from courseController line 213");
        console.log(courseId, " ?== ", user.studentProfile.completedCourses);
        console.log(isCompleted);

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
                sections: course.sections,
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
};
