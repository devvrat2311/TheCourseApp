import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useFlash } from "../../contexts/FlashContext";

function CreateQuizQuestion() {
    const { showFlash } = useFlash();
    const navigate = useNavigate();
    const { courseId, moduleId, sectionId } = useParams();
    const [quizQuestion, setQuizQuestion] = useState("");
    const [quesOptions, setQuesOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState("");
    const optionRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("am being triggered");

        if (quesOptions.length < 2) {
            showFlash("Please add at least 2 options", "error");
            return;
        }

        if (!quesOptions.includes(correctOption)) {
            showFlash("Correct answer must be one of the options");
            return;
        }

        try {
            const dataToSend = {
                question: quizQuestion,
                options: quesOptions,
                correctAnswer: correctOption,
            };

            const res = await api.post(
                `/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/quiz-questions`,
                dataToSend,
            );
            // const res = await api.post("/course/example", dataToSend);

            const data = await res.json();
            console.log("yoooo from createContentBlock", data);
            navigate(
                `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit`,
            );
        } catch (err) {
            console.log("HI error is happen: ", err);
        }
    };

    const addOption = () => {
        if (optionRef.current && optionRef.current.value.trim()) {
            const newOption = optionRef.current.value.trim();
            if (!quesOptions.includes(newOption)) {
                setQuesOptions([...quesOptions, optionRef.current.value]);
                optionRef.current.value = "";
            } else {
                showFlash("This Option already exists!", "error");
            }
        }
    };
    const removeOption = () => {
        if (quesOptions.length > 0) {
            setQuesOptions(quesOptions.slice(0, -1));
        }
    };
    return (
        <div className="main-content">
            <div className="flex-1 text-left">
                <form
                    onSubmit={handleSubmit}
                    className="form-block flex flex-col w-fit"
                >
                    <label htmlFor="question">Question</label>
                    <input
                        type="text"
                        name="question"
                        id="question"
                        className="border-2"
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        required
                    />

                    <label htmlFor="options">Options</label>

                    {quesOptions.map((q, i) => {
                        return <div key={i}>{q}</div>;
                    })}
                    <input
                        ref={optionRef}
                        type="text"
                        name="option"
                        id="option"
                        className="border-2"
                    />
                    <button
                        type="button"
                        onClick={addOption}
                        className="border-2 mt-1"
                    >
                        Add Option
                    </button>
                    <button
                        type="button"
                        onClick={removeOption}
                        className="border-2 mt-1"
                    >
                        Remove Option
                    </button>
                    <label htmlFor="correctAnswer">Correct Answer</label>
                    <select
                        name="correctAnswer"
                        id="correctAnswer"
                        className="border-2 bg-[var(--accent)] rounded decoration-0"
                        value={correctOption}
                        onChange={(e) => setCorrectOption(e.target.value)}
                        required
                    >
                        <option value="" className="bg-[var(--border)]">
                            Select correct answer
                        </option>
                        {quesOptions.map((option, i) => (
                            <option
                                key={i}
                                value={option}
                                className="bg-[var(--border)]"
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="border-2 mt-2 cursor-pointer"
                    >
                        Create Quiz Question +
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateQuizQuestion;
