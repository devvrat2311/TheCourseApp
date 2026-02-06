import { useState, useRef } from "react";
import {
    useParams,
    useNavigate,
    useSearchParams,
    useLocation,
} from "react-router-dom";
import api from "../../utils/api";
import { useFlash } from "../../contexts/FlashContext";
import {
    PlusCircle,
    MinusCircle,
    CircleDashed,
    CheckCircle2,
} from "lucide-react";
import ClickyBtn from "../../components/ClickyBtn";

function CreateQuizQuestion() {
    const [params] = useSearchParams();
    const index = params.get("index");
    const { content } = useLocation().state;
    const { showFlash } = useFlash();
    const navigate = useNavigate();
    const { courseId, moduleId, sectionId } = useParams();
    const [quizQuestion, setQuizQuestion] = useState(content.question);
    const [quesOptions, setQuesOptions] = useState(content.options);
    const [correctOption, setCorrectOption] = useState(content.correctAnswer);
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
                questionData: {
                    question: quizQuestion,
                    options: quesOptions,
                    correctAnswer: correctOption,
                },
                index: index,
            };

            const res = await api.patch(
                `/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/quiz-questions`,
                dataToSend,
            );

            const data = await res.json();
            console.log("yoooo from editQuizQuestion page", data);
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
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(
                    `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit`,
                );
            }}
        >
            <div
                className="create-course small-fit max-h-fit max-w-[350px]"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="popup-form-title flex justify-between">
                    Edit Quiz Question
                </p>
                <div className="flex-1 text-left flex flex-col">
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 form-block flex flex-col gap-2 w-fit justify-center p-2"
                        autoComplete="off"
                    >
                        <label
                            // htmlFor="question"
                            className="text-xs"
                        >
                            Question
                        </label>
                        <textarea
                            type="text"
                            name="question"
                            id="question"
                            placeholder="Enter Question"
                            className="input-class p-2"
                            value={quizQuestion}
                            onChange={(e) => setQuizQuestion(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            onFocus={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height =
                                    e.target.scrollHeight + "px";
                            }}
                            rows={2}
                            required
                        />
                        <label htmlFor="options" className="text-xs">
                            Add/Remove Options
                        </label>
                        <input
                            ref={optionRef}
                            type="text"
                            name="option"
                            placeholder="Enter Option"
                            id="option"
                            className="input-class p-2"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={removeOption}
                                className="text-[var(--error-red)] font-bold flex gap-1 items-center justify-center cursor-pointer border-2 border-[var(--error-red)] rounded p-1 text-xs mt-1 bg-[var(--error-red-lighter)] flex-1"
                            >
                                <MinusCircle
                                    size={16}
                                    className="text-[var(--error-red)]"
                                />
                                {/* <p>Remove Option</p>*/}
                            </button>
                            <button
                                type="button"
                                onClick={addOption}
                                className="text-[var(--success-green)] font-bold flex gap-1 items-center justify-center cursor-pointer border-2 border-[var(--success-green)] rounded p-1 text-xs mt-1 bg-[var(--success-green-lighter)] flex-1"
                            >
                                <PlusCircle size={16} />
                                {/* <p>Add Option</p>*/}
                            </button>
                        </div>
                        {quesOptions.length !== 0 ? (
                            <p className="text-xs">Select a correct option</p>
                        ) : (
                            ""
                        )}
                        {quesOptions.map((q, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`cursor-default flex justify-between transition-all duration-150 p-1 rounded-[10px] border-2 ${q === correctOption ? "border-[var(--accent)] bg-[var(--bg-secondary)]" : "border-[var(--border)]"}`}
                                    onClick={() => {
                                        setCorrectOption(q);
                                    }}
                                >
                                    {q}
                                    {q === correctOption ? (
                                        <CheckCircle2 />
                                    ) : (
                                        <CircleDashed />
                                    )}
                                </div>
                            );
                        })}
                        {/* <label htmlFor="correctAnswer">Correct Answer</label>
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
                        </select>*/}
                        {/* <button
                            type="submit"
                            className="border-2 mt-2 cursor-pointer"
                        >
                            Create Quiz Question +
                        </button>*/}
                        <ClickyBtn
                            buttonType={"submit"}
                            stylingClass={"back-btn center-btn mb-2 login-btn"}
                        >
                            <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                <p>Create +</p>
                            </div>
                        </ClickyBtn>
                    </form>

                    <p className="text-xs text-[var(--border)] font-bold text-center">
                        click outside the form to exit
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateQuizQuestion;
