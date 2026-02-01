import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import ClickyBtn from "../../components/ClickyBtn";
import { useFlash } from "../../contexts/FlashContext";

function CreateCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { showFlash } = useFlash();
    const [moduleTitle, setModuleTitle] = useState("");
    const [moduleDescription, setModuleDescription] = useState("");
    const [moduleObjective, setModuleObjective] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                title: moduleTitle,
                description: moduleDescription,
                learningObjective: moduleObjective,
            };

            const response = await api.post(
                `/courses/${courseId}/modules/create`,
                formData,
            );
            const data = await response.json();
            const newModuleId = data.newModuleId;
            if (response.ok) {
                showFlash("Module Created!", "info");
                navigate(
                    `/instructor/courses/${courseId}/modules/${newModuleId}/edit`,
                );
            }
            // const data = await response.json();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="create-course-overlay"
            onClick={() => {
                navigate(`/instructor/courses/${courseId}/edit`);
            }}
        >
            <div
                className="create-course small-fit"
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <p className="popup-form-title">Create Module</p>
                    <form
                        onSubmit={handleSubmit}
                        className="p-2 flex flex-col gap-2 text-left mt-[30px]"
                    >
                        <div className="flex flex-col">
                            <label
                                htmlFor="title"
                                className="text-xs text-left mb-1 ml-1 mt-3"
                            >
                                title
                            </label>
                            <textarea
                                type="text"
                                name="title"
                                className="input-class p-2"
                                value={moduleTitle}
                                onChange={(e) => setModuleTitle(e.target.value)}
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                                rows={1}
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="description"
                                className="text-xs text-left mb-1 ml-1 mt-3"
                            >
                                description
                            </label>
                            <textarea
                                name="description"
                                className="input-class p-2"
                                value={moduleDescription}
                                onChange={(e) =>
                                    setModuleDescription(e.target.value)
                                }
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                                rows={1}
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="objective"
                                className="text-xs text-left mb-1 ml-1 mt-3"
                            >
                                learning objective
                            </label>
                            <textarea
                                name="objective"
                                className="input-class p-2"
                                value={moduleObjective}
                                onChange={(e) =>
                                    setModuleObjective(e.target.value)
                                }
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                                rows={1}
                                required
                            />
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
                    <p className="text-xs text-[var(--border)] font-bold mt-2">
                        click outside the form to exit
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
