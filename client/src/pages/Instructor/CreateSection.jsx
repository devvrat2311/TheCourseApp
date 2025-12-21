import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { useFlash } from "../../contexts/FlashContext";

function CreateSection() {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionType, setSectionType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                title: sectionTitle,
                sectionType: sectionType,
            };
            console.log("Form data", formData);

            const response = await api.post(
                `/courses/${courseId}/modules/${moduleId}/sections/create`,
                formData,
            );
            const data = await response.json();
            console.log("showing data", data);
            const newSectionId = data.sectionId;
            if (response.ok) {
                showFlash("Section Created!", "info");
                navigate(
                    `/instructor/courses/${courseId}/modules/${moduleId}/sections/${newSectionId}/edit`,
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(
                    `/instructor/courses/${courseId}/modules/${moduleId}/edit`,
                );
            }}
        >
            <div
                className="create-course max-h-fit max-w-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-1">
                    <p className="popup-form-title">Create Section</p>
                    <form
                        onSubmit={handleSubmit}
                        className="h-full p-2 flex flex-col gap-2 text-left"
                    >
                        <div className="flex-1">
                            <p className="my-2 mx-1">Section Type</p>
                            <div className="radio-buttons-container">
                                <div className="radio-button">
                                    <input
                                        name="sectionType"
                                        id="normal"
                                        className="radio-button__input"
                                        type="radio"
                                        value="normal"
                                        onChange={(e) =>
                                            setSectionType(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor="normal"
                                        className="radio-button__label"
                                    >
                                        <span className="radio-button__custom"></span>
                                        Normal
                                    </label>
                                </div>
                                <div className="radio-button">
                                    <input
                                        name="sectionType"
                                        id="quiz"
                                        className="radio-button__input"
                                        type="radio"
                                        value="quiz"
                                        onChange={(e) =>
                                            setSectionType(e.target.value)
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor="quiz"
                                        className="radio-button__label"
                                    >
                                        <span className="radio-button__custom"></span>
                                        quiz
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="title"
                                    className="text-xs text-left mb-[6px] ml-1 mt-3"
                                >
                                    title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="input-class p-2"
                                    value={sectionTitle}
                                    onChange={(e) =>
                                        setSectionTitle(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <ClickyBtn
                            buttonType={"submit"}
                            stylingClass={"back-btn center-btn login-btn"}
                        >
                            <div className="flex gap-2 items-center px-[3rem] py-[0.4rem]">
                                <p>Create +</p>
                            </div>
                        </ClickyBtn>
                    </form>
                    <p className="text-xs text-[var(--border)] font-bold">
                        click outside the form to exit
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateSection;
