import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function CompletedQuizContent() {
    const { courseId, moduleId, sectionId } = useParams();
    const [quizSectionData, setQuizSectionData] = useState(null);
    const [userMarks, setUserMarks] = useState(0);
    const [totalMarks, setTotalMarks] = useState(0);
    const [error, setError] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const getCompletedQuizData = async () => {
            try {
                const response = await api.get(
                    `/api/v1/courses/${courseId}/${moduleId}/sections/${sectionId}/completed-quiz`,
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
        return <p className="text-blue-500">Error: {error}</p>;
    }
    if (!quizSectionData) return <p>No Quiz Section Data found</p>;

    return (
        <>
            <div className="ml-6 mr-6 mt-2">
                {quizSectionData.quiz.map((ques, quesIndex) => (
                    <div key={quesIndex} className="mt-3">
                        <p className="text-xl font-semibold">
                            {/* <span className="font-bold mr-2">Q.</span>*/}
                            {ques.question}
                        </p>
                        <p className="mt-2">
                            {/* <span className="font-bold mr-2">A.</span>*/}
                            {ques.correctAnswer}
                        </p>
                    </div>
                ))}
            </div>
            <p className=" ml-6 mt-5 bg-green-400 rounded border-2 border-[var(--shadow)] p-2 inline-block">
                Your Score: {userMarks}/{totalMarks}
            </p>
        </>
    );
}
