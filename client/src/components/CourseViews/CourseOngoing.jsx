import Navbar from "../../components/Navbar";
import { useState } from "react";

function CourseOngoing({ course }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [completedSections, setCompletedSections] = useState(
        course.completedSections || [],
    ); // array of section indexes
    const [quizAnswers, setQuizAnswers] = useState({}); // { [questionIndex]: selectedOption }

    const sections = course.sections || [];
    const currentSection = sections[selectedIndex];

    const handleMarkComplete = async () => {
        try {
            const response = await fetch(
                `/api/courses/${course.id}/section/${selectedIndex}/complete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                },
            );

            const data = await response.json();
            if (!response.ok)
                throw new Error(
                    data.message || "Failed to mark section complete",
                );

            if (data.completed) {
                alert("You've completed the entire course");
            }

            // Update completedSections state manually (or refetch if needed)
            setCompletedSections([...completedSections, selectedIndex]);
        } catch (err) {
            console.error("Error:", err.message);
        }
    };

    const handleQuizAnswer = (questionIndex, selected) => {
        setQuizAnswers({ ...quizAnswers, [questionIndex]: selected });
    };

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();

        const answersArray = Object.values(quizAnswers); // ["A", "C", "D", ...]

        try {
            const response = await fetch(
                `/api/courses/${course.id}/section/${selectedIndex}/quiz`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ answers: answersArray }),
                },
            );

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Quiz submission failed");

            if (data.message === "Quiz passed") {
                alert(`✅ Quiz passed! Score: ${data.score}`);
                // setCompletedSections([...completedSections, selectedIndex]); // update state
                handleMarkComplete();
            } else {
                alert(`❌ Quiz failed. Score: ${data.score}`);
            }
        } catch (err) {
            console.error("Error submitting quiz:", err.message);
            alert("An error occurred while submitting the quiz.");
        }
    };

    return (
        <>
            <Navbar />
            <main className="pr-0 border-2">
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <aside className="w-1/4 p-4 border-r">
                        <h2 className="text-xl font-semibold mb-4">
                            {course.title}
                        </h2>
                        <ul>
                            {sections.map((section, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer p-2 rounded mb-2 ${
                                        selectedIndex === index
                                            ? "bg-blue-900 text-white"
                                            : "hover:bg-gray-200 hover:text-black"
                                    }`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{section.title}</span>
                                        <span>
                                            {section.quiz?.length > 0
                                                ? "📝"
                                                : ""}
                                            {completedSections.includes(index)
                                                ? "✅"
                                                : ""}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main content */}
                    <div className="flex flex-col flex-1 justify-center place-items-center">
                        <h2 className="text-2xl font-bold mb-4">
                            {currentSection.title}
                        </h2>
                        <p className="mb-4">{currentSection.content}</p>

                        {currentSection.quiz?.length > 0 ? (
                            <form className="mb-4" onSubmit={handleSubmitQuiz}>
                                <h3 className="font-semibold text-lg mb-2">
                                    Quiz
                                </h3>
                                {currentSection.quiz.map((q, i) => (
                                    <div key={i} className="mb-3">
                                        <p className="font-medium">
                                            {q.question}
                                        </p>
                                        {q.options.map((opt, j) => (
                                            <label
                                                key={j}
                                                className="block ml-4"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${i}`}
                                                    value={opt}
                                                    checked={
                                                        quizAnswers[i] === opt
                                                    }
                                                    onChange={() =>
                                                        handleQuizAnswer(i, opt)
                                                    }
                                                />
                                                <span className="ml-2">
                                                    {opt}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                                >
                                    Submit Quiz
                                </button>
                            </form>
                        ) : (
                            !completedSections.includes(selectedIndex) && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Mark as Completed
                                </button>
                            )
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default CourseOngoing;
