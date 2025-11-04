import Navbar from "../../components/Navbar";
import { useState } from "react";
import api from "../../utils/api";
import { ChevronRight } from "lucide-react";
import BackButton from "../BackBtn";
import { Link } from "react-router-dom";

function CourseOngoing({ course }) {
    console.log("logging course");
    console.log(course);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [completedSections, setCompletedSections] = useState(
        course.completedSections || [],
    ); // array of section indexes
    const [quizAnswers, setQuizAnswers] = useState({}); // { [questionIndex]: selectedOption }

    // const sections = course.sections || [];
    const modules = course.modules || [];
    console.log(modules[selectedIndex]._id);
    // const totalSections = sections.length;
    // console.log(`totalSections: ${totalSections}`);
    // const currentSection = sections[selectedIndex];
    // console.log(`course.completedSections: ${course.completedSections}`);

    // const handleNextSection = () => {
    //     console.log(`current section ${selectedIndex + 1}`);
    //     if (selectedIndex < totalSections - 1) {
    //         setSelectedIndex(selectedIndex + 1);
    //         console.log(selectedIndex);
    //     }
    // };
    // const handleMarkComplete = async () => {
    //     try {
    //         const response = await api.post(
    //             `/courses/${course.id}/section/${selectedIndex}/complete`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 },
    //             },
    //         );

    //         const data = await response.json();
    //         if (!response.ok)
    //             throw new Error(
    //                 data.message || "Failed to mark section complete",
    //             );

    //         if (data.completed) {
    //             alert("You've completed the entire course");
    //         }

    //         // Update completedSections state manually (or refetch if needed)
    //         setCompletedSections([...completedSections, selectedIndex]);
    //     } catch (err) {
    //         console.error("Error:", err.message);
    //     }
    // };

    // const handleQuizAnswer = (questionIndex, selected) => {
    //     setQuizAnswers({ ...quizAnswers, [questionIndex]: selected });
    // };

    // const handleSubmitQuiz = async (e) => {
    //     e.preventDefault();

    //     const answersArray = Object.values(quizAnswers); // ["A", "C", "D", ...]

    //     try {
    //         const response = await api.post(
    //             `/courses/${course.id}/section/${selectedIndex}/quiz`,
    //             { answers: answersArray },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 },
    //                 // body: JSON.stringify({ answers: answersArray }),
    //             },
    //         );

    //         const data = await response.json();

    //         if (!response.ok)
    //             throw new Error(data.message || "Quiz submission failed");

    //         if (data.message === "Quiz passed") {
    //             alert(`✅ Quiz passed! Score: ${data.score}`);
    //             // setCompletedSections([...completedSections, selectedIndex]); // update state
    //             handleMarkComplete();
    //         } else {
    //             alert(`❌ Quiz failed. Score: ${data.score}`);
    //         }
    //     } catch (err) {
    //         console.error("Error submitting quiz:", err.message);
    //         alert("An error occurred while submitting the quiz.");
    //     }
    // };

    return (
        <>
            <Navbar />
            <main>
                <div className="main-content flex border border-[var(--shadow)]">
                    <div className="flex flex-col h-full w-[20vw] border-r-2 border-[var(--shadow)] p-6">
                        <BackButton />
                        <h2 className="text-left text-2xl font-semibold mb-[2rem]">
                            Modules
                        </h2>
                        <ul className="text-left">
                            {modules.map((module, index) => (
                                <li
                                    key={index}
                                    className={`transition duration-150 ease-in-out cursor-pointer p-2 mb-3 ${
                                        selectedIndex === index
                                            ? "selected-index"
                                            : "unselected-index"
                                    }`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <p className="text-[0.9rem]">
                                        Module {index + 1}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 text-left">
                        <h2 className="font-bold text-3xl ml-6 mt-5">
                            {modules[selectedIndex].title}
                        </h2>
                        <p className=" ml-6 mt-5">
                            {modules[selectedIndex].description}
                        </p>
                        <ul className="ml-6 mt-6 mr-6">
                            {modules[selectedIndex].sections.map(
                                (section, index) => (
                                    <li
                                        key={index}
                                        className="text-xs  first:rounded-t-2xl last:rounded-b-2xl hover:bg-[var(--highlighted)] border border-b-0 last:border-b-1 hover:cursor-pointer transition duration-200 ease-in-out border-[var(--highlighted)]"
                                    >
                                        <Link
                                            to={`/courses/${course.id}/${modules[selectedIndex]._id}/sections/${section._id}`}
                                            className="p-[14px] flex h-full w-full"
                                        >
                                            <div className="flex-1">
                                                <span className="mr-[6px]">
                                                    {index + 1}.
                                                </span>
                                                {section.title}
                                            </div>
                                            <div className="w-[20px]">
                                                <ChevronRight size={16} />
                                            </div>
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CourseOngoing;
