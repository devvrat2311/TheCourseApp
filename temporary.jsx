import Navbar from "../../components/Navbar";

function StudentDashboard() {
    return (
        <>
            <Navbar />
            <main>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">My Courses</h1>
                </div>
            </main>
        </>
    );
}

export default StudentDashboard;
const submitQuiz = async (req, res) => {
    const { courseId, sectionIndex } = req.params;
    const userId = req.user.userId;
    const { answers } = req.body; // e.g., ["B", "C", "D"]

    try {
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);
        if (!course || !user)
            return res
                .status(404)
                .json({ message: "Course or User not found" });

        const section = course.sections[sectionIndex];
        if (!section || !section.quiz || section.quiz.length === 0)
            return res
                .status(400)
                .json({ message: "No quiz found for this section" });

        // Validate quiz
        const correctAnswers = section.quiz.map((q) => q.correctAnswer);
        const score = answers.reduce(
            (acc, ans, i) => (ans === correctAnswers[i] ? acc + 1 : acc),
            0,
        );
        const passed = score === correctAnswers.length;

        if (passed) {
            const enrolledCourse = user.studentProfile.enrolledCourses.find(
                (c) => c.courseId.toString() === courseId,
            );

            if (!enrolledCourse)
                return res.status(400).json({ message: "User not enrolled" });

            if (
                !enrolledCourse.completedSections.includes(Number(sectionIndex))
            ) {
                enrolledCourse.completedSections.push(Number(sectionIndex));
            }

            enrolledCourse.quizScores.push({
                sectionIndex: Number(sectionIndex),
                score,
            });

            await user.save();
            return res.status(200).json({ message: "Quiz passed", score });
        } else {
            return res.status(200).json({ message: "Quiz failed", score });
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
