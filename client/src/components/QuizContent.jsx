import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useFlash } from "../contexts/FlashContext";

export default function QuizContent({ sectionData, onQuizComplete }) {
    const { showFlash } = useFlash();
    const { courseId, moduleId, sectionId } = useParams();

    // const [currentQuizCompleted, setCurrentQuizCompleted] =
    //     useState(isSectionCompleted);
    const quizData = sectionData.quiz;
    const [quizAnswers, setQuizAnswers] = useState({});

    const resetQuiz = () => {
        setQuizAnswers([]);
    };

    const handleQuizAnswer = (questionIndex, selectedAnswer) => {
        setQuizAnswers({ ...quizAnswers, [questionIndex]: selectedAnswer });
    };

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();

        const submission = quizData.map((q, idx) => ({
            question: q.question,
            answer: quizAnswers[idx],
        }));

        console.log("here is the answersArray", submission);
        try {
            const response = await api.post(
                `/api/v1/courses/${courseId}/${moduleId}/sections/${sectionId}/submit-quiz`,
                { answers: submission },
            );
            const data = await response.json();
            console.log("quizComplete response data", data);
            if (!data.passed) {
                resetQuiz();
                showFlash("Quiz Failed, please try again", "info");
            } else {
                onQuizComplete();
                showFlash("Quiz Passed, Congrax!", "info");
            }
        } catch (err) {
            console.log(err);
        }
        // const answersArray = Object.values(quizAnswers);
    };

    console.log("quizAnswers", quizAnswers);
    return (
        <div className="ml-6">
            <>
                <form className="mr-6 mb-5 p-4" onSubmit={handleSubmitQuiz}>
                    {quizData.map((quizQuestion, questionIndex) => (
                        <div
                            className="first:rounded-t-xl last:rounded-b-xl border border-b-0 last:border-b-2 border-[var(--shadow)] p-4"
                            key={questionIndex}
                        >
                            <p className="font-bold text-[var(--shadow)]">
                                {quizQuestion.question}
                            </p>
                            {quizQuestion.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <label
                                        key={optionIndex}
                                        className="block ml-4 mt-2"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${questionIndex}`}
                                            value={option}
                                            checked={
                                                quizAnswers[questionIndex] ===
                                                option
                                            }
                                            onChange={() => {
                                                handleQuizAnswer(
                                                    questionIndex,
                                                    option,
                                                );
                                            }}
                                        />
                                        <span className="ml-2 text-xs">
                                            {option}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="absolute bottom-6 left-6 text-xs bg-green-200 text-black px-4 py-2 font-bold mt-4"
                    >
                        Submit Quiz
                    </button>
                </form>
            </>
        </div>
    );
}
