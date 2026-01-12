import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useFlash } from "../contexts/FlashContext";

export default function CompletedQuizContent() {
    const { courseId, moduleId, sectionId } = useParams();
    const [quizSectionData, setQuizSectionData] = useState(null);
    const [userMarks, setUserMarks] = useState(0);
    const [totalMarks, setTotalMarks] = useState(0);
    const [error, setError] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    // const [selectedSectionId, setSelectedSectionId] = useState(sectionId);
    const { showFlash } = useFlash();
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleNextSection = async () => {
        setIsAnimating(true);
        // let nextSectionId;
        // let nextModuleId;
        try {
            const response = await api.get(
                `/courses/${courseId}/${moduleId}/sections/${sectionId}/next`,
            );
            const data = await response.json();
            console.log("data is", data);
            // nextSectionId = data.nextSectionId.toString();
            // nextModuleId = data.nextModuleId?.toString();
            // console.log("these are the next ids", nextSectionId, nextModuleId);
            //
            setTimeout(() => {
                setIsAnimating(false);
                console.log("Next Next Next");
                if (data.nextModuleId && data.nextSectionId) {
                    navigate(
                        `/student/courses/${courseId}/${data.nextModuleId}/sections/${data.nextSectionId}`,
                    );
                    scrollToTop();
                } else {
                    navigate(`/student/courses/${courseId}`);
                    showFlash(
                        "Congratulations! You completed the course",
                        "success",
                    );
                    scrollToTop();
                }
            }, 200);
        } catch (err) {
            console.error("error error error", err.message);
        }
    };

    useEffect(() => {
        const getCompletedQuizData = async () => {
            try {
                const response = await api.get(
                    `/courses/${courseId}/${moduleId}/sections/${sectionId}/completed-quiz`,
                );
                const data = await response.json();
                console.log(data);
                setQuizSectionData(data.quizSection);
                setUserMarks(data.quizScore.score);
                setTotalMarks(data.quizScore.maxMarks);
            } catch (err) {
                setError(err);
            } finally {
                setDataLoading(false);
            }
        };
        getCompletedQuizData();
    }, [courseId, moduleId, sectionId]);

    if (dataLoading) return <p>Loading Quiz Section. . .</p>;
    if (error) {
        return <p className="text-blue-500">Error: {error.message}</p>;
    }
    if (!quizSectionData) return <p>No Quiz Section Data found</p>;

    return (
        <>
            <p className="ml-6 mt-5 bg-[var(--bg)] rounded-xl p-4 inline-block">
                Score: {userMarks}/{totalMarks}
            </p>
            <p className="ml-6 mt-5">Correct Answers</p>
            <div className="ml-6 mr-6">
                {quizSectionData.quiz.map((ques, quesIndex) => (
                    <div key={quesIndex} className="mt-3 rounded-xl">
                        <p className="text-xl font-semibold text-[var(--accent)]">
                            {ques.question}
                        </p>
                        <p className="mt-2">{ques.correctAnswer}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-[var(--border)] rounded-b-2xl">
                <button
                    className={`back-btn w-auto px-[1rem] py-[0.4rem] ${isAnimating ? "active" : ""}`}
                    onClick={handleNextSection}
                >
                    Next
                </button>
            </div>
        </>
    );
}
