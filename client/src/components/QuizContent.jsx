import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useFlash } from "../contexts/FlashContext";
import ClickyBtn from "./ClickyBtn";

export default function QuizContent({ sectionData, onQuizComplete }) {
    const { showFlash } = useFlash();
    const { courseId, moduleId, sectionId } = useParams();

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
                showFlash("Quiz Failed, please try again", "error");
            } else {
                onQuizComplete(data.completedSections);
                showFlash("Quiz Passed, Congrax!", "success");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="ml-6 ">
            <form
                className="mr-6 mb-5 border-2 border-[var(--border)] rounded-[19px]"
                onSubmit={handleSubmitQuiz}
            >
                {quizData.map((quizQuestion, questionIndex) => (
                    <div className="p-4" key={questionIndex}>
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

                <div className="mt-6 p-4 bg-[var(--border)] rounded-b-2xl">
                    <ClickyBtn stylingClass={"back-btn px-[1rem] py-[0.4rem]"} buttonType={"submit"}>
                        Submit
                    </ClickyBtn>
                </div>
            </form>
        </div>
    );
}
